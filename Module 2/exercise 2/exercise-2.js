async function getBaconipsum() {

    var apiString = "https://baconipsum.com/api/";

    // Get the number of paragraphs selected by the user
    var theNewParagraphs =
        document.getElementById("newParagraphs").value;

    // Get the type of Bacon Ipsum selected by the user
    var theBaconType =
        document.getElementById("baconType").value;

    apiString = apiString +
        "?type=" + theBaconType +
        "&paras=" + theNewParagraphs;


    alert(apiString);

    // Make the API call
    var response = await fetch(apiString);


    document.getElementById("myRawData").innerHTML = "";
    document.getElementById("myFormattedData").innerHTML = "";
    document.getElementById("myEncryptedData").innerHTML = "";

    // Read the response as JSON
    var jsonData = await response.json();

    // Display the raw JSON
    document.getElementById("myRawData").innerHTML =
        JSON.stringify(jsonData);

    // Display the formatted paragraphs
    for (var para in jsonData) {

        document.getElementById("myFormattedData").innerHTML +=
            "<p>" + jsonData[para] + "</p>";
    }

    // Encrypt each paragraph
    for (var para in jsonData) {

        var encryptedParagraph =
            encryptData(jsonData[para]);

        document.getElementById("myEncryptedData").innerHTML +=
            "<p>" + encryptedParagraph + "</p>";
    }

    return true;
}



function encryptData(text) {

    var alphabet = "abcdefghijklmnopqrstuvwxyz";
    var encrypted = "";

    for (var i = 0; i < text.length; i++) {

        var letter = text[i].toLowerCase();
        var position = alphabet.indexOf(letter);

        if (position != -1) {
            var newPosition = (position + 1) % 26;
            encrypted += alphabet[newPosition];
        } else {
            encrypted += text[i];
        }
    }

    return encrypted;
}

