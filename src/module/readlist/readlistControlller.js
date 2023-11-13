const { readReadlist, existInReadlist, addInReadlist, removeFromReadlist, clearReadlist } = require("./readlistService")
const { ObjectIdSchema } = require("./readlistValidation")

const readReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id 
        const validUserId = await ObjectIdSchema.validateAsync(userId)

        const result = await readReadlist(validUserId)
        return res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}



const updateReadlistController = async (req, res, next) => {
    try {

        const userId = req?.user?.id
        const postId = req.params?.postId

        const validUserId = await ObjectIdSchema.validateAsync(userId)
        const validPostId = await ObjectIdSchema.validateAsync(postId)

        const alreadyExist = await existInReadlist(validUserId, validPostId)
        let result = {}

        if(alreadyExist){
            result = await addInReadlist(validUserId, validPostId)
        }
        else{
            result = await removeFromReadlist(validUserId, validPostId)
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

        const result = await clearReadlist(validUserId)
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