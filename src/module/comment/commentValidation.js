/**
 * @category Comment
 * @module CommentValidation 
 * @authro MHRoni
 */

//=============Imports===============//
const Joi = require('joi');

//================================//


//=============Types================//
/**@typedef {import('mongoose').Types.ObjectId} ObjectID - The ObjectID type of mongoose */
//==================================//


//============ValidationFunctions=================//

const ObjectIdSchema = Joi.string().trim().length(24).required()

/**
 * Validates the createCommentObject and returns a Promise that resolves with the validated object.
 *@function validateCreateCommentObject
 * @async
 * @param {Object} createCommentObject - The object to be validated.
 * @param {string|ObjectID} createCommentObject.userId - The ID of the user creating the comment.
 * @param {string|ObjectID} createCommentObject.postId - The ID of the post the comment is being created on.
 * @param {string} createCommentObject.comment - The comment text.
 * @return {Promise<Object>} A Promise that resolves with the validated createCommentObject.
 */
const validateCreateCommentObject = async (createCommentObject) => Joi.object({
    userId : ObjectIdSchema,
    postId : ObjectIdSchema,
    comment : Joi.string().trim().required()
}).validateAsync(createCommentObject)




/**
 * Validates the updateCommentObject and returns a Promise that resolves with the validated object.
 *@function validateCommentUpdateObject
 * @async
 * @param {Object} updateCommentObject - The object to be validated.
 * @param {string|ObjectID} updateCommentObject.userId - The ID of the user creating the comment.
 * @param {string|ObjectID} updateCommentObject.commentId - The ID of the comment that you want to update.
 * @param {string} createCommentObject.comment - The updated comment.
 * @return {Promise<Object>} A Promise that resolves with the validated updateCommentObject.
 */
const validateCommentUpdateObject = async (updateCommentObject) => Joi.object({
    userId : ObjectIdSchema,
    commentId : ObjectIdSchema,
    comment : Joi.string().trim().required()
}).validateAsync(updateCommentObject)




/**
 * Validate the objectId and returns a Promise that resolves with the validated objectId.
 *@function validateObjectID
 * @async
 * @param {string|ObjectID} objectId - The objectId to be validated.
 * @return {Promise<Object>} A Promise that resolves with the validated objectId.
 */
const validateObjectID = async (objectId) => ObjectIdSchema.validateAsync(objectId)

//==============================================//


//=================Exports===================//
module.exports = {
    validateCreateCommentObject,
    validateCommentUpdateObject,
    validateObjectID
}
//=============================================//