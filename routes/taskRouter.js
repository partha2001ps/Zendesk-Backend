const express = require('express');
const taskcontroller = require('../controllers/taskcontroller');
const { auth_middleware } = require('../middleware/auth');
const taskRouter = express.Router();

taskRouter.post('/', auth_middleware, taskcontroller.createTask)
taskRouter.patch('/:taskId',auth_middleware,taskcontroller.editTask)
taskRouter.get('/', auth_middleware, taskcontroller.getTasksByUser)

module.exports=taskRouter