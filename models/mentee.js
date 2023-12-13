const { default: mongoose } = require("mongoose");

const menteeSchema =new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    reset_OTP: String
})
const Mentee = mongoose.model('Mentee', menteeSchema)

module.exports = Mentee;