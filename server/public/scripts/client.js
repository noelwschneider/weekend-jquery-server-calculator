$(document).ready(onReady)

// VARIABLES
// Object to send to the server when the submit (=) button is clicked
let serverPackage = {
    number: [],
    operator: [],
    parentheses: [],
    answer: '',
    html: [],
    settings: {
        decimalPlaces: 2,
        operators: {
            multiplication: '*',
            division: '÷',
            exponent: '^'
        }
    }
}

// Variable to hold information about the most recently selected button
    // Used to push numbers to the calculation display and unselect operator buttons
let lastClicked = {
    value: '',
    type: ''
}

// Variable for counting the number of arguments and operators currently shown in the calculation display area
let argumentDisplayCount = 0

// Variable for counting unresolved parentheses
let openParenthCount = 0

let currentInput = {
    operator: '',
    openParenth: '',
    integer: '',
    decimalPoint: '',
    decimals: '',
    closeParenth: ''
}

// ON-READY FUNCTION
function onReady() {
    console.log('in onReady')

    // Listener functions
    $('.number-btn').on('click', numberBtn)
    $('.operator-btn').on('click', operatorBtn)
    $('#clear-btn').on('click', clearBtn)
    $('#submit-btn').on('click', submitBtn)
    $('#delete-btn').on('click', deleteBtn)
    $('#open-parenth-btn').on('click', openParenthBtn)
    $('#close-parenth-btn').on('click', closeParenthBtn)
}

// HANDLER FUNCTIONS

// Function that appends number (or decimal) to the input value
function numberBtn(event){
    event.preventDefault()

    // Variable to hold string with current display screen value
    let inputScreen = $('#input-display').val()
    // Variable to hold the selected number
    let clickedChar = $(this).text()

    // Conditional to send input screen value to the calculation display if the last button clicked was an operator
    if (lastClicked.type == 'operator') {
        // Clearing uneeded tailing decimal
        inputScreen = decimalTailCheck(inputScreen)

        // Checking for parentheses
        if ($('#open-parenth-btn').hasClass('active-operator')) {
            openParenthCount++
            // console.log('adding open parenth. Argument display count is:', argumentDisplayCount)
            serverPackage.parentheses.push([argumentDisplayCount*2])
            $('#open-parenth-btn').removeClass('active-operator')
        }
        if ($('#close-parenth-btn').hasClass('active-operator')) {
            openParenthCount--
            // For loop to find the last unresolved parenthesis and close it
            for (let i = serverPackage.parentheses.length - 1; i >= 0; i--) {
                if (serverPackage.parentheses[i].length == 1) {
                    serverPackage.parentheses[i].push(argumentDisplayCount * 2)
                    $('#close-parenth-btn').removeClass('active-operator')
                    break
                }
            }
        }

        // Pushing number, operator, and HTML to server package
        serverPackage.number.push(inputScreen)
        serverPackage.operator.push(lastClicked.value)
        serverPackage.html.push(getCurrentInputHTML())
        $('#calculation-display').empty()
        emptyCurrentInput()
        
        // Deactivating last operator
        $('.active-operator').removeClass('active-operator')

        // Updating argument display counter
        argumentDisplayCount++

        // Clearing input screen
        inputScreen = ''
    }
    
    

    // Validation to reject a second decimal point
    if (clickedChar == "." && inputScreen.includes(".") == true ) {
        $('#error-message').text("Input cannot include multiple decimal points")
        return
    }

    // Validation to reject multiple leading zeros
    if (clickedChar == '0' && inputScreen == "0") {
        return
    }

    // Validation to reject consecutive decimal points
    if (clickedChar == '.' && lastClicked == '.') {
        return
    }

    // Validation to clear leading zero if another number is selected
    if (inputScreen == '0' && clickedChar !== '.') {
        inputScreen = ''
    }

    // conditional to update current input object
    if (clickedChar == '.') {
        currentInput.decimalPoint = '.'
    } else if (inputScreen.includes('.')) {
        currentInput.decimals += clickedChar
    } else {
        currentInput.integer += clickedChar
    }

    $('#calculation-display').append(setCalculationDisplay)

    $('#error-message').text('')
    inputScreen += clickedChar
    // console.log(inputScreen)
    $('#input-display').val(inputScreen)

    // Updating the status of lastClicked
    lastClicked.type = 'number'
    lastClicked.value = clickedChar
}

