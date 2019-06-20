const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:String,
    facebookID:String
});

module.exports = mongoose.model("user",userSchema);