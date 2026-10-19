// Get the HTML elements we need
let difficulty = document.getElementById("difficulty");
let getQuestionButton = document.getElementById("getQuestionButton");

let question = document.getElementById("question");
let answers = document.getElementById("answers");

let result = document.getElementById("result");
let scoreDisplay = document.getElementById("score");

let nextQuestionButton =
    document.getElementById("nextQuestionButton");

let errorMessage =
    document.getElementById("errorMessage");


// Keep track of the score
let score = 0;


// Store the correct answer
let correctAnswer = "";


// Get a question when the button is clicked
getQuestionButton.addEventListener("click", function() {

    getQuestion();

});


// Get the next question
nextQuestionButton.addEventListener("click", function() {

    getQuestion();

});


// Get a trivia question from the API
function getQuestion() {

    // Clear previous information
    result.textContent = "";
    errorMessage.textContent = "";

    answers.innerHTML = "";

    nextQuestionButton.style.display = "none";


    // Get the selected difficulty
    let selectedDifficulty = difficulty.value;


    // Create the API URL
    let url =
        "https://opentdb.com/api.php"
        + "?amount=1"
        + "&difficulty=" + selectedDifficulty
        + "&type=multiple"
        + "&encode=url3986";


    // Make the API call
    fetch(url)

        .then(function(response) {

            return response.json();

        })

        .then(function(data) {

            // Check if the API returned a question
            if (data.response_code !== 0) {

                errorMessage.textContent =
                    "There was a problem getting a question.";

                return;
            }


            // Get the question information
            let questionData = data.results[0];


            // Display the question
            question.textContent =
                decodeURIComponent(questionData.question);


            // Store the correct answer
            correctAnswer =
                decodeURIComponent(questionData.correct_answer);


            // Get all the answers
            let incorrectAnswers =
                questionData.incorrect_answers.map(function(answer) {

                    return decodeURIComponent(answer);

                });


            // Add the correct answer to the list
            let allAnswers =
                incorrectAnswers.concat(correctAnswer);


            // Shuffle the answers
            allAnswers.sort(function() {

                return Math.random() - 0.5;

            });


            // Display the answers
            displayAnswers(allAnswers);

        })

        .catch(function(error) {

            errorMessage.textContent =
                "There was a problem connecting to the API.";

            console.log(error);

        });
}


// Display the answer buttons
function displayAnswers(allAnswers) {

    answers.innerHTML = "";


    for (let i = 0; i < allAnswers.length; i++) {

        let answerButton =
            document.createElement("button");


        answerButton.className =
            "btn btn-outline-primary answer-button";


        answerButton.textContent =
            allAnswers[i];


        answerButton.addEventListener("click", function() {

            checkAnswer(allAnswers[i]);

        });


        answers.appendChild(answerButton);
    }
}


// Check if the user's answer is correct
function checkAnswer(selectedAnswer) {

    if (selectedAnswer === correctAnswer) {

        result.textContent = "Correct!";

        score++;

        scoreDisplay.textContent = score;

    } else {

        result.textContent =
            "Incorrect. The correct answer was: "
            + correctAnswer;

    }


    // Disable all answer buttons
    let answerButtons =
        document.querySelectorAll(".answer-button");


    for (let i = 0; i < answerButtons.length; i++) {

        answerButtons[i].disabled = true;

    }


    // Show the next question button
    nextQuestionButton.style.display = "block";
}