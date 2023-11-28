const { isLoggedIn } = require('../../../auth/auth');
const { findUserToken } = require('../../../utils/findUserToken');

const { imageUpload } = require('../../../utils/imageUpload');
const { createPostController, updatePostController, readPostController, deletePostController, updateReactController, } = require('./postController');
const { validateCreatePostData } = require('./postValidationSchema');

const postRouter = require('express').Router();

postRouter.post('/create', isLoggedIn, validateCreatePostData, imageUpload('post'), createPostController);

postRouter.get('/read', findUserToken, readPostController);

postRouter.post('/update/:slug', isLoggedIn, validateCreatePostData, imageUpload('post'), updatePostController);

postRouter.delete('/delete/:slug', isLoggedIn, deletePostController);

postRouter.post('/react/:postId/:react', isLoggedIn, updateReactController);


module.exports = postRouter;