
//!Security middlewares import
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const helmet = require('helmet');
const hpp = require('hpp');




//!Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });

//!Security middlewares implement
const secure = (app) => {
    app.use(cors());
    app.use(helmet());
    app.use(hpp());
    app.use(mongoSanitize());
    app.use(limiter);
}

module.exports = secure;