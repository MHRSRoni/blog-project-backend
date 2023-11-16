const Joi = require('joi');

exports.commentCreateSchema = Joi.object({
    userId : Joi.string().length(24).required(),
    postId : Joi.string().length(24).required(),
    comment : Joi.string().trim().required()
})

exports.commentUpdateSchema = Joi.object({
    comment : Joi.string().trim().required(),
    userId : Joi.string().length(24).required(),
    commentId : Joi.string().length(24).required()
})

exports.ObjectId = Joi.string().trim().length(24).required()



