const jwt = require('jsonwebtoken');

// Check if user is logged in
exports.isLoggedIn = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {}
            req.user.id = decoded.id;
            req.user.email = decoded.email;

            next();
        } else {
            req.user ? next() : res.status(401).json({ message: 'You are not logged in!' })
        }

    } catch (error) {
        next(error)
    }
};

