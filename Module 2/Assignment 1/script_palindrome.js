
// Get the form
let form = document.getElementById("palindromeForm");


// Palindrome object
let palindromeChecker = {

    word: "",
    algorithm: 0,
    caseSensitive: true,


    // Algorithm 1
    // Reverses the word and compares it
    checkAlgorithm1: function() {

        let reversedWord = "";

        for (
            let i = this.word.length - 1;
            i >= 0;
            i--
        ) {

            reversedWord += this.word[i];

        }

        return this.word === reversedWord;
    },


    // Algorithm 2
    // Compares characters from both ends
    checkAlgorithm2: function() {

        let left = 0;

        let right = this.word.length - 1;


        while (left < right) {

            if (
                this.word[left] !==
                this.word[right]
            ) {

                return false;

            }

            left++;

            right--;

        }

        return true;
    },


    // Algorithm 3
    // Compares each character with its opposite
    checkAlgorithm3: function() {

        let middle =
            Math.floor(this.word.length / 2);


        for (let i = 0; i < middle; i++) {

            if (
                this.word[i] !==
                this.word[
                    this.word.length - 1 - i
                ]
            ) {

                return false;

            }

        }

        return true;
    }

};



// Form submission
form.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get the word
    let word =
        document.getElementById("word").value.trim();


    // Get the algorithm
    let algorithm =
        Number(
            document.getElementById("algorithm").value
        );


    // Get case sensitivity
    let caseOption =
        document.querySelector(
            'input[name="caseOption"]:checked'
        ).value;



    // Validate word
    if (word === "") {

        alert("Please enter a word.");

        return;

    }



    // Validate algorithm
    if (
        algorithm !== 1 &&
        algorithm !== 2 &&
        algorithm !== 3
    ) {

        alert(
            "Please enter 1, 2, or 3 for the algorithm."
        );

        return;

    }



    // Make the word lowercase
    // if case insensitive is selected
    if (caseOption === "insensitive") {

        word = word.toLowerCase();

    }

    // Store information in the object
    palindromeChecker.word = word;

    palindromeChecker.algorithm = algorithm;

    palindromeChecker.caseSensitive =
        caseOption === "sensitive";



    // Variable for result
    let result;


    // Choose the algorithm
    if (algorithm === 1) {

        result =
            palindromeChecker.checkAlgorithm1();

    }

    else if (algorithm === 2) {

        result =
            palindromeChecker.checkAlgorithm2();

    }

    else {

        result =
            palindromeChecker.checkAlgorithm3();

    }



    // Display the result
    displayResult(
        word,
        algorithm,
        result
    );

});



// Function to display the result
function displayResult(
    word,
    algorithm,
    result
) {

    // Create a new list item
    let listItem =
        document.createElement("li");


    // Check the result
    if (result === true) {

        listItem.textContent =
            word + " is a palindrome";

        listItem.classList.add(
            "palindrome"
        );

    }

    else {

        listItem.textContent =
            word + " is not a palindrome";

        listItem.classList.add(
            "not-palindrome"
        );

    }


    // Put the result into
    // the correct algorithm list

    if (algorithm === 1) {

        document
            .getElementById("algorithm1Results")
            .appendChild(listItem);

    }

    else if (algorithm === 2) {

        document
            .getElementById("algorithm2Results")
            .appendChild(listItem);

    }

    else {

        document
            .getElementById("algorithm3Results")
            .appendChild(listItem);

    }

}