function operatorBtn(event) {
    event.preventDefault()

    let clickedChar = $(this).text()

    // Conditional to select/unselect active operator
    if ($(this).hasClass('active-operator')) {
        $(this).removeClass('active-operator')
        lastClicked.type = ''
        lastClicked.value = ''
        currentInput.operator = ''
    } else {
        $('.operator-btn').removeClass('active-operator')
        $(this).addClass('active-operator')
        lastClicked.type = 'operator'
        lastClicked.value = clickedChar
        currentInput.operator = clickedChar
    }

    setCalculationDisplay();
}

function clearBtn() {
    // if...else to clear entire calculation if input display is empty, or clear the display screen if it is not empty
        // There should be a user confirmation so it's not just an auto delete
        // And a setting to disable that
    if ($('#input-display').val() === '') {
        $('#calculation-display').empty()
        resetServerPackage()
        argumentDisplayCount = 0
        openParenthCount = 0
    } else {
        $('#input-display').val('')
        emptyCurrentInput()
    }

    $('#error-message').text('')
    $('.operator-btn').removeClass('active-operator')
    $('.parenth-btn').removeClass('active-operator')

    setCalculationDisplay()
}

function deleteBtn() {
    let string = clearLastChar($('#input-display').val())
    $('#input-display').val(string)
    setCalculationDisplay()
}

function openParenthBtn() {
    if ($(this).hasClass('active-operator')) {
        $(this).removeClass('active-operator')
        currentInput.openParenth = ''
    } else {
        $(this).addClass('active-operator')
        currentInput.openParenth = '('
    }

    if ($('#close-parenth-btn').hasClass('active-operator')) {
        $('#close-parenth-btn').removeClass('active-operator')   
        currentInput.closeParenth = '' 
    }

    setCalculationDisplay()
}

function closeParenthBtn() {
    if (openParenthCount == 0) {
        $('#error-message').text('Open parenthesis required before closing parenthesis can be used')
        return
    } 

    if ($(this).hasClass('active-operator')) {
        $(this).removeClass('active-operator')
        currentInput.closeParenth = ''
    } else {
        $(this).addClass('active-operator')
        currentInput.closeParenth = ')'
    }

    if ($('#open-parenth-btn').hasClass('active-operator')) {
        $('#open-parenth-btn').removeClass('active-operator')
        currentInput.openParenth = '' 
    }

    setCalculationDisplay()
}

