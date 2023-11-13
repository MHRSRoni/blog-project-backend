const userProfileRouter = require('./module/user/profile/userProfileRouter')
const commentRouter = require('./module/comment/commentRouter')
const readlistRouter = require('./module/readlist/readlistRouter')

const router = require('express').Router();



router.use('/user', userProfileRouter)
router.use('/comments', commentRouter)
router.use('/readlist'. readlistRouter)


module.exports = router;