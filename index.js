require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')

// Connect to the database
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (error) =>
        error ? console.log(error) : console.log('Connected to database...')
)

const app = express()
const port = process.env.SERVER_PORT || 4001

require('./passport/passport')(passport)

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).send('Hello from server.'))

app.listen(port, (error) =>
    error ? console.log(error) : console.log('Server running on port:', port)
)
