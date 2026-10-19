// function to set the range

function setRange() {

    // place the values in the form into variables

    var lowValue = document.forms["rangeForm"]["lowValue"].value;

    var highValue = document.forms["rangeForm"]["highValue"].value;


    // validate that both values were entered

    if (lowValue == "" || highValue == "") {

        alert("Please enter both a low and high value.");

        return false;
    }


    // validate that the low value is smaller than the high value

    else if (Number(lowValue) >= Number(highValue)) {

        alert("The low value must be less than the high value.");

        return false;
    }


    else {

        // display the range

        document.getElementById("range").innerHTML =
            lowValue + " to " + highValue;


        // clear the numbers that were previously entered

        document.forms["myForm"]["allNumbers"].value = "";

        document.getElementById("mean").innerHTML = "";

        document.getElementById("median").innerHTML = "";

        alert("Range has been set.");

        return true;
    }
}



// function to validate and add a number

function validateANDadd() {

    // place the values in the forms into variables

    var lowValue =
        document.forms["rangeForm"]["lowValue"].value;

    var highValue =
        document.forms["rangeForm"]["highValue"].value;

    var theNewNumber =
        document.forms["myForm"]["newNumber"].value;

    var allNumbers =
        document.forms["myForm"]["allNumbers"].value;


    // validate that a range has been set

    if (lowValue == "" || highValue == "") {

        alert("Please set the range first.");

        return false;
    }


    // validate that something was entered

    else if (theNewNumber == "") {

        alert("Please enter a number.");

        return false;
    }


    // validate that the number is in the range

    else if (Number(theNewNumber) < Number(lowValue) ||
             Number(theNewNumber) > Number(highValue)) {

        alert("Please enter a number within the range.");

        document.forms["myForm"]["newNumber"].value = "";

        return false;
    }


    else {

        // add the new number to the previous numbers

        if (allNumbers == "") {

            allNumbers = theNewNumber;

        }

        else {

            allNumbers = allNumbers + "," + theNewNumber;

        }


        // save the numbers in the form

        document.forms["myForm"]["allNumbers"].value = allNumbers;


        // turn the stored numbers into an array

        var numberList = allNumbers.split(",").map(Number);


        // pass the numbers to the mean function

        var mean = calculateMean(numberList);


        // pass the numbers to the median function

        var median = calculateMedian(numberList);


        // display the mean

        document.getElementById("mean").innerHTML = mean;


        // display the median

        document.getElementById("median").innerHTML = median;


        // clear the input field

        document.forms["myForm"]["newNumber"].value = "";

        return true;
    }
}



// function to calculate the mean

function calculateMean(numberList) {

    var sum = 0;

    for (var i = 0; i < numberList.length; i++) {

        sum = sum + numberList[i];

    }

    var mean = sum / numberList.length;

    return mean;
}



// function to calculate the median

function calculateMedian(numberList) {

    // make a copy of the numbers

    var sortedNumbers = numberList.slice();


    // sort the numbers from smallest to largest

    sortedNumbers.sort(function(a, b) {
        return a - b;
    });


    // find the middle of the list

    var middle = Math.floor(sortedNumbers.length / 2);

    var median;


    // if there is an even number of values

    if (sortedNumbers.length % 2 == 0) {

        median =
            (sortedNumbers[middle - 1] +
             sortedNumbers[middle]) / 2;

    }

    // if there is an odd number of values

    else {

        median = sortedNumbers[middle];

    }


    return median;
}




