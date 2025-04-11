const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    completed:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

module.exports = mongoose.model("Task",taskSchema);