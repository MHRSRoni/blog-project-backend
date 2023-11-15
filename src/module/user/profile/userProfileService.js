const createError = require('http-errors');
const userProfileModel = require("./userProfileModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// registration
exports.userRegistrator = async (userData) => {

    const existingEmail = await userProfileModel.findOne({ email: userData.email });
    if (existingEmail) {
        throw createError(409, 'Email already exists');
    } else {
        const newUser = await new userProfileModel(userData).save();
        return newUser;
    }
}

exports.userLoginService = async (loginData) => {
    const user = await userProfileModel.findOne({ email: loginData.email });
    if (!user) {
        throw createError(401, 'email and password mismatch');
    }
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
        throw createError(401, 'email and password mismatch');
    }
    const { password, ...rest } = user._doc
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET);
    return { success: true, message: 'Login Successful', token, ...rest };
}