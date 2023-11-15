const joi = require('joi')

const ObjectIdSchema = joi.string().trim().length(24).required()

module.exports = { ObjectIdSchema }