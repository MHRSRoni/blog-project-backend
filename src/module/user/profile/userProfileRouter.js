const { userRegisterController, userLoginController, userLogoutController, userForgetPasswordController, userUpdatePasswordController, userProfileController, userProfileUpdateController, userEmailVerifyController, protectedController, failureController } = require('./userProfileController');
const { isLoggedIn, isLoggedInGoogle } = require('../../../auth/auth');
const { imageUpload } = require('../../../utils/imageUpload');
const { validateCreateUserdata } = require('./userProfileValidation');
const { isVerifiedFor } = require('../../auth/verification/verificationMiddleware');
const passport = require('passport')

const router = require('express').Router();

router.post('/registration', validateCreateUserdata, imageUpload('user'), userRegisterController);
router.post('/login', userLoginController);
router.get('/logOut', userLogoutController);
router.get('/profile', isLoggedIn, userProfileController);

router.post('/profile/update', isLoggedIn, imageUpload('user'), userProfileUpdateController);
router.post('/update-password', userUpdatePasswordController);

router.get('/email-verify', isVerifiedFor('email verification'), userEmailVerifyController)
router.post('/forget-password', isVerifiedFor('forget password'), userForgetPasswordController);


//!Login With Google

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] }
    ));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/api/v1/user/protected',
        failureRedirect: '/api/v1/user/auth/google/failure'
    }
    )
);

router.get('/protected', isLoggedIn, protectedController);

router.get('/auth/google/failure', failureController);


module.exports = router;