const { isLoggedIn } = require('../../../auth/auth');
const { imageUpload } = require('../../../utils/imageUpload');
const { parseUserFormData } = require('../../../utils/parseFormData');
const { userRegisterController, userLoginController, userLogoutController, userProfileController, userProfileUpdateController } = require('./userProfileController');
const { validateCreateUserdata } = require('./userProfileValidation');

const router = require('express').Router();

router.post('/registration', parseUserFormData, validateCreateUserdata, imageUpload('user'), userRegisterController);

router.post('/login', userLoginController);

router.get('/logOut', userLogoutController);

router.get('/profile', isLoggedIn, userProfileController);

router.post('/profile/update', isLoggedIn, userProfileUpdateController);


module.exports = router;