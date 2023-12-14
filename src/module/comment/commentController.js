/**
 * @category Comment
 * @module CommentController
 * @author MHRoni
 */


//=============Imports===============//
const { createComment, readComment, updateComment, deleteComment } = require("./commentService");
const {  ObjectId, commentCreateSchema, commentUpdateSchema, validateObjectId, validateObjectID, validateCommentUpdateObject, validateCreateCommentObject } = require("./commentValidation");

//=================================//



//===================Types====================//
const {Request, Response, NextFunction} = require("express")
const {Result, ReadResult} = require("./commentService")
/**
 * @typedef GeneratedResponse The json response generated from the Request.
 * @property {boolean} success - The success status of the request.
 * @property {ReadResult|Result} [data] -[ReadResult]{@link module:CommentService~ReadResult} or [Result]{@link module:CommentService~Result} depending on the request.
 * @property {Object} [error] - The error associated with the request.
 */
//===============================================//



//===========Controller=============//

/**
 * @function createCommentController
 * @description 
 * - This function [validate the userId, postId and comment]{@link module:CommentValidation~validateCreateCommentObject} 
 * - call the [createComment]{@link module:CommentService~createComment} service with resulted Object.
 * - Then the result of the [createComment]{@link module:CommentService~createComment} service is send in response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Object} req.params - The params object of express.
 * @param {String} req.params.postId - The postId of the post you want to comment.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {String} req.body - The body of the request.
 * @param {String} req.body.comment - The comment you want to make on the post.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the [result]{@link module:CommentService~Result} of the request.
 */
exports.createCommentController = async (req, res, next) => {
    try {
        const userId = req.user?.id ;
        const {postId} = req.params;
        const {comment } = req.body;

        const validComment = await validateCreateCommentObject({userId, postId, comment});

        const result = await createComment(validComment);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}




/**
 * @function readCommentController
 * @description 
 * - This function [validate the postId]{@link module:CommentValidation~validateObjectID} 
 * - call the [readComment]{@link module:CommentService~readComment} service with resulted data, currentPage and perPage.
 * - Then the result of the [readComment]{@link module:CommentService~readComment} service is send in response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Object} req.params - The params object of express.
 * @param {String} req.params.postId - The postId of the post you want to read comment for.
 * @param {Object} req.query - The query object of express.
 * @param {String} [req.query.currentPage=1] - The current page number.
 * @param {String} [req.query.perPage=3] - The number of comments per page.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the [result]{@link module:CommentService~ReadResult} of the request.
 */
exports.readCommentController = async (req, res, next) => {
    try {

        const {postId} = req.params;
        const {currentPage = 1, perPage = 3} = req.query;
        const validPostId = await validateObjectID(postId);
        
        const result = await readComment(validPostId, currentPage, perPage );
        return res.status(200).json(result);
        
    } catch (error) {
        next(error);
    }
}




/**
 * @function updateCommentController
 * @description 
 * - This function [validate the userId, commentId and comment]{@link module:CommentValidation~validateCommentUpdateObject} 
 * - call the [updateComment]{@link module:CommentService~updateComment} service with resulted object.
 * - Then the result of the [updateComment]{@link module:CommentService~updateComment} service is send in response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Object} req.params - The params object of express.
 * @param {String} req.params.commentId - The commentId of the comment you want to updated.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {String} req.body - The body of the request.
 * @param {String} req.body.comment - The comment you want to make on the post.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the [result]{@link module:CommentService~Result} of the request.
 */
exports.updateCommentController = async (req, res, next) => {
    try {

        const {commentId} = req.params;
        const userId = req.user?.id
        const { comment} = req.body;

        const commentObject = {userId, commentId, comment}
        const validComment = await validateCommentUpdateObject(commentObject);

        const result = await updateComment(validComment);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}




/**
 * @function deleteCommentController
 * @description 
 * - This function [validate the userId and commentId]{@link module:CommentValidation~validateObjectID} 
 * - call the [deleteComment]{@link module:CommentService~deleteComment} service with resulted object.
 * - Then the result of the [deleteComment]{@link module:CommentService~deleteComment} service is send in response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Object} req.params - The params object of express.
 * @param {String} req.params.commentId - The commentId of the comment you want to updated.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {String} req.body - The body of the request.
 * @param {String} req.body.comment - The comment you want to make on the post.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the [result]{@link module:CommentService~Result} of the request.
 */
exports.deleteCommentController = async (req, res, next) => {
    try {

        const userId = req.user?.id
        const {commentId} = req.params;

        const validCommentId = await validateObjectID(commentId);
        const validUserId = await validateObjectID(userId);
        
        const result = await deleteComment(validUserId, validCommentId);
        return res.status(201).json(result);
        
    } catch (error) {
        next(error);
    }
}
