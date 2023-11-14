const ObjectIdSchema = Joi.string().trim().length(24).required()

module.exports = {ObjectIdSchema}