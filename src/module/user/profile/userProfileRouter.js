const { userRegisterController, userLoginController, userLogoutController } = require('./userProfileController');

const router = require('express').Router();

router.post('/registration', userRegisterController)
router.post('/login', userLoginController)
router.get('/logOut', userLogoutController)

module.exports = router;