const postRouter = require('./module/blog/post/postRouter');
const userProfileRouter = require('./module/user/profile/userProfileRouter')
const router = require('express').Router();



router.use('/user', userProfileRouter)
router.use('/post', postRouter)


module.exports = router;