const Task = require("../models/taskmodel");
const User = require("../models/Usermodel");
const { redis } = require("../config/redisConnection");
const { response } = require("express");
const { default: mongoose } = require("mongoose");
const model = require("../config/geminiConnect");

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, tags, type } = req.body;

    const { id } = req.user;
    if (!id) {
      return res.status(403).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }

    if (!title || !description) {
      return res.status(401).json({
        success: false,
        message: "Please Give All Details!",
      });
    }

    //Hame User Ke Tasks Array Mai Bhi Push Karna Hoga.

    //SubTasksDaal Do

    const prompt = `
You are an intelligent task assistant.

Given a task with a title and description, break it down into 4 to 6 **actionable, concise subtasks**.

### Format your response as:
1. Subtask 1
2. Subtask 2
3. Subtask 3
...

### Task Title:
${title}

### Task Description:
${description}

Only return the numbered list — no extra explanation.
`;

    const result = await model.generateContent(prompt);
    const geminiresponse = await result.response;
    const text = geminiresponse.text();

    const textArray = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    const newTask = await Task.create({
      title,
      description,
      user: id,
      subTasks: textArray,
      priority: priority,
      tags: tags,
      type,
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: { tasks: newTask._id },
      },
      { new: true }
    ).populate("tasks");

    //Update The Cache Also
    const response = JSON.stringify({
      success: true,
      message: "Successfully Fetched All Tasks!",
      tasks: updatedUser.tasks,
      Image: updatedUser.image,
      Name: updatedUser.name,
    });
    await redis.del(id);
    await redis.setex(id, 150, response);
    return res.status(201).json({
      success: true,
      message: "Task Added Successfully!",
      task: newTask,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Creating Task!",
      error: error.message,
    });
  }
};

exports.removeTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(401).json({
        success: false,
        message: "Task Not Found!",
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { tasks: deletedTask._id },
      },
      { new: true }
    ).populate("tasks");

    await redis.del(userId);
    const response = {
      success: true,
      message: "Successfully Fetched All Tasks!",
      tasks: updatedUser.tasks,
      Image: updatedUser.image,
      Name: updatedUser.name,
    };
    await redis.setex(userId, 150, JSON.stringify(response));

    return res.status(200).json({
      success: true,
      message: "SucessFully Removed Task!",
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Occured While Removing task!",
      error: error.message,
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { id } = req.user;
    if (!id) {
      return res.status(403).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }

    //Search FRom Cache First!
    const cacheData = await redis.get(id);

    if (cacheData) {
      return res.json({
        success: true,
        message: "Successfully Fetched All Tasks FRom Cache!",
        tasks: cacheData.tasks,
        Image: cacheData.Image,
        Name: cacheData.Name,
      });
    }
    const user = await User.findById(id).populate("tasks");
    const response = {
      success: true,
      message: "Successfully Fetched All Tasks!",
      tasks: user.tasks,
      Image: user.image,
      Name: user.name,
    };
    await redis.setex(id, 150, JSON.stringify(response));

    return res.status(200).json({
      success: true,
      message: "Successfully Fetched All Tasks From DB!",
      tasks: user.tasks,
      Image: user.image,
      Name: user.name,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error While Fetching Tasks!",
      error: error.message,
    });
  }
};

exports.regenerateSubTask = async (req, res) => {
  try {
    const { taskId, subTasks } = req.body;
    const { id: userId } = req.user;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User Not Authenticated!",
      });
    }
    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required!",
      });
    }
    if (subTasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Subtasks Array Cannot Be Empty!",
      });
    }

    const task = await Task.findOne({ _id: taskId, user: userId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or does not belong to user.",
      });
    }

    const { title, description } = task;

    const generatePrompt = `
You're a smart productivity assistant.

I have a task titled: **"${title}"**
Its description is: "${description}"

The user has provided the following subtasks:
${subTasks.map((sub, i) => ` ${i + 1}. ${sub}`).join("\n")}

📌 Your Goal:
- Regenerate improved subtasks based on the above.
- Keep the user's intent, but improve clarity and order.
- Use simpler actionable language.
- Avoid duplicates or vague steps.
- Limit to 5–8 steps max unless more are necessary.

🎯 Output Format:
Return subtasks as a clean JavaScript array of strings.
Example:
["Research feature", "Set up folder structure", "Write API", "Test endpoints"]
`;

    const result = await model.generateContent(generatePrompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(javascript)?/g, '').trim();

    let parsedArray = [];

