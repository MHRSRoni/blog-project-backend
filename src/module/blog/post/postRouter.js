const { isLoggedIn } = require('../../../auth/auth');
const { createPostController, updatePostController, readPostController, deletePostController } = require('./postController');

const postRouter = require('express').Router();

postRouter.post('/create', createPostController);

postRouter.get('/read', readPostController);

postRouter.post('/update/:slug', isLoggedIn, updatePostController);

postRouter.delete('/delete/:slug', isLoggedIn, deletePostController);


module.exports = postRouter;