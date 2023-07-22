$(document).ready(onReady)

// VARIABLES
let serverPackage = {
    number: [],
    operator: [],
    parentheses: []
}

function onReady() {
    console.log('in onReady')

    // Listener functions
    $('.number-btn').on('click', numberBtn)
}

// FUNCTIONS

console.log($('#9-btn').val('test'))

let numberBtn = (event) => {
    event.preventDefault()
    console.log($(this).val())
    let btnValue = $(this).val()
    console.log(btnValue)
}