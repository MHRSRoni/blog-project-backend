// const jwt = require('jsonwebtoken')
// exports.generateToken = (payload) => {
//     const randomNumber = Math.floor(Math.random() * 1000000000 + 1000000000)
//     payload.unique = randomNumber
//     const token = jwt.sign(payload, process.env.JWT_SECRET)
//     return token
// }