/**
 * @category Readlist
 * @module ReadlistService
 * @author MHRoni
 */

//=====================Imports=======================//
const readlistModel = require("./readlistModel");
const createError = require('http-errors');
const {ObjectId} = require('mongoose').Types;

//=================================================//


//=====================Types=======================//
/**
 * @typedef {Object} Result Sample of the Readlist Result
 * @property {Boolean} success - The success status of the operation.
 * @property {String} message - The message associated with the operation.
 * @property {Object} [data] - The readlist data.
 * @property {string} [data.totalPage] - The total number of pages.
 * @property {string} [data.currentPage] - The current page number.
 * @property {string} [data.perPage] - The number of posts per page.
 * @property {Array} [data.posts] - The  psosts in the readlist data.
 * @property {Object} [error] - The error object.
 */

/** @typedef {import('http-errors').HttpError} HttpError */
//=================================================//



//=====================Services=======================//

/**
 * Retrieves a readlist from the database for a given user ID.
 * @function readReadlist 
 * @description
 *  - first search for the user in the readlist collection
 *  - then skip the posts based on the current page and the number of posts per page
 *  - then limit the posts based on the number of posts per page
 *  - then populate the posts with the post data
 *  - then filter the posts based on the search keyword
 *  - finally return the readlist data
 * @async
 * @param {String} userId - The ID of the user.
 * @param {String} search - The keyword to search for in the readlist.
 * @param {String} [currentPage=1] - The current page number.
 * @param {String} [perPage=10] - The number of posts per page.
 * @return {Result} - An object containing the success status, message and the retrieved readlist data.
 * @throws {HttpError.NotFound} - If no readlist found in the database for the given user ID.
 */
const readReadlist = async (userId, search, currentPage, perPage) => {
    
    //query building to read the readlist
    const userIdQuery = { $match : { user : new ObjectId(userId) }}
    const skipPost = { $skip : parseInt(currentPage - 1) * perPage }
    const limitPost = { $limit : parseInt(perPage) }
    const populatePosts = { $lookup : {
        from : 'posts',
        localField : 'post',
        foreignField : '_id',
        as : 'posts'
    }}
    const searchQuery = search ?{ $match : {$or : [
        { "posts.title" : { $regex : search, $options : 'i' } },
        { "posts.description" : { $regex : search, $options : 'i' } }
    ]} } : {$match : {}}

    const pipeline = [userIdQuery, skipPost, limitPost, populatePosts, searchQuery]

    //read the readlist
    const readlist = await readlistModel.aggregate(pipeline)
    
    if (readlist?.length < 1) {
        throw createError(404, 'no data found')
    }

    //document count
    const totalPost = readlist?.length ?? 0
    const totalPage = Math.ceil(totalPost / perPage)

    return { success: true, message : 'readlist found', data: {totalPost, totalPage, currentPage, perPage, posts : readlist} }
}




/**
 * Checks if a post exists in the readlist, for a user ID.
 * @function existInReadlist 
 * @async
 * @param {String} userId - The ID of the user.
 * @param {String} postId - The ID of the post.
 * @return {Boolean} 
 * - true : If the post exists in the readlist.
 * - false : If the post does not exist in the readlist.
 * @throws {HttpError.NotFound} - If no readlist found in the database for the given user ID.
 */
const existInReadlist = async (userId, postId) => {

    const readlist = await readlistModel.findOne({ user : userId, post : postId });

    if (!readlist) { return false };
    return true;
}




/**
 * Add a new post in the readlist, for a user ID.
 * @function addInReadlist 
 * @async
 * @param {String} userId - The ID of the user.
 * @param {String} postId - The ID of the post.
 * @return {Result} - An object containing the success status, message and the retrieved readlist data.
 * @throws {HttpError.InternalServerError} - If post was not added in the readlist for the given user ID.
 */
const addInReadlist = async (userId, postId) => {

    const readlist = await readlistModel.create({ user : userId, post : postId });

    if (!readlist) {
           throw createError(501, "could not add in the readlist")
    }

    return { success: true, message : 'added in the readlist', data: readlist }
}




/**
 * Remove a post from the readlist, for a user ID.
 * @function removeFromReadlist 
 * @async
 * @param {String} userId - The ID of the user.
 * @param {String} postId - The ID of the post.
 * @return {Result} - An object containing the success status, message and the retrieved readlist data.
 * @throws {HttpError.InternalServerError} - If post was not removed from the readlist for the given user ID.
 */
const removeFromReadlist = async (userId, postId) => {

    const readlist = await readlistModel.findOneAndDelete({ user : userId, post : postId });

    if (!readlist) {
            createError(501, "could not remove from the readlist")
    }

    return { success: true, message : 'removed from the readlist', data: readlist }
}




/**
 * Clear the readlist, for a user ID.
 * @function clearReadlist 
 * @async
 * @param {String} userId - The ID of the user.
 * @return {Result} - An object containing the success status, message and the retrieved readlist data.
 * @throws {HttpError.InternalServerError} - If readlist was not removed from the database for the given user ID.
 */
const clearReadlist = async (userId) => {

    const readlist = await readlistModel.deleteMany({ user : userId });

    if (!readlist) {
            createError(501, "could not clear the readlist")
    }

    return { success: true, message : "cleared the readlist", data: readlist }
}

//=================================================//


//======================Exports=======================//
module.exports = {
    readReadlist,
    existInReadlist,
    addInReadlist,
    removeFromReadlist,
    clearReadlist
}
//=================================================//