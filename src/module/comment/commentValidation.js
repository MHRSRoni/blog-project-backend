const Joi = require('joi');

const commentSchema = Joi.object({
    userId : Joi.string().length(24).required(),
    postId : Joi.string().length(24).required(),
    comment : Joi.string().trim().required()
})

const ObjectId = Joi.string().trim().length(24).required()




module.exports = {commentSchema, ObjectId}