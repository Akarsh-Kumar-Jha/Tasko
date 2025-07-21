const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required for task creation"],
    trim: true,
    minlength:5,
    maxlength:100
  },
  description: {
    type: String,
    required: [true, "Description is required for task creation"],
    trim: true,
    minlength:10,
    maxlength:150
  },
  subTasks: {
    type: [String],
    default: [],
  },
  completedSubTasks: {
    type: Number,
    default: 0,
  },
  status: {
    type:String,
    enum: ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"],
    default:"Pending"
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  tags: {
    type: [String],
    default: [], // Example: ["Frontend", "Urgent"]
  },
  type: {
    type: String,
    enum: ["Task", "Meeting", "Reminder","Study"],
    default: "Task",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
