const express = require('express');
const menteecontrollers = require('../controllers/menteecontroller');
const { auth_middleware } = require('../middleware/auth');
const MenteeRouter = express.Router();

MenteeRouter.post('/', menteecontrollers.signup)
MenteeRouter.post('/signin', menteecontrollers.singin)
MenteeRouter.post('/reset-password', menteecontrollers.resetPassword)
MenteeRouter.post('/reset-password/:OTP', menteecontrollers.newpassword)

MenteeRouter.patch('/:ticketId/:menteeId', menteecontrollers.assignMentee)
MenteeRouter.get('/:menteeId',auth_middleware, menteecontrollers.getMenteeTickets)
MenteeRouter.put('/:ticketId',menteecontrollers.closeTicket)

module.exports=MenteeRouter