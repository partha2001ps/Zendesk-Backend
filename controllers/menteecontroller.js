const bcrypt = require('bcrypt')
const Mentee = require('../models/mentee');
const Ticket = require('../models/ticket');

const menteecontrollers = {
    signup: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            const exitinguser = await Mentee.findOne({ email })
            if (exitinguser) {
                return res.json({ message: 'this email already used .to another email try or singin account' })
            }
            const passwordHash = await bcrypt.hash(password, 10)
            
            const user = new Mentee({
                name, email, passwordHash
            })
            await user.save()
            return res.status(200).json({ message: 'user created successfully' })
        }
        catch (e) {
            console.log('signup error', e)
        }
    },
     assignMentee: async (req, res) => {
        try {
            const { ticketId, menteeId } = req.params;
            
            const ticket = await Ticket.findOne({ _id: ticketId })
            const mentee = await Mentee.findById(menteeId);

            if (ticket&&mentee&&ticket.assignedTo==null) {
                ticket.assignedTo = mentee.name;
                ticket.status = 'In Progress';
                await ticket.save();
                mentee.tickets.push(ticket._id);
                await mentee.save();
                return res.status(200).json({ message: 'Mentee assigned successfully' });
            }
            return res.status(400).json({ message: 'Invalid ticket or mentee' });
        } catch (e) {
            console.log('assignMentee error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },  getMenteeTickets: async (req, res) => {
        try {
            const { menteeId } = req.params;
            const mentee = await Mentee.findById(menteeId).populate('tickets');

            if (mentee) {
                return res.status(200).json(mentee.tickets);
            }

            return res.status(400).json({ message: 'Invalid mentee' });
        } catch (e) {
            console.log('getMenteeTickets error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },  closeTicket: async (req, res) => {
        try {
            const { ticketId } = req.params;
            const ticket = await Ticket.findById(ticketId);

            if (ticket && ticket.assignedTo) {
                ticket.status = 'Closed';
                await ticket.save();

                return res.status(200).json({ message: 'Ticket closed successfully' });
            }

            return res.status(400).json({ message: 'Invalid ticket or ticket not assigned' });
        } catch (e) {
            console.log('closeTicket error', e);
            return res.status(500).json({ message: 'Internal error' });
        }
    },
}
module.exports = menteecontrollers;