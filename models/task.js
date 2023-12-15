const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    taskTitle:String,
    frontendsourcecode: String,
    frontendDepoly: String,
    backendsourcecode: String,
    backendDeploy: String,
    commands:String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
         }
})
const Task = mongoose.model('Task', taskSchema);

module.exports=Task