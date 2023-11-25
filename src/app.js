//------------ import ------------------//
//libary 
const express = require('express');
const createError = require('http-errors');
require('dotenv').config();

//module 
const ConnectDB = require('./config/ConnectDB');
const secure = require('./config/security');
const router = require('./router');
const { parsePostFormData } = require('./utils/parseFormData');



//--------------- app -----------------//
const app = express();
const PORT = process.env.RUNNING_PORT || 6000;
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next)=>{console.log('checking'); next()})
app.use(parsePostFormData)

secure(app);


//-------------- route ----------------//
//Managing Backend routing
app.use('/api/v1', router)

// Undefined Route
app.use('*', (req, res, next) => {
    next(createError(404, 'Route not found'));
})



//---------- Error Handler ---------------//
app.use((err, req, res, next) => {
    if (err.isJoi) {
        err.status = 400;
    }
    if (process.env.NODE_ENV !== 'production') {
        console.log(err)
        return res.status(err.status || 500).json({
            success: false,
            message: err.message,
            error: err
        })
    } else {
        return res.status(err.status || 500).json({
            success: false,
            message: err.message
        })
    }
})



//---------- Server Listening --------------//
app.start = async () => {
    try {
        await ConnectDB()
        app.listen(PORT, () => {
            console.log(`✅ Server Running Port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = app;


