const { createCommentController, readCommentController, updateCommentController, deleteCommentController } = require('./commentController')

const commentRouter = require('express').Router()

commentRouter.post('/create', createCommentController)
commentRouter.get('/', readCommentController)
commentRouter.put('/update', updateCommentController)
commentRouter.delete('/delete', deleteCommentController)



module.exports = commentRouter