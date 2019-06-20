const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    content:String,
    createdOn:{
        type:Date,
        default:Date.now
    },
    createBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
});

module.exports = mongoose.model("task",taskSchema);