const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        code: {
            type: Number,
            default: 0
        },
        type: {
            type: String
        }
    }
}, { timestamps: true, versionKey: false });

const userOtpModel = mongoose.model('Otp', otpSchema);
module.exports = userOtpModel;