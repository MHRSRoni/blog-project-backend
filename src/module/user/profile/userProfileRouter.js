const { userRegisterController, userLoginController, userLogoutController, otpSendController, otpVerifyController, userForgetPasswordController, userUpdatePasswordController } = require('./userProfileController');
const { isLoggedIn } = require('../../../auth/auth');

const router = require('express').Router();

router.post('/registration', userRegisterController);
router.post('/login', userLoginController);
router.get('/logOut', userLogoutController);
router.post('/otp', otpSendController);
router.post('/otpVerify', otpVerifyController);
router.post('/forget-password', userForgetPasswordController);
router.post('/update-password', userUpdatePasswordController);


router.get('/profile', isLoggedIn, userProfileController);
router.post('/profile/update', isLoggedIn, userProfileUpdateController);


module.exports = router;