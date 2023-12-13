const { default: mongoose } = require("mongoose");
 
const userSchema =new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    activationToken: String,
    activated: { type: Boolean, default: false },
    reset_OTP: String
})
const User = mongoose.model('User', userSchema, 'users')

module.exports = User;