const Task = require('../models/taskmodel');
const User = require('../models/Usermodel');

exports.createTask = async (req,res) => {
    try {
        
        const {title,description} = req.body;

        const {id} = req.user;
         if(!id){
            return res.status(403).json({
                success:false,
                message:"User Not Authenticated!"
            });
         }

        if(!title || !description){
return res.status(401).json({
    success:false,
    message:"Please Give All Details!"
});
        }

        const newTask = await Task.create({title,description,user:id});

        //Hame User Ke Tasks Array Mai Bhi Push Karna Hoga.

        const updatedUser = await User.findByIdAndUpdate(id,{
            $push:{tasks:newTask._id}
        }, {new:true});

        return res.status(201).json({
            success: true,
            message: "Task Added Successfully!",
            task: newTask,
            updatedUser
          });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Creating Task!",
            error:error.message
        });
    }
}

exports.removeTask = async(req,res) => {
    try {
        const {id} = req.params;

        const userId = req.user.id;
        if(!userId){
           return res.status(403).json({
               success:false,
               message:"User Not Authenticated!"
           });
        }

      const deletedTask = await Task.findByIdAndDelete(id);

      if(!deletedTask){
        return res.status(401).json({
            success:false,
            message:"Task Not Found!"
        });
    }
   const updatedUser = await User.findByIdAndUpdate(userId,{
        $pull:{tasks:deletedTask._id}
    },{new:true});

        return res.status(200).json({
            success:true,
            message:"SucessFully Removed Task!",
            updatedUser
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error Occured While Removing task!",
            error:error.message
        });
    }
}

exports.getTasks = async(req,res) => {
    try {
          
        const {id} = req.user;
         if(!id){
            return res.status(403).json({
                success:false,
                message:"User Not Authenticated!"
            });
         }

        const user = await User.findById(id).populate('tasks');

        return res.status(200).json({
            success: true,
            message: "Successfully Fetched All Tasks!",
            tasks: user.tasks,
            Image:user.image,
            Name:user.name
          });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error While Fetching Tasks!"
        });
    }
}