try {
  parsedArray = JSON.parse(cleanedText);
  if (!Array.isArray(parsedArray)) throw new Error("Not an array");
} catch (error) {
  console.error("❌ Failed to parse Gemini output:", error);
}


console.log("New SubTask :- ",parsedArray);


    //    const textArray = text.split("\n")
    //   .filter(line => line.trim() !== "")
    //   .map(line => line.replace(/^\d+\.\s*/, "").trim());

    //   const newTask = await Task.create({
    //     title,description,subTasks:textArray,user:userId
    //   });

     const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { subTasks: parsedArray },
          { new: true }
        );

        const userDetails = await User.findById(userId).populate('tasks');

    const userData = JSON.stringify({
                 success: true,
                message: "Successfully Fetched All Tasks!",
                tasks: userDetails.tasks,
                Image:userDetails.image,
                Name:userDetails.name
            });

               await redis.del(userId);
               await redis.setex(userId,150,userData);

         return res.status(200).json({
          success: true,
          message: "Subtasks added successfully using Gemini!",
          task: updatedTask,
        });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error generating subtasks from Gemini",
      error: error.message,
    });
  }
};

exports.findTask = async (req, res) => {
  try {
    let todoId = req.params.id;
    if (!todoId) {
      return res.status(401).json({
        success: false,
        message: "Please Provide TodoId!",
      });
    }

    const taskDetails = await Task.findById(todoId).populate("user");

    if (!taskDetails) {
      return res.status(403).json({
        success: false,
        message: "No Task Found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Succesfully Fetched The Task Details!",
      Data: taskDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error Fetching Task!",
      error: error.message,
    });
  }
};

exports.recentTasks = async (req,res) => {
  try {
    const {id} = req.user;
    if(!id){
      return res.status(400).json({
      success:false,
      message:"User Not Authenticated",
      error:error.message
    });
    }

    const recentTasks = await User.findById(id).populate({
path:'tasks',
options:{sort:{createdAt:-1}}
    });

    return res.status(200).json({
      success:true,
      message:"Succesfully Fetched Recent Tasks",
      recentTasks
    });
    
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error While Fetching Recent Tasks",
      error:error.message
    });
  }
}

exports.updateTask = async(req,res) => {
  try {
    const {taskId,title,description,completedSubTasks} = req.body;
    if(!taskId){
       return res.status(400).json({
      success:false,
      message:"Task ID is required.",
    });
    };

    const findTask = await Task.findById(taskId);
         if (!findTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found.",
      });
    }

    const updatedFields = {};
    if(title.trim()) updatedFields.title = title.trim();
    if(description.trim()) updatedFields.description = description.trim();
    if(typeof completedSubTasks === "number") updatedFields.completedSubTasks = completedSubTasks;
    if(title.trim() || description.trim()){
       const prompt = `
You are an intelligent task assistant.

Given a task with a title and description, break it down into 4 to 6 **actionable, concise subtasks**.

### Format your response as:
1. Subtask 1
2. Subtask 2
3. Subtask 3
...

### Task Title:
${updatedFields.title || findTask.title}

### Task Description:
${updatedFields.description || findTask.description}

Only return the numbered list — no extra explanation.
`;

    const result = await model.generateContent(prompt);
    const geminiresponse = await result.response;
    const text = geminiresponse.text();

    const textArray = text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

      updatedFields.subTasks = textArray;
    }
    

    const updatedTask = await Task.findByIdAndUpdate(taskId,updatedFields,{new:true});

    return res.status(200).json({
      success:true,
      message:"Succesfully Updated Values",
      updatedTask
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"Error While Updating Task",
      message:error.message
    });
  }
}
