const { isLoggedIn } = require('../../../auth/auth');
const { imageUpload } = require('../../../utils/imageUpload');
const { parseFormData } = require('../../../utils/parseFormData');
const { createPostController, updatePostController, readPostController, deletePostController, updateReactController, } = require('./postController');
const { validateCreatePostData } = require('./postValidationSchema');

const postRouter = require('express').Router();

postRouter.post('/create', isLoggedIn, parseFormData, validateCreatePostData, imageUpload('post'), createPostController);

postRouter.get('/read', readPostController);

postRouter.post('/update/:slug', isLoggedIn, updatePostController);

postRouter.delete('/delete/:slug', isLoggedIn, deletePostController);

postRouter.post('/react/:postId/:react', isLoggedIn, updateReactController);


module.exports = postRouter;