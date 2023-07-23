const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000

app.use(express.static('server/public'))
app.use(bodyParser.urlencoded({extended:true}))

// Answer to send back
let calculationAnswer;
// Calculator logic

// Get function
app.get('/getanswer', (req, res) => {
    console.log('in server-side GET')
    res.send(calculationAnswer)
})

// Post function
app.post('/submitcalculation', (req, res) => {
    console.log('In server-side POST')
    let userCalculation = req.body
    console.log(userCalculation)

    res.sendStatus(201)
})

app.listen(port, () => {
    console.log('listening on port', port)
})