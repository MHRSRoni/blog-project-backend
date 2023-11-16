const { isLoggedIn } = require('../../auth/auth')
const { createCommentController, readCommentController, updateCommentController, deleteCommentController } = require('./commentController')

const commentRouter = require('express').Router()

commentRouter.post('/create/:postId', isLoggedIn, createCommentController)
commentRouter.get('/read/:postId', readCommentController)
commentRouter.put('/update/:commentId', isLoggedIn, updateCommentController)
commentRouter.delete('/delete/:commentId', isLoggedIn, deleteCommentController)



module.exports = commentRouter