const call = require('./readlistControlller')


const readlistRouter = require('express').Router()

readlistRouter.get('/', call.readReadlistController)
readlistRouter.put('/update/:postId', call.updateReadlistController)
readlistRouter.delete('/clear', call.clearReadlistController)


module.exports = readlistRouter