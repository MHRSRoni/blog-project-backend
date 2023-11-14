const postRouter = require('./module/blog/post/postRouter');
const userProfileRouter = require('./module/user/profile/userProfileRouter')
const commentRouter = require('./module/comment/commentRouter')
const readlistRouter = require('./module/user/readlist/readlistRouter')

const router = require('express').Router();



router.use('/user', userProfileRouter)
router.use('/comments', commentRouter)
router.use('/readlist'. readlistRouter)
router.use('/post', postRouter)


module.exports = router;