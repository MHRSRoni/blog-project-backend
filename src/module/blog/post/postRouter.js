const { isLoggedIn } = require('../../../auth/auth');
const { createPostController, updatePostController, readPostController, deletePostController, likeDislikePostController, updateReactController, searchPostController } = require('./postController');

const postRouter = require('express').Router();

postRouter.post('/create', isLoggedIn, createPostController);

postRouter.get('/read', readPostController);

postRouter.post('/update/:slug', isLoggedIn, updatePostController);

postRouter.delete('/delete/:slug', isLoggedIn, deletePostController);

postRouter.post('/react/:postId/:react', isLoggedIn, updateReactController);

postRouter.get('/', searchPostController);


module.exports = postRouter;