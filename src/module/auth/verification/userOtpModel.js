const {Schema, model} = require('mongoose');

const otpSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type : String,
        required : true
    },
    subject : {
        type : String,
        requried : true
    }
    
}, { timestamps: true, versionKey: false });

const userOtpModel = model('Otp', otpSchema);
module.exports = userOtpModel;