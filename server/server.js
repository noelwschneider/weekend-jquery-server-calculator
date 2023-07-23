const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000

app.use(express.static('server/public'))
app.use(bodyParser.urlencoded({extended:true}))

// Array to hold calculations
let calculationHistory = []

// Get function
app.get('/getanswer', (req, res) => {
    console.log('in server-side GET')
    res.send(calculationHistory)
})

// Post function
app.post('/submitcalculation', (req, res) => {
    console.log('In server-side POST')
    console.log('State of object on arrival to server:', req.body)
    let userCalculation = req.body
    userCalculation.answer = doMath(req.body)

    console.log('object in POST with answer:', userCalculation)
    calculationHistory.push(userCalculation)

    res.sendStatus(201)
})


// FUNCTIONS FOR DOING MATH
// Function to take the object and return it as a single array representing a math problem
let getCalcAsArray = (object) => {
    console.log('in getCalcAsArray')
    let calculation = []
    // Pushing the first number to the array because it will always begin and end with a number
    calculation.push(object.number[0])
    // For loop to get calcNumbers and operators into an array
        // middle argument is -1 because we don't want it to run
    for(i=0; i < object.operator.length; i++) {
        calculation.push(object.operator[i])
        calculation.push(object.number[i+1])
    }
    // console.log(calculation)
    console.log('exiting getCalcAsArray')
    return calculation
}

// Function that splices the calculation array in the mathematically appropriate order
    // Search for an operator
    // Use it on the numbers before and after it
    // Splice the resulting number into the array, replacing the operator and both surrounding numbers
    // The above process should be done twice
        // First for instances within parentheses
        // Then on the remaining array
        // Doing it twice? Sound like I should use a separate function for that
let orderOfOperations = (calculation) => {
    // NEXT STEPS:
        // Cycles through the calculation array using the order of operations
        // Splice in new math, replacing old numbers and operators until the final calculation is the only remaining value
    // For loops that 

    console.log('beginning calculationDoer sequence')
    // console.log('doing calculations for exponents')
    calculationDoer(calculation, '**')
    // console.log('doing calculations for multiplication')
    calculationDoer(calculation, '*')
    // console.log('doing calculations for division')
    calculationDoer(calculation, '/')
    // console.log('doing calculations for addition')
    calculationDoer(calculation, '+')
    // console.log('doing calculations for subtraction')
    calculationDoer(calculation, '-')

    console.log('return value of orderOfOperations is:', calculation[0])
    return calculation[0]
}

let parenthesesCheck = (calculation, object) => {
    console.log('in parentheses check')
    console.log('parentheses property:', object.parentheses)
    
    // Valdiation to avoid error from calculations without parentheses
    if(object.parentheses == undefined) {
        console.log('No parentheses in calculation. Exiting parentheses check.')
        console.log('')
        return calculation
    }

    for (let i = 0; i < object.parentheses.length; i++) {
        console.log('index of opening parenth:', object.parentheses[i][0])
        console.log('index of closing parenth:', object.parentheses[i][1])
        let openParenth = object.parentheses[i][0]
        let closeParenth = (object.parentheses[i][1] - openParenth) * 2 // multiplied by two to account for operators between numbers
        // console.log('parentheses length is:', closeParenth)                          // could also potentially use .slice() on object.numbers? Not sure there is much difference
        let calculationArgument = calculation.splice(openParenth, closeParenth+1)
        console.log('argument to operate on:', calculationArgument)
        calculation.splice(openParenth, 0, orderOfOperations(calculationArgument))
    }
    console.log('exiting parentheses check')
    console.log('')
    return calculation
}

