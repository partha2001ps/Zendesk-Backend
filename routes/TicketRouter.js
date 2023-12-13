const express = require('express');
const { auth_middleware } = require('../middleware/auth');
const ticketcontroller = require('../controllers/ticketcontrollers');
const TicketRouter = express.Router();

TicketRouter.post('/', auth_middleware, ticketcontroller.createTicket)
TicketRouter.get('/', auth_middleware, ticketcontroller.getTicket)
TicketRouter.delete('/:ticketId', auth_middleware, ticketcontroller.deleteTicket)
TicketRouter.patch('/:ticketId',auth_middleware,ticketcontroller.deleteTicket)

module.exports=TicketRouter