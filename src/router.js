const userProfileRouter = require('./module/user/profile/userProfileRouter')
const commentRouter = require('./module/comment/commentRouter')
const router = require('express').Router();



router.use('/user', userProfileRouter)
router.use('/comments', commentRouter)


module.exports = router;