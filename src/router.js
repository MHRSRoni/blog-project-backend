const postRouter = require('./module/blog/post/postRouter');
const categoryRouter = require('./module/blog/category/categoryRouter');
const userProfileRouter = require('./module/user/profile/userProfileRouter')
const commentRouter = require('./module/comment/commentRouter')
const readlistRouter = require('./module/user/readlist/readlistRouter');
const verificationRouter = require('./module/auth/verification/verificationRouter');

const router = require('express').Router();



router.use('/user', userProfileRouter)
router.use('/comments', commentRouter)
router.use('/readlist', readlistRouter)
router.use('/post', postRouter)
router.use('/category', categoryRouter)
router.use('/verification', verificationRouter)


module.exports = router;