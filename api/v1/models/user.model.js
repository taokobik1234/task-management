const mongoose = require("mongoose");


const usersSchema = new mongoose.Schema(
    { 
       fullName : String,
       email: String,
       password:String,
       token: {
        type: String,
       },
       deleted: {
            type : Boolean,
            default:false 
       },
       deletedAt: Date
    },{
        timestamps : true
    });

const User = mongoose.model('User',usersSchema,"users");

module.exports = User;