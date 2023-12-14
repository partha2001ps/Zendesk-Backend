const User = require('../models/user');
const Ticket = require('../models/ticket');

const ticketcontroller = {
    createTicket: async (req, res) => {
        try {
            const { title, category, description,language} = req.body;
            const userId = req.userId;
            const user = await User.findById(userId)
            if (user && user.activated) {
                const quary = new Ticket({
                    title, category, description, createTime: new Date(), user: userId,language
                })
                await quary.save()
                return res.status(200).json({message:"ticket create successfull"})
            }
            return res.status(400).json({message:'not vaild user only vaild user to create the ticket'})
        } catch (e) {
            console.log('error occur in create the ticket', e)
            return res.status(500).json({message:'internal error'})
        }
    },
    getTicket: async (req, res) => {
        try {
            const userId = req.userId;
            const user = await Ticket.find({user:userId})
            if (user) {
                return res.status(200).json(user)
            }
            return res.status(400).json({message:"user not authorization"})
        } catch (e) {
            console.log('error in get all Tickets', e)
            return res.status(500).json({message:'internal error'})
        }
    },
    editTicket:async (req,res)=> {
        try {
            const userId = req.userId;
            const { ticketId }= req.params;
            const user = await Ticket.findOne({ _id: ticketId, user: userId })
            if (user) {
                await Ticket.findOneAndUpdate({ _id: ticketId, user: userId }, {
                    title: req.body.title,
                    category: req.body.category,
                    description: req.body.description,
                    language:req.body.language
                });
                return res.status(200).json({ message: 'ticket edit successful' });
            }
            return res.status(400).json({message:"user not authorization or ticket not found"})
        } catch (e) {
            console.log('error in edit Ticket', e)
            return res.status(500).json({message:'internal error'})
        }
    },
    deleteTicket: async (req, res) => {
        try {
            const userId = req.userId;
            const { ticketId }= req.params;
            const user = await Ticket.findOne({ _id: ticketId, user: userId })
            if (user) {
                await Ticket.findOneAndDelete({ _id: ticketId})
                return res.status(200).json({ message: 'ticket delete successful' });
            }
            return res.status(400).json({ message: "user not authorized or ticket not found" });
        } catch (e) {
            console.log('delete ticket error', e)
            return res.status(500).json({message:'internal error'})
        }
    },
    getAllTickets: async (req, res) => {
        try {
            const tickets = await Ticket.find();
            return res.status(200).json(tickets);
        } catch (e) {
            console.log('error in get all Tickets', e);
            return res.status(500).json({ message: 'internal error' });
        }
    },
}

module.exports=ticketcontroller