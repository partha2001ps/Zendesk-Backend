const { default: mongoose } = require("mongoose");

const menteeSchema =new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    reset_OTP: String,
    tickets: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    ]
})
const Mentee = mongoose.model('Mentee', menteeSchema)

module.exports = Mentee;