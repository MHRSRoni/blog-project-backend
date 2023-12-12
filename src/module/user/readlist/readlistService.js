const readlistModel = require("./readlistModel");
const giveError = require('../../../utils/throwError');
const createError = require('http-errors');



/**
 * @category Readlist
 * @module Service
 */

/**
 * @typedef {Object} Result Sample of the Readlist Result
 * @property {boolean} success - The success status of the operation.
 * @property {string} message - The message associated with the operation.
 * @property {object} [data] - The readlist data.
 */


/**
 * Retrieves a readlist from the database for a given user ID.
 * @function readReadlist 
 * @async
 * @param {string} userId - The ID of the user.
 * @return {Result} An object containing the success status, message and the retrieved readlist data.
 * @throws {Error} If no readlist is found in the database for the given user ID.
 */
const readReadlist = async (userId) => {

    const readlist = await readlistModel.findOne({ userId }).populate('postId');

    if (!readlist) {
        throw giveError(
            createError(404, "no readlist found in the database for userId :" + userId, { mode: 'development' }),
            createError(404, 'no data found', { mode: 'production' })
        )
    }
    return { success: true, data: readlist }
}

const existInReadlist = async (userId, postId) => {

    const readlist = await readlistModel.findOne({ userId, postId });

    if (!readlist) { return false };
    return true;
}

const addInReadlist = async (userId, postId) => {

    const readlist = await readlistModel.create({ userId, postId });

    if (!readlist) {
        throw giveError(
            createError(501, "could not add in the readlist", { mode: 'development' }),
            createError(501, "something went wrong, please try again", { mode: 'production' })
        )
    }

    return { success: true, data: readlist }
}

const removeFromReadlist = async (userId, postId) => {

    const readlist = await readlistModel.findOneAndDelete({ userId, postId });

    if (!readlist) {
        throw giveError(
            createError(501, "could not remove from the readlist", { mode: 'development' }),
            createError(501, "something went wrong, please try again", { mode: 'production' })
        )
    }

    return { success: true, data: readlist }
}

const clearReadlist = async (userId) => {

    const readlist = await readlistModel.deleteMany({ userId });

    if (!readlist) {
        throw giveError(
            createError(501, "could not clear the readlist", { mode: 'development' }),
            createError(501, "something went wrong, please try again", { mode: 'production' })
        )
    }

    return { success: true, data: readlist }
}



module.exports = {
    readReadlist,
    existInReadlist,
    addInReadlist,
    removeFromReadlist,
    clearReadlist
}