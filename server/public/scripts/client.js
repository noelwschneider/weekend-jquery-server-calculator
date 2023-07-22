$(document).ready(onReady)

// VARIABLES
// Object to send to the server when the submit (=) button is clicked
let serverPackage = {
    number: [],
    operator: [],
    parentheses: []
}

// Variable to hold information about the most recently selected button
    // Used to push numbers to the calculation display and unselect operator buttons
let lastClicked = {
    value: '',
    type: ''
}



function onReady() {
    console.log('in onReady')

    // Listener functions
    //$('.number-btn').on('click', numberBtn)
    $('.number-btn').on('click', numberBtn)
}

// FUNCTIONS

// Function that appends number (or decimal) to the input value
function numberBtn(event){
    event.preventDefault()

    // Variable to hold string with current display screen value
    let inputScreen = $('#input-display').val()
    // Variable to hold the selected number
    let clickedChar = $(this).text()

    // Conditional to send input screen value to the calculation display if the last button clicked was an operator
    if(lastClicked.type == operator) {
        serverPackage.number.push(inputScreen)
        serverPackage.operator.push(lastClicked.value)
    }

    // Validation to reject a second decimal point
    if (clickedChar == "." && inputScreen.includes(".") == true ) {
        $('#error-message').text("Input cannot include multiple decimal points")
        return
    }

    // Validation to reject leading zeros
    if (clickedChar == '0' && inputScreen == "") {
        return
    }

    $('#error-message').text('')
    inputScreen += clickedChar
    console.log(inputScreen)
    $('#input-display').val(inputScreen)

    // Updating the status of lastClicked
    lastClicked.type = 'number'
    lastClicked.value = clickedChar
}





