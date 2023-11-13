const { userRegisterController, userLoginController, userLogoutController, otpSendController } = require('./userProfileController');

const router = require('express').Router();

router.post('/registration', userRegisterController);
router.post('/login', userLoginController);
router.get('/logOut', userLogoutController);
router.post('/otp', otpSendController);


module.exports = router;