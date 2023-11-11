//!Basic import
const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.RUNNING_PORT || 6000;
const ConnectDB = require('./config/ConnectDB');
const createError = require('http-errors');

//!Security middlewares import
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const helmet = require('helmet');

const hpp = require('hpp');
const router = require('./router');



//!Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });


//!Security middlewares implement
app.use(cors());
app.use(helmet());

app.use(hpp());
app.use(mongoSanitize());
app.use(limiter);

app.use(express.json({ limit: '50mb' }));


//!Managing Backend routing
// readdirSync("./src/routes").map(r => app.use("/api/v1", require(`./src/routes/${r}`)));
app.use('/api/v1', router)


//! Undefined Route

app.use('*', (req, res, next) => {
    next(createError(404, 'Route not found'));
})

// custom Error Handler

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        success: false,
        message: err.message
    })
})


//!Server Listening
app.start = async () => {
    try {
        await ConnectDB()
        app.listen(port, () => {
            console.log(`✅ Server Running http://localhost:${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

module.exports = app;


