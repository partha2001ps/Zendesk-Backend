const Task = require("../models/task");

const taskcontroller = {
    createTask: async (req, res) => {
        try {
            const userId = req.userId;
            const {taskTitle, frontendsourcecode, frontendDepoly, backendsourcecode, backendDeploy,commands } = req.body;
            const newTask = new Task({
                taskTitle,
                frontendsourcecode,
                frontendDepoly,
                backendsourcecode,
                backendDeploy,
                commands,
                user: userId,
            });
            await newTask.save();
            res.status(201).json({ message: "Task created successfully", task: newTask });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    editTask: async (req, res) => {
        try {
            const taskId = req.params.taskId;
            const { taskTitle,frontendsourcecode, frontendDepoly, backendsourcecode, backendDeploy,commands} = req.body;
            const task = await Task.findById(taskId);
            if (!task) {
                return res.status(404).json({ message: "Task not found" });
            }
            task.taskTitle=taskTitle,
            task.frontendsourcecode = frontendsourcecode;
            task.frontendDepoly = frontendDepoly;
            task.backendsourcecode = backendsourcecode;
            task.backendDeploy = backendDeploy;
            task.commands=commands
            await task.save();
            res.json({ message: "Task updated successfully", task });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },

    getTasksByUser: async (req, res) => {
        try {
            const userId = req.userId;
            const tasks = await Task.find({ user: userId });
            res.json({ tasks });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    },
};

module.exports = taskcontroller;
