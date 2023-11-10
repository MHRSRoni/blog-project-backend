const { userRegistrationSchema } = require("./userProfileValidation");
const { userRegistrator } = require("./userProfileService");
exports.userRegisterController = async (req, res, next) => {

    try {
        const userData = req.body;
        const verifiedData = await userRegistrationSchema.validateAsync(userData);
        const result = await userRegistrator(verifiedData);
        res.status(200).json(result);

    } catch (error) {
        next(error)
    }
}