function submitBtn() {
    // console.log('in submitBtn')
    
    let inputScreen = $('#input-display').val()
    // Validation to prevent submitting without at least one operator
    if (serverPackage.operator.length == 0) {
        $('#error-message').text('Please include at least two numbers and one operator before submitting')
        return
    }

    // Validation for active operator
    if ($('.operator-btn').hasClass('active-operator')) {
        $('#error-message').text('Please resolve active operator button')
        return
    }

    // Validation to prevent submitting without number
        // Maybe include setting to automatically:
            // use 0 if last operator was + or -
            // use 1 if last operator was *, /, or ^
    if (inputScreen == '') {
        $('#error-message').text('Please input a number before submitting')
        return
    }

    // console.log('openParenthCount is:', openParenthCount)
    // Code to resolve any remaining open parentheses
    if (openParenthCount > 0) {
        // console.log('parentheses property at submit button:', serverPackage.parentheses)
        for (let i = serverPackage.parentheses.length - 1; i >= 0; i--) {
            // console.log('i is:', i)
            // console.log('parentheses[i]', serverPackage.parentheses[i])
            if (serverPackage.parentheses[i].length == 1) {
                // console.log('argumentDisplayCount is:', argumentDisplayCount)
                serverPackage.parentheses[i].push(argumentDisplayCount * 2)
            }
        }
        // console.log('parentheses property after resolution:', serverPackage.parentheses)
    }
    $('#error-message').text('All open parentheses automatically resolved')

    serverPackage.number.push($('#input-display').val())
    
    

    /**
     * If the input display is a number, add it to the serverPackage and get the ball rolling on the server-side stuff
     * 
     * If the input display is empty, push an error message
     *    Eventually, include a setting so the user can instead remove the last operator
     * 
     * If the last clicked button was decimal, clear it before submitting
     * 
     * If there is an active operator, return an error
     *    Eventually, include a setting to ignore it
     * 
     * I should probably increment argumentDisplayCount, but I'm not sure it's likely to be used for anything after the submit
     */

    // Clearing out temporary data holders
    $('#input-display').val('')
    $('#error-message').text('')
    openParenthCount = 0
    argumentDisplayCount = 0

    // Clearing the calculation display
    $('#calculation-display').empty()

    // Post function here
    $.ajax({
        method: "POST",
        url: "/submitcalculation",
        data: serverPackage
    }).then((response) => {
        console.log('in client-side POST', response)
    }).catch((error) => {
        console.log('error with post request', error)
        // alert('Error with POST')
    })

    // Get function here
    getAnswer()
    // Clear out object
    resetServerPackage()
    emptyCurrentInput()
}

// GET FUNCTION
function getAnswer() {
    $.ajax({
        method: "GET",
        url: "/getanswer"
    }).then((response) => {
        console.log('in client-side GET', response)
        // Put get function here
            // Update the DOM

        
        // Emptying the solution display on the DOM
        $('#solution-display').empty()

        // for loop to add solution history to the DOM
        for(let solution of response) {
            $('#solution-display').prepend(`
                <p>${solution.answer}</p>
            `)
        }

    }).catch((error) => {
        console.log('client-side GET error catch', error)
        // alert('error with GET')
    })
}

// HELPER FUNCTIONS
function decimalTailCheck(string) {
    if (string[string.length - 1] == '.') {
        string = clearLastChar(string)
    }
    return string
}

function clearLastChar(string) {
    let deletedChar = string.substring(string.length)

    // Updating currentInput object
    if (deletedChar == '.') {
        currentInput.decimalPoint = ''
    } else if (string.includes('.')) {
        currentInput.decimals = currentInput.decimals.substring(0, currentInput.decimals.length-1)
    } else {
        currentInput.integer = currentInput.integer.substring(0, currentInput.integer.length-1)
    }

    return string.substring(0, string.length-1)
}

function setCalculationDisplay() {
    // Empty calculation-display contents
    $('#calculation-display').empty()

    // Loop to append previous arguments
    for (argument of serverPackage.html) {
        $('#calculation-display').append(argument)
    }

    $('#calculation-display').append(getCurrentInputHTML())
}

function getCurrentInputHTML() {
    let currentInputHTML = `
    <div class="argument">
        <span class="operator">${currentInput.operator}</span>
        <span class="open-parenth">${currentInput.openParenth}</span>
        <span class="integer">${currentInput.integer}</span>
        <span class="decimal-point">${currentInput.decimalPoint}</span>
        <span class="decimals">${currentInput.decimals}</span>
        <span class="close-parenth">${currentInput.closeParenth}</span>
    <div>
`
return currentInputHTML
}

function emptyCurrentInput() {
    currentInput.operator = ''
        currentInput.openParenth = ''
        currentInput.integer = ''
        currentInput.decimalPoint = ''
        currentInput.decimals = ''
        currentInput.closeParenth = ''
}

function resetServerPackage() {
    serverPackage.number = []
    serverPackage.operator = []
    serverPackage.parentheses = []
    serverPackage.html = []
}