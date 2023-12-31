/**
 * @category Readlist
 * @module ReadlistController
 * @author MHRoni
*/

//===================Imports===================//
const service = require("./readlistService")
const { validateObjectID } = require("./readlistValidation")
//===============================================//



//===================Types====================//
const {Request, Response, NextFunction} = require("express")

/**
 * @typedef GeneratedResponse The json response generated from the Request.
 * @property {boolean} success - The success status of the request.
 * @property {string} message - The message associated with the request.
 * @property {Object} [data] - The data associated with the request.
  * @property {string} [data.totalPage] - The total number of pages.
 * @property {string} [data.currentPage] - The current page number.
 * @property {string} [data.perPage] - The number of posts per page.
 * @property {Array} [data.posts] - The  psosts in the readlist data.
 * @property {Object} [error] - The error associated with the request.
 */
//===============================================//




//===================Controller===================//

/**
 * @function readReadlistController
 * @description 
 * - This function [validate the userId]{@link module:ReadlistValidation~validateObjectID} 
 * - call the [readReadlist]{@link module:ReadlistService~readReadlist} service and.
 * - Then the result is send in response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Object}  req.query - The query object of express.
 * @param {String} [req.query.search] - The keyword to search for in the readlist.
 * @param {String} [req.query.currentPage=1] - The current page number.
 * @param {String} [req.query.perPage=10] - The number of posts per page.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the result of the request.
 */
const readReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const search = req.query.search
        const currentPage = req.query.currentPage //|| 1
        const perPage = req.query.perPage // || 10

        const validUserId = await validateObjectID(userId)

        const result = await service.readReadlist(validUserId, search, currentPage, perPage)
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}




/**
 * @async
 * @function updateReadlistController 
 * @description
 * - This function [validates the userId and postId]{@link module:ReadlistValidation~validateObjectID}
 * - then with the validated userId and postId check if post is [already in readlist]{@link module:ReadlistService~existInReadlist}.
 *   - If it is not in readlist then call the  [addInReadlist]{@link module:ReadlistService~addInReadlist} service  and send the Result as JSON response.
 *   - If it is in readlist then call the  [removeFromReadlist]{@link module:ReadlistService~removeFromReadlist} service and send the Result as JSON response.
 *
 * @param {Request} req - The request object of express.
 * @param {Object} req.params - The params object of express.
 * @param {String} req.params.postId - The postId of the post.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the result of the request.
 */
const updateReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const postId = req.params?.postId

        const validUserId = await validateObjectID(userId)
        const validPostId = await validateObjectID(postId)

        const alreadyExist = await service.existInReadlist(validUserId, validPostId)
        let result = {}

        if (!alreadyExist) {
            result = await service.addInReadlist(validUserId, validPostId)
        }
        else {
            result = await service.removeFromReadlist(validUserId, validPostId)
        }

        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}




/**
 * @async
 * @function clearReadlistController 
 * @description
 * - This function [validates the userId]{@link module:ReadlistValidation~validateObjectID}
 * - then with the validated userId call the [clearReadlist]{@link module:ReadlistService~clearReadlist} service.
 * - then send the result as JSON response
 *
 * @param {Request} req - The request object of express.
 * @param {Object} req.user - The user object decrypted from token.
 * @param {String} req.user.id - The userId of the user.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the result of the request.
 */
const clearReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const validUserId = await validateObjectID(userId)

        const result = await service.clearReadlist(validUserId)
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

//===============================================//



//==================Exports====================//
module.exports = {
    readReadlistController,
    updateReadlistController,
    clearReadlistController
}
//===============================================//