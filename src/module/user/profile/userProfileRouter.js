const { userRegisterController } = require('./userProfileController');

const router = require('express').Router();

router.post('/registration', userRegisterController)

module.exports = router;