// Function to facilitate the loops needed for each operator in the calculationDoer function
let repetitionCounter = (calculation) => {
    // console.log('in repetitionCounter')
    // Variables to count the operators
    // Will be used to inform .indexOf() when going through the order of operations
    let expCount = 0;
    let multCount = 0;
    let divCount = 0;
    let addCount = 0;
    let subCount = 0;

    // console.log(`There are ${multCount} instances of multiplication`)
    // console.log(`There are ${divCount} instances of division`)
    // console.log(`There are ${addCount} instances of addition`)
    // console.log(`There are ${subCount} instances of subtraction`)

    // console.log('current state of calculation is:', calculation)
    // For loop to increment operator counters
    for (let number of calculation) {
        // console.log(number)
        if (number == '**') {
            // console.log(`adding ${number} to multCount`)
            expCount++
        } else if (number == '*') {
            // console.log(`adding ${number} to divCount`)
            multCount++
        }  else if (number == '/') {
            // console.log(`adding ${number} to divCount`)
            divCount++
        } else if (number === '+') {
            // console.log(`adding ${number} to addCount`)
            addCount++
        } else if (number == '-') {
            // console.log(`adding ${number} to subCount`)
            subCount++
        }
    }
    let repetitionArray = [expCount, multCount, divCount, addCount, subCount]
    // console.log('repetition array is:', repetitionArray)
    // console.log('')
    return repetitionArray
}

// Function to do operations to two numbers at a time and splice them back into the string
let calculationDoer = (calculation, operator) => {
    // console.log('in calculationDoer')

    // NOTE TO SELF: PLEASE LEAVE COMMENTS TO EXPLAIN THE LOGIC HERE
    // console.log('current state of calculation:', calculation)

    // Using repetitionCounter function to determine how many of each operation is being done
    let repetitionsArray = repetitionCounter(calculation)
    let repetitions
    if (operator == '**') {
        repetitions = repetitionsArray[0]
    } else if (operator == '*') {
        repetitions = repetitionsArray[1]
    } else if (operator == '/') {
        repetitions = repetitionsArray[2]
    } else if (operator == '+') {
        repetitions = repetitionsArray[3]
    } else if (operator == '-') {
        repetitions = repetitionsArray[4]
    }
    // console.log('number of repetitions to execute:', repetitions)

    for (let i = 0; i < repetitions; i++) {
        // console.log('current calculation array is:', calculation)
        let operatorIndex = calculation.indexOf(operator);
        // console.log('index of the addition operatorIndex:', operatorIndex)
        // console.log('numbers to add are:', calculation[operatorIndex-1], calculation[operatorIndex+1])
        let mathedNumbers
        if (operator == '**') {
            mathedNumbers = calculation[operatorIndex-1] ** calculation[operatorIndex+1]
        } else if (operator == '*') {
            mathedNumbers = calculation[operatorIndex-1] * calculation[operatorIndex+1]
        } else if (operator == '/') {
            mathedNumbers = calculation[operatorIndex-1] / calculation[operatorIndex+1]
        } else if (operator == '+') {
            mathedNumbers = calculation[operatorIndex-1] + calculation[operatorIndex+1]
        } else if (operator == '-') {
            mathedNumbers = calculation[operatorIndex-1] - calculation[operatorIndex+1]
        }

        // console.log('sum of the numbers is:', mathedNumbers)
        calculation.splice(operatorIndex-1, 3, mathedNumbers)
        
    }
    // console.log('new calculation array is:', calculation)
    return calculation;
}

// Function to format object.number array properties as numbers
let convertToNumber = (object) => {
    console.log('in convertToNumber')
    let newNumberArray = []
    for (let number of object.number) {
        console.log('destring number:', number)
        newNumberArray.push(Number(number))
    }
    object.number = newNumberArray
    console.log('object.number after destringing:', object.number)
    console.log('')
}

// Function to do the math and return the value
let doMath = (object) => {
    console.log('in doMath')
    console.log('')

    // De-stringing object.number array properties
    convertToNumber(object)
    console.log('current state of object:', object)

    // Merging numbers and operators
    let calculation = getCalcAsArray(object)
    
    console.log('current state of calculation:', calculation)
    console.log('')

    calculation = parenthesesCheck(calculation, object)

    console.log('current state of object:', object)

    console.log('current state of calculation:', calculation)
    calculation = orderOfOperations(calculation, object)
    console.log('exiting doMath. Current value is:', calculation)

    return calculation;
}

app.listen(port, () => {
    console.log('listening on port', port)
})