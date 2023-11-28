const { userRegisterController, userLoginController, userLogoutController, otpSendController, otpVerifyController, userForgetPasswordController, userUpdatePasswordController, userProfileController, userProfileUpdateController, userEmailVerifyController } = require('./userProfileController');
const { isLoggedIn } = require('../../../auth/auth');
const { imageUpload } = require('../../../utils/imageUpload');
const { validateCreateUserdata } = require('./userProfileValidation');
const { isVerifiedFor } = require('../../auth/verification/verificationMiddleware');

const router = require('express').Router();

router.post('/registration', validateCreateUserdata, imageUpload('user'), userRegisterController);
router.post('/login', userLoginController);
router.get('/logOut', userLogoutController);
router.get('/profile', isLoggedIn, userProfileController);

router.post('/profile/update', isLoggedIn, imageUpload('user'), userProfileUpdateController);
router.post('/update-password', userUpdatePasswordController);

router.get('/email-verify', isVerifiedFor('email verification'), userEmailVerifyController)
router.post('/forget-password', isVerifiedFor('forget password'), userForgetPasswordController);


module.exports = router;