const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken');
const { JWTPASS, EMAIL_PASS } = require("../utiles/config");
const Mentee = require('../models/mentee');
const nodemailer = require('nodemailer');
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
    singin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkEmail = await Mentee.findOne({ email })
            if (checkEmail) {
                const passwordCheck = await bcrypt.compare(password, checkEmail.passwordHash)
                if (!passwordCheck) {
                    return res.json({ message: "password is incorrect" })
                }
                const Token = await jwt.sign({
                    email: email,
                    id: checkEmail._id
                }, JWTPASS)
                res.json({ Token, email })
            }
            res.json({ message: 'user not found!' })
        }
        catch (e) {
            console.log('singin error', e)
        }
    }, resetPassword: async (req, res) => {
        const { email } = req.body;
        const user = await Mentee.findOne({ email })
        if (!user) {
            return res.json({ meaasge: "Invaild User" })
        }
        const OTP = Math.random().toString(36).slice(-6);
        user.reset_OTP = OTP
        await user.save()
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'parthapn2017@gmail.com',
                pass: EMAIL_PASS,
            },
        });
        const Link = `https://candid-pudding-d739b9.netlify.app/reset-password/mentee-new-password/${OTP}`
        const mailOptions = {
            from: 'Password_resest_noreply@gmail.com',
            to: email,
            subject: 'Reset Your Password',
            text: `you are receiving this email because you request has passwords reset for your account .\n\n please use the following Link  to  Click reset your password:${Link} \n\n if you did not request a password to ignore this email. `,
        };
        
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.json({ message: 'Error sending reset email' });
            } else {
                return res.json({ message: 'Reset email sent successfully' });
            }
        });
    },
    newpassword: async (req, res) => {
        try {
            const { OTP } = req.params;
            const { password } = req.body;
            if (!password) {
                return res.json({ message: "please enter the new password" });
            }
            const user = await Mentee.findOne({ reset_OTP: OTP })
            if (!user) {
                return res.json({ message: "Invalid OTP" });
            }
            const NewPass = await bcrypt.hash(password, 10);
            user.passwordHash = NewPass;
            user.reset_OTP = null;
           
            await user.save();

            res.json({ meaasge: "password reset successfull" })
        }
        catch (e) {
            console.log(e)
        }
    },  assignMentee: async (req, res) => {
        try {
            const { ticketId, menteeId } = req.params;
            
            const ticket = await Ticket.findOne({ _id: ticketId })
            const mentee = await Mentee.findById(menteeId);

            if (ticket&&mentee&&ticket.assignedTo==null) {
                ticket.assignedTo = mentee;
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