const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userProfileSchema = new Schema({
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
        required: true,
    },
    picture: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        default: 'user'
    },
    status: {
        type: String,
        default: 'unverified'
    }
},
    { versionKey: false, timestamps: true }
)

userProfileSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 15);
    }
    next();
})


const userProfileModel = model('users', userProfileSchema);

module.exports = userProfileModel;