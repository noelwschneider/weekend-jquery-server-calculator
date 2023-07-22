// Array format

let calculation = {
    number: [],
    decimal: [],
    calcNumber: [],
    operator: [],
    parentheses: []
}

// Sequence goes number-operation, always starting and ending on a number


// DECIMAL INDEX PROCESS

// The actual process:
/**
 * Take in numbers and decimal indexes
 * Multiply numbers by some exponent of 10 to get them to correct length
 */

// Sample calculation:
    //  ( 1.50   +
    //    2.45 ) +
    //   20.00   =
    //   23.95
let testObject = {
    number: [15, 245, 20],
    /**
     * visualize the shift as:
     *                                     dec     max -
        * input  actual   calc    shift    index   index
        *  15 ||  1.50 ||  150 || * 10  || 1    || 1
        * 245 ||  2.45 ||  245 || * 1   || 2    || 0
        *  20 || 20.00 || 2000 || * 100 || 0    || 2
        *                 2395
        * Basically, multiply each number by 10 ^ (max - index)
        * in order to get integers that can be used for calculation.
        * Then divide the result by the max shift?
        *   - Test that this works for multiplication
     * */ 
    decimal: [1, 2, 0],
    calcNumber: [],
    operator: ['+', '+'],
    // Nested arrays to indicate placement of parentheses
        // first index: opening parenth goes /before/ this index in the number array
        // second index: closing parenth goes /after/ this index
    parentheses: [[0, 1]]
}

// Function that shifts all numbers to integers with the same relative size as their decimaled versions
    // in other words, the numbers 10 and 1.5 would be shifted to 100 and 15
    // Doing this because I know there are some goofy behaviors with decimals in JS
        // Not entirely sure whether it is worth the trouble, but here we are
let decimalShift = (object) => {    
    console.log('in decimalShift')
    // Getting max index
        // This variable represents the highest number of digits after a decimal point in any number in the calculation
    let maxIndex = Math.max(...object.decimal) // Spread syntax
    // console.log('max decimal index is:', maxIndex)

    // For loop to add the relatively-sized integers to the object
    for(let i=0; i < object.number.length; i++) {
        let pushNumber = object.number[i]
        let exponent = maxIndex - object.decimal[i]
        //console.log('exponent is:', exponent)

        // The
        pushNumber = pushNumber * 10 ** exponent
        //console.log('pushNumber with exponent is:', pushNumber)

        object.calcNumber.push(pushNumber)
        // console.log('calcNumber property is:', object.calcNumber[i])
    }
    console.log('exiting decimalShift')
}



// Function to take the object and return it as a single array representing a math problem
let getCalcAsArray = (object) => {
    console.log('in getCalcAsArray')
    let calculation = []
    // Pushing the first number to the array because it will always begin and end with a number
    calculation.push(object.calcNumber[0])
    // For loop to get calcNumbers and operators into an array
        // middle argument is -1 because we don't want it to run
    for(i=0; i < object.operator.length; i++) {
        calculation.push(object.operator[i])
        calculation.push(object.calcNumber[i+1])
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
    console.log('doing calculations for exponents')
    calculationDoer(calculation, '**')
    console.log('doing calculations for multiplication')
    calculationDoer(calculation, '*')
    console.log('doing calculations for division')
    calculationDoer(calculation, '/')
    console.log('doing calculations for addition')
    calculationDoer(calculation, '+')
    console.log('doing calculations for subtraction')
    calculationDoer(calculation, '-')

    console.log('return value of orderOfOperations is:', calculation[0])
    return calculation[0]
}

let parenthesesCheck = (calculation, object) => {
    console.log('in parentheses check')
    for (let i = 0; i < object.parentheses.length; i++) {
        // console.log('index of opening parenth:', object.parentheses[i][0])
        // console.log('index of closing parenth:', object.parentheses[i][1])
        let openParenth = object.parentheses[i][0]
        let closeParenth = (object.parentheses[i][1] - object.parentheses[i][0]) * 2 // multiplied by two to account for operators between numbers
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

    // console.log('current state of calculation:', calculation)
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
        // console.log('new calculation array is:', calculation)
    }
    return calculation;
}

// Function to do the math and return the value
let doMath = (object) => {
    console.log('in doMath')
    console.log('number property:', object.number)
    console.log('decimal property:', object.decimal)
    console.log('calcNumber property:', object.calcNumber)
    console.log('operator property:', object.operator)
    console.log('parentheses property:', object.parentheses)
    console.log('')
    // Use the order of operations to do small calculations until a single number can be returned
    // Example:
        // (2 ^ 3) * 4 / (5 + 6) - 7
        //  8      * 4 /  11     - 7
        //  32         /  11     - 7
        //  2.9                  - 7
        // -4.1
    // I think this can be done easily with careful splicing
    
    decimalShift(testObject)
    console.log('updated calcNumber property:', object.calcNumber)
    console.log('')

    let calculation = getCalcAsArray(object)
    
    console.log('current state of calculation:', calculation)
    console.log('')

    calculation = parenthesesCheck(calculation, object)

    console.log('doing calculations after resolving parenthized arguments')
    console.log('current state of calculation:', calculation)
    calculation = orderOfOperations(calculation, object)
    console.log('exiting doMath. Return value is:', calculation)

    return calculation
}

doMath(testObject)