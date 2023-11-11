const { createPostController, updatePostController, readPostController, deletePostController } = require('./postController');

const postRouter = require('express').Router();

postRouter.post('/create', createPostController);

postRouter.get('/read/:slug', readPostController);

postRouter.post('/update/:slug', updatePostController);

postRouter.delete('/delete/:slug', deletePostController);


module.exports = postRouter;