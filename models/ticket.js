const { default: mongoose } = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title:String,
    category:String,
    description: String,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
         },
         assignedTo: {
          type: String,  
          ref: 'Mentee',  
          default: null 
      },
     language: String,
     status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
      createTime: {
        type: Date,
        default: Date.now
      }
})
const Ticket = mongoose.model('Ticket', ticketSchema)
module.exports = Ticket;