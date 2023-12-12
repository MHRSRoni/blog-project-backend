const service = require("./readlistService")
const { ObjectIdSchema } = require("./readlistValidation")
const {Request, Response, NextFunction} = require("express")
/**
 * @category Readlist
 * @module Controller
 */

/**
 * @typedef GeneratedResponse The json response generated from the Request.
 * @property {boolean} success - The success status of the request.
 * @property {string} message - The message associated with the request.
 * @property {Object} [data] - The data associated with the request.
 * @property {Object} [error] - The error associated with the request.
 */


/**
 * @function ReadReadList
 * @description This function validate the userId and call the [readReadlist]{@link module:Service~readReadlist} service and generate and send the response as json.
 * @async
 * 
 * @param {Request} req - The request object of express.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the result of the request.
 */
const readReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const validUserId = await ObjectIdSchema.validateAsync(userId)

        const result = await service.readReadlist(validUserId)
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}


/**
 * @async
 * @function readReadlistController Read Readlist Controller.
 * @description This function validates the userId and calls the readReadlist service to generate and send the response as JSON.
 *
 * @param {Request} req - The request object of express.
 * @param {Response} res - The response object of express.
 * @param {NextFunction} next - The next middleware function of the express.
 * @return {GeneratedResponse} The JSON response containing the result of the request.
 */
const updateReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const postId = req.params?.postId

        const validUserId = await ObjectIdSchema.validateAsync(userId)
        const validPostId = await ObjectIdSchema.validateAsync(postId)

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



const clearReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const validUserId = await ObjectIdSchema.validateAsync(userId)

        const result = await service.clearReadlist(validUserId)
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}



module.exports = {
    readReadlistController,
    updateReadlistController,
    clearReadlistController
}