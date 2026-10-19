// Get the HTML elements we need

let cityInput = document.getElementById("cityInput");
let searchButton = document.getElementById("searchButton");

let cityName = document.getElementById("cityName");
let currentCondition = document.getElementById("currentCondition");
let currentTemperature = document.getElementById("currentTemperature");
let windSpeed = document.getElementById("windSpeed");
let rainChance = document.getElementById("rainChance");

let errorMessage = document.getElementById("errorMessage");


// When the Search button is clicked

searchButton.addEventListener("click", function() {

    let city = cityInput.value.trim();


    // Check if the user entered a city

    if (city === "") {

        errorMessage.textContent =
            "Please enter a city.";

        return;
    }


    // Remove any previous error

    errorMessage.textContent = "";


    // Find the city coordinates

    getCityCoordinates(city);

});


// Get latitude and longitude from the Geocoding API

function getCityCoordinates(city) {

    let url =
        "https://geocoding-api.open-meteo.com/v1/search?name="
        + encodeURIComponent(city)
        + "&count=1&language=en&format=json";


    // Make the API call

    fetch(url)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {


            // Check if the city was found

            if (!data.results || data.results.length === 0) {

                errorMessage.textContent =
                    "City not found. Please try again.";

                return;
            }


            // Get the first location from the API

            let location = data.results[0];


            // Get information from the API

            let latitude = location.latitude;
            let longitude = location.longitude;
            let name = location.name;
            let country = location.country;


            // Get weather using the coordinates

            getWeather(
                latitude,
                longitude,
                name,
                country
            );

        })

        .catch(function(error) {

            errorMessage.textContent =
                "There was a problem finding the city.";

            console.log(error);

        });
}


// Get weather information from Open-Meteo

function getWeather(
    latitude,
    longitude,
    name,
    country
) {

    let url =
        "https://api.open-meteo.com/v1/forecast"
        + "?latitude=" + latitude
        + "&longitude=" + longitude
        + "&current=temperature_2m,weather_code,wind_speed_10m"
        + "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code"
        + "&temperature_unit=fahrenheit"
        + "&wind_speed_unit=mph"
        + "&forecast_days=7"
        + "&timezone=auto";


    // Make the API call

    fetch(url)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {

            displayCurrentWeather(
                data,
                name,
                country
            );

            displayForecast(data);

        })

        .catch(function(error) {

            errorMessage.textContent =
                "There was a problem getting the weather.";

            console.log(error);

        });
}


// Display the current weather

function displayCurrentWeather(
    data,
    name,
    country
) {

    // Display city name

    cityName.textContent =
        name + ", " + country;


    // Display current temperature

    currentTemperature.textContent =
        Math.round(
            data.current.temperature_2m
        ) + "°F";


    // Display wind speed

    windSpeed.textContent =
        Math.round(
            data.current.wind_speed_10m
        ) + " mph";


    // Display today's rain chance

    rainChance.textContent =
        data.daily.precipitation_probability_max[0]
        + "%";


    // Display current weather condition

    currentCondition.textContent =
        getWeatherDescription(
            data.current.weather_code
        );
}


// Display the 7-day forecast

function displayForecast(data) {

    for (let i = 0; i < 7; i++) {


        // Day number starts at 1

        let dayNumber = i + 1;


        // Get information from the API

        let date =
            data.daily.time[i];

        let high =
            Math.round(
                data.daily.temperature_2m_max[i]
            );

        let low =
            Math.round(
                data.daily.temperature_2m_min[i]
            );

        let rain =
            data.daily.precipitation_probability_max[i];

        let weatherCode =
            data.daily.weather_code[i];


        // Convert weather code into text

        let weatherDescription =
            getWeatherDescription(
                weatherCode
            );


        // Convert weather code into an icon

        let weatherIcon =
            getWeatherIcon(
                weatherCode
            );


        // Update the HTML

        document.getElementById(
             "day" + dayNumber
        ).textContent =
            date;


        document.getElementById(
            "icon" + dayNumber
        ).textContent =
            weatherIcon;


        document.getElementById(
            "condition" + dayNumber
        ).textContent =
            weatherDescription;


        document.getElementById(
            "high" + dayNumber
        ).textContent =
            "High: " + high + "°F";


        document.getElementById(
            "low" + dayNumber
        ).textContent =
            "Low: " + low + "°F";


        document.getElementById(
            "rain" + dayNumber
        ).textContent =
            "Rain: " + rain + "%";

    }
}


// Convert the weather code into a description

function getWeatherDescription(code) {

    if (code === 0) {
        return "Clear sky";
    }

    if (code === 1 || code === 2) {
        return "Partly cloudy";
    }

    if (code === 3) {
        return "Cloudy";
    }

    if (code === 45 || code === 48) {
        return "Foggy";
    }

    if (code >= 51 && code <= 57) {
        return "Drizzle";
    }

    if (code >= 61 && code <= 67) {
        return "Rain";
    }

    if (code >= 71 && code <= 77) {
        return "Snow";
    }

    if (code >= 80 && code <= 82) {
        return "Rain showers";
    }

    if (code >= 85 && code <= 86) {
        return "Snow showers";
    }

    if (code >= 95) {
        return "Thunderstorm";
    }

    return "Unknown";
}


// Give each weather condition an emoji

function getWeatherIcon(code) {

    if (code === 0) {
        return "☀️";
    }

    if (code === 1 || code === 2) {
        return "🌤️";
    }

    if (code === 3) {
        return "☁️";
    }

    if (code === 45 || code === 48) {
        return "🌫️";
    }

    if (code >= 51 && code <= 67) {
        return "🌧️";
    }

    if (code >= 71 && code <= 77) {
        return "❄️";
    }

    if (code >= 80 && code <= 82) {
        return "🌦️";
    }

    if (code >= 85 && code <= 86) {
        return "🌨️";
    }

    if (code >= 95) {
        return "⛈️";
    }

    return "🌡️";
}
