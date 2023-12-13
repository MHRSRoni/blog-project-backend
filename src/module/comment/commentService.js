/**
 * @category Comment
 * @module CommentService
 * @author MHRoni
 */

//=============Imports===============//
const createError = require("http-errors")
const giveError = require('../../utils/throwError')
const commentModel = require('./commentModel')

//==================================//


//=====================Types=======================//
/**@typedef {import("./commentModel".Comment)} Comment - The sample of the comment document */
/**@typedef {import("mongoose".ObjectId)} ObjectID - The ObjectId of the mongoose */

/**
 * @typedef {Object} ReadResult Sample of the Read Opertation Result on Comment
 * @property {Boolean} success - The success status of the operation.
 * @property {String} message - The message associated with the operation.
 * @property {Object} [data] - The resulted data.
 * @property {string} [data.totalPage] - The total number of pages.
 * @property {string} [data.currentPage] - The current page number.
 * @property {string} [data.perPage] - The number of comments per page.
 * @property {string} [data.totalComments] - The number of total comments found in the operation.
 * @property {Array<Comment>} [data.comments] - [The comment data]{@link module:CommentModel~Comment} got from the operation.
 * @property {Object} [error] - The error object.
 */
/**
 * @typedef {Object} Result Sample of the Comment Service Result
 * @property {Boolean} success - The success status of the operation.
 * @property {String} message - The message associated with the operation.
 * @property {Comment} [data] - [The comment data]{@link module:CommentModel~Comment}.
 * @property {Object} [error] - The error object.
 */

/** @typedef {import('http-errors').HttpError} HttpError */
//=================================================//



//===================Services=======================//

/**
 * Creates a new comment in a post.
 * @function createComment
 * @description Create a new comment with the provided comment object.
 * @async
 * @param {Object} validComment - The valid comment object to be saved.
 * @param {String|ObjectID} validComment.userId - The valid userId of the user.
 * @param {String|ObjectID} validComment.postId - The valid postId of the post.
 * @param {String} validComment.comment - The comment you want to make.
 * @return {Result} - An object with the success status, message and the saved comment data.
 * @throws {HttpError.NotImplemented} - If the comment was not saved.
 */
const createComment = async ({userId : user, postId : post, comment}) => {
    const savedComment = await new commentModel(validComment).save()

    if(!savedComment){
            createError(501, 'something went wrong')
    }

    return {success : true, message : "comment created successfully", data : savedComment}

}




/**
 * read comments based on postId.
 * @function readComment
 * @description Create a new comment with the provided comment object.
 * @async
 * @param {String} postId - The valid postId of the post.
 * @param {String} currentPage - The current page number.
 * @param {String} perPage - The number of comments per page.
 * @return {ReadResult} - An object with the success status, message and comment data.
 * @throws {HttpError.NotFound} - If no comment was found.
 */
const readComment = async ( postId , currentPage , perPage ) => {

    const totalComments = await commentModel.countDocuments({post : postId})
    const totalPage = Math.ceil(totalComments / perPage)
    const comments = await commentModel.find({post : postId})
                                .skip(perPage * (currentPage - 1))
                                .limit(perPage)
                                .populate({
                                    path : 'user',
                                    select : 'name picture',
                                })
                                .sort({ updatedAt: 'desc' })

    if(comments?.length < 1){
            createError(404, 'no comment, yet')
    }

    return {success : true, message : `${totalComments} comments found`, data : {currentPage, perPage, totalPage, totalComments, comments}}

}



/**
 * Update a comment of a post.
 * @function updateComment
 * @description find and update a comment if the comment is owned by the user with provided comment object.
 * @async
 * @param {Object} validComment - The valid comment object to be saved.
 * @param {String} validComment.userId - The valid userId of the user.
 * @param {Object} validComment.commentId - The valid commentId of the comment.
 * @param {Object} validComment.comment - The updated comment you want to make.
 * @return {Result} - An object with the success status, message and the updated comment data.
 * @throws {HttpError.NotImplemented} - If the comment was not updated.
 */
const updateComment = async ({ userId : user, commentId : _id, comment}) => {

    const updatedComment = await commentModel.findOneAndUpdate({user, _id}, {comment : comment}, {new : true})

    if(!updatedComment){
            createError(501, "comment was not updated")
    }

    return {success : true, message : "comment updated successfully", data : updatedComment}

}




/**
 * Delete a comment from the post.
 * @function deleteComment
 * @description find and delete a comment if the comment is owned by the user.
 * @async
 * @param {String|ObjectID} userId - The valid userId of the user.
 * @param {String|ObjectID} commentId - The valid commentId of the comment.
 * @return {Result} - An object with the success status, message and the delted comment data.
 * @throws {HttpError.NotImplemented} - If the comment was not deleted.
 */
const deleteComment = async (userId, commentId) => {

    const deletedComment = await commentModel.findOneAndDelete({user : userId, _id : commentId})

    if(!deletedComment){
            createError(501, "comment not deleted")
    }

    return {success : true, message : "comment deleted successfully", data : deletedComment}

}

//==========================================//



//=================Exports=================//
module.exports = {
    createComment,
    readComment,
    updateComment,
    deleteComment
}
//==========================================//