const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * @module User/Profile/Model
 * @description This is where the user profile schema and model is defined.
 */



/**
 * @typedef {object} UserProfile
 * @property {string} userType - The type of user (e.g., 'google', 'facebook', 'normal').
 * @property {string} name - The name of the user.
 * @property {string} userName - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user (only for 'normal' userType).
 * @property {string} picture - The URL of the user's picture.
 * @property {string} phone - The phone number of the user.
 * @property {Array<string>} interest - An array of user interests.
 * @property {string} role - The role of the user (default: 'user').
 * @property {string} status - The status of the user (default: 'unverified' for 'normal' userType, 'verified' otherwise).
 */



/**
 * Mongoose schema for user profiles.
 * @type {module('mongoose').Schema<UserProfile>}
 */
const userProfileSchema = new Schema({
    
    userType: {
        type: String,
        required: true,
        enum: ['google', 'facebook', 'normal'],
        default: 'normal'
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    userName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: () => this.userType == 'normal' ? true : false,
    },
    picture: {
        type: String,
        trim: true,
        default : 'https://res.cloudinary.com/dscxtnb94/image/upload/v1700723393/health_plus/user/download_dxmyep.png'
    },
    phone: {
        type: String,
        trim: true,
    },
    interest: {
        type: Array
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        default: () => this.userType == 'normal' ? 'unverified' : 'verified'
    }
},
    { versionKey: false, timestamps: true }
)

/**
 * Mongoose middleware to hash the user's password before saving.
 * @function
 */
userProfileSchema.pre('save', async function (next) {
    if(!this.userType)  this.userType = 'normal'
    if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
    
    next();
})


/**
 * Mongoose model for user profile.
 * @type {module('mongoose').Model<UserProfile>}
 */
const userProfileModel = model('users', userProfileSchema);

module.exports = userProfileModel;