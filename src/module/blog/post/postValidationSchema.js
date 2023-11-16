const Joi = require('joi');

exports.postCreateValidationSchema = Joi.object({
    categoryId: Joi.string().required().messages({
        'string.empty': 'please provide category id',
        'any.required': 'category id is required'
    }),
    title: Joi.string().trim().required().messages({
        'string.empty': 'please provide title',
        'any.required': 'title is required'
    }),
    description: Joi.string().trim().required().messages({
        'string.empty': 'please provide description',
        'any.required': 'description is required'
    }),
    picture: Joi.string(),

});

exports.postUpdateValidationSchema = Joi.object({
    categoryId: Joi.string().messages({
        'string.empty': 'please provide category id',
    }),
    title: Joi.string().trim().messages({
        'string.empty': 'please provide title',
    }),
    description: Joi.string().trim().messages({
        'string.empty': 'please provide description',
    }),
    picture: Joi.string(),

});

exports.reactValidationSchema = Joi.string().valid('like', 'dislike', 'love').required().messages({
    'any.only': 'Invalid react type'
});

exports.validateCreatePostData = async (req, res, next) => {
    try {
        const postCreateValidationSchema = Joi.object({

            categoryId: Joi.string().required().messages({
                'string.empty': 'please provide category id',
                'any.required': 'category id is required'
            }),
            title: Joi.string().trim().required().messages({
                'string.empty': 'please provide title',
                'any.required': 'title is required'
            }),
            description: Joi.string().trim().required().messages({
                'string.empty': 'please provide description',
                'any.required': 'description is required'
            }),
            picture: Joi.string(),

        });

        const data = await postCreateValidationSchema.validateAsync(req.body);

        req.body = data;

        next();
    } catch (error) {
        next(error);
    }
}
