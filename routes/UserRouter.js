const express = require('express');
const usercontrollers = require('../controllers/usercontroller');
const UserRouter = express.Router();

UserRouter.post('/', usercontrollers.signup);
UserRouter.post('/signin',usercontrollers.signin)
UserRouter.post('/active-link/:email', usercontrollers.activetlikesent);
UserRouter.get('/active/:activationToken', usercontrollers.activateAccount)
UserRouter.post('/reset-password', usercontrollers.resetPassword)
UserRouter.post('/reset-password/:OTP',usercontrollers.newpassword)
module.exports=UserRouter