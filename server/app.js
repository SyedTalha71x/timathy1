require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')

// all routes
const apiRoutes = require('./routes/AllRoutes')

// error handler
const errorHandler = require('./middleware/error/errorHandler');


const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.options(/.*/, cors());



app.use(express.json());

app.use(express.urlencoded({ extended: true }))

// for cookies
app.use(cookieParser())

// for checking server is running and api call is working or not
app.get('/api', (req, res) => {
    return res.status(200).json('Server running')
});

// main Route for all api
app.use('/api', apiRoutes)
app.use(errorHandler)



module.exports = app 
