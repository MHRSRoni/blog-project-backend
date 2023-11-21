const jwt = require('jsonwebtoken');

exports.findUserToken = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (token) {
            const user = jwt.verify(token, process.env.JWT_SECRET);

            req.user = user;
        }

        next();
    } catch (error) {
        next(error);
    }

};