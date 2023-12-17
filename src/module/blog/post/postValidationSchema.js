/**
 * @category Post
 * @module PostValidation
 * @author Ali Rafat
*/

const Joi = require('joi');

exports.reactValidationSchema = Joi.string().valid('like', 'fire', 'love').required().messages({
    'any.only': 'Invalid react type'
});

/**
 * Validates the data for creating a post.
 * @function validateCreatePostData
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body.
 * @param {String} req.body.categoryId - The category id of the post.
 * @param {String} req.body.title - The title of the post.
 * @param {String} req.body.description - The description of the post.
 * @param {String} req.body.picture - The picture of the post.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Object} - Resolves to the next middleware function.
 */

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
            picture: Joi.required().messages({
                'string.empty': 'please provide a picture',
                'any.required': 'picture is required'
            }),
        });

        const data = await postCreateValidationSchema.validateAsync(req.body);

        req.body = data;

        next();
    } catch (error) {
        next(error);
    }
};
