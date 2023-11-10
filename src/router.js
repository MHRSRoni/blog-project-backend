const userProfileRouter = require('./module/user/profile/userProfileRouter')
const router = require('express').Router();



router.use('/user', userProfileRouter)


module.exports = router;