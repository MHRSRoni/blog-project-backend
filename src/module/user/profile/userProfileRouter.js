const { isLoggedIn } = require('../../../auth/auth');
const { userRegisterController, userLoginController, userLogoutController, userProfileController, userProfileUpdateController } = require('./userProfileController');

const router = require('express').Router();

router.post('/registration', userRegisterController);

router.post('/login', userLoginController);

router.get('/logOut', userLogoutController);

router.get('/profile', isLoggedIn, userProfileController);

router.post('/profile/update', isLoggedIn, userProfileUpdateController);


module.exports = router;