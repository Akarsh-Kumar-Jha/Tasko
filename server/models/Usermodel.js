const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name Is Required!"],
        trim:true,
        minlength:2,
        maxlength:50
    },
    email:{
        type:String,
        required:[true,"Email Is Required!"],
        trim:true,
        lowercase:true,
        index:true,
        unique: true
    },
    password:{
        type:String,
        required:[true,"Password Is Required!"],
        trim:true
    },
    tasks:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Task"
        }
    ],
    image:{
        type:String
    }
});

module.exports = mongoose.model("User",userSchema);