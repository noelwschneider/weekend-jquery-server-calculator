const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = 5000

app.use(express.static('server/public'))
app.use(bodyParser.urlencoded({extended:true}))

app.listen(port, () => {
    console.log('listening on port', port)
})