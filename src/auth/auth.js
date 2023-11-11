const jwt = require('jsonwebtoken');
const createError = require('http-errors')

exports.isLoggedIn = async (req, res, next) => {

    try {
        const { token } = req.headers;
        if (!token) {
            throw createError(401, 'Unauthorized')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.headers.id = decoded.id;
        req.headers.email = decoded.email;
        next()


    } catch (error) {
        throw createError(401, 'Unauthorized');
    }
}