require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser')
const cors = require('cors')

// all routes
const apiRoutes = require('./routes/AllRoutes')

// error handler
const errorHandler = require('./middleware/error/errorHandler');


const app = express()

const allowedOrigins =process.env.FRONTEND_URL


app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

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
