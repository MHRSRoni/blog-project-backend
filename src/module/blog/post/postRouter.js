const { isLoggedIn } = require('../../../auth/auth');
const { createPostController, updatePostController, readPostController, deletePostController } = require('./postController');

const postRouter = require('express').Router();

postRouter.post('/create', isLoggedIn, createPostController);

postRouter.get('/read/:slug', readPostController);

postRouter.post('/update/:slug', isLoggedIn, updatePostController);

postRouter.delete('/delete/:slug', isLoggedIn, deletePostController);


module.exports = postRouter;