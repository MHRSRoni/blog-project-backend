const { userRegisterController, userLoginController, userLogoutController, otpSendController, otpVerifyController, userForgetPasswordController, userUpdatePasswordController } = require('./userProfileController');

const router = require('express').Router();

router.post('/registration', userRegisterController);
router.post('/login', userLoginController);
router.get('/logOut', userLogoutController);
router.post('/otp', otpSendController);
router.post('/otpVerify', otpVerifyController);
router.post('/forget-password', userForgetPasswordController);
router.post('/update-password', userUpdatePasswordController);



module.exports = router;