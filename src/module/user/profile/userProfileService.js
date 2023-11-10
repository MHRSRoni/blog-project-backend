const createError = require('http-errors');
const userProfileModel = require("./userProfileModel");


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

exports.login = () => {

}