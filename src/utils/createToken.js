const jwt = require('jsonwebtoken')

//!Create Token
const createToken = (userData, expires) => {
    return jwt.sign(
        { userType: userData.userType, email: userData.email, id: userData.id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: expires })
}

module.exports = createToken;