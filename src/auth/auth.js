const jwt = require('jsonwebtoken');
const createError = require('http-errors')


// Check if user is logged in
exports.isLoggedIn = async (req, res, next) => {

    try {
        const { token } = req.headers;

        if (!token) {
            throw createError(401, 'You are not logged in!')
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {}
        req.user.id = decoded.id;
        req.user.email = decoded.email;

        next();

    } catch (error) {
        next(error)
    }
}