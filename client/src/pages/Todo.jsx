import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Trash,
  BellIcon,
  CalendarIcon,
  ListTodoIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import axiosInstance from "../axios/axiosInstance";
import Modal from "../components/TodoPage/Modal";

function Todo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [Task, setTask] = useState({});
  const [apiCalled, setApiCalled] = useState(false);
  const [created, setCreated] = useState("");
  const [changesMade, setChangesMade] = useState(false);

  const title = useRef();
  const desc = useRef();

  const [completedCount, setCompletedCount] = useState(0);
  const [updatedSubTask,setUpdatedSubTask] = useState([]);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState([""]);
  const [submittedValue, setSubmittedValue] = useState([]);

  const GetTask = async () => {
    try {
      setApiCalled(true);
      const response = await axiosInstance.get(`/getTask/${id}`);
      const task = response?.data?.Data;
      setTask(task || {});
      setCreated(
        new Date(task.createdAt).toLocaleString("en-IN", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        })
      );
      console.log("Inital SubTasks:- ",task?.subTasks);
      title.current.value = task?.title || "";
      desc.current.value = task?.description || "";
      setUpdatedSubTask(task?.subTasks);
      setCompletedCount(task?.completedSubTasks || 0);
    } catch (error) {
      toast.error("Failed to fetch task.");
    } finally {
      setApiCalled(false);
    }
  };

  const handleCheck = (event,index) => {
    setChangesMade(true);
    const totalSubTasks = Task?.subTasks?.length || 0;
    const updated = [...updatedSubTask];
        if(event.target.checked){
          setCompletedCount(completedCount + 1);
          console.log("Inside If Statement");
    updated[index].completed = true;
      }else{
        setCompletedCount(completedCount - 1);
        console.log("Inside else Statement");
            updated[index].completed = false;
      }
        console.log("Updated SubTask :- ",updated[index]?.completed);
        setUpdatedSubTask(updated);
        console.log("Final Updated SubTask :- ",updatedSubTask);
  };

  const handleUpdate = async () => {
    const updatedValue = {
      taskId: id,
      completedSubTasks: completedCount,
      updatedSubTasks:updatedSubTask
    };

    if (title.current.value.trim())
      updatedValue.title = title.current.value.trim();
    if (desc.current.value.trim())
      updatedValue.description = desc.current.value.trim();

    try {
      setApiCalled(true);
      await axiosInstance.put("/updateTask", updatedValue);
      GetTask();
      toast.success("✅ Task Updated Successfully!");
      setChangesMade(false);
    } catch (error) {
      toast.error("❌ Task Update Failed!");
    } finally {
      setApiCalled(false);
    }
  };

  const handleSubmit = async () => {
    setSubmittedValue(inputs);
    setInputs([""]);
    setShowModal(false);
    try {
      setApiCalled(true);
      await axiosInstance.put("/regenrate-SubTasks", {
        taskId: id,
        subTasks: inputs,
      });
      GetTask();
      toast.success("Subtasks Updated");
    } catch (error) {
      toast.error("Error While Subtask Updation!");
    } finally {
      setApiCalled(false);
    }
  };

  const removeTask = async () => {
    try {
      setApiCalled(true);
      await axiosInstance.delete(`/remove/${id}`);
      toast.success("🗑️ Task Removed Successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Failed to remove task.");
    } finally {
      setApiCalled(false);
    }
  };

  const priority = Task.priority || "High";
  const tags = Task.tags || ["Frontend", "Urgent"];
  const type = Task.type || "Task";

  const typeIcon = {
    Task: <ListTodoIcon className="w-5 h-5 text-white/80" />,
    Meeting: <CalendarIcon className="w-5 h-5 text-white/80" />,
    Reminder: <BellIcon className="w-5 h-5 text-white/80" />,
  }[type];

  useEffect(() => {
    GetTask();
  }, []);

  return (
 <div
  className="min-h-screen overflow-y-auto flex flex-col items-center justify-center px-2 relative bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white font-outfit"
>
  {apiCalled && (
    <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <span className="relative flex h-14 w-14">
        <span className="animate-spin rounded-full border-[5px] border-white/10 border-r-blue-400 w-full h-full" />
      </span>
    </div>
  )}

  {/* Floating Action Buttons */}
  <div className="absolute top-5 left-4 z-50">
    <Button
      onClick={() => navigate(-1)}
      className="bg-white/10 hover:bg-blue-500/30 text-white text-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2"
    >
      <ArrowLeft className="w-4 h-4" /> Back
    </Button>
  </div>

  <div className="absolute top-5 right-4 z-50 flex gap-3">
    <Button
      onClick={removeTask}
      className="bg-rose-500/20 hover:bg-rose-600/30 text-white text-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2"
    >
      <Trash className="w-4 h-4" /> Remove
    </Button>
    <Button
      onClick={handleUpdate}
      disabled={!changesMade}
      className="bg-green-500/20 hover:bg-green-600/30 text-white text-sm px-4 py-2 rounded-full shadow-md flex items-center gap-2"
    >
      <Save className="w-4 h-4" /> Save
    </Button>
  </div>

  {/* Card */}
  <div className="w-full max-w-4xl mt-24 mb-10 p-8 rounded-2xl shadow-2xl bg-[#1e293b] bg-opacity-90 border border-white/10 backdrop-blur-md space-y-8">
    {/* Header */}
    <div className="text-center space-y-2">
      <div className="flex items-center justify-center text-2xl font-bold gap-2 text-white">
        {typeIcon} Task Details
      </div>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-white/60">
        <span className="bg-white/10 px-3 py-1 rounded-full">Created: {created}</span>
        <span className={`px-3 py-1 rounded-full font-semibold ${priority === "High"
          ? "bg-red-500/30 text-red-200"
          : priority === "Medium"
          ? "bg-yellow-500/30 text-yellow-100"
          : "bg-green-500/30 text-green-200"
        }`}>
          {priority} Priority
        </span>
        {tags.map((tag, i) => (
          <span key={i} className="bg-white/10 px-3 py-1 rounded-full">#{tag}</span>
        ))}
      </div>
    </div>

    {/* Inputs */}
    <div className="space-y-4">
      <input
        ref={title}
        onChange={() => setChangesMade(true)}
        placeholder="Title"
        className="bg-[#273445] w-full px-5 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-blue-400 outline-none text-xl font-semibold text-white placeholder-white/50"
      />
      <textarea
        ref={desc}
        onChange={() => setChangesMade(true)}
        placeholder="Description..."
        className="bg-[#273445] w-full px-5 py-3 rounded-xl border border-white/10 focus:ring-2 focus:ring-pink-400 outline-none resize-none text-white placeholder-white/50"
        rows={3}
      />
    </div>

    {/* Subtask Progress Bar */}
    {Task?.subTasks?.length > 0 && (
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/60 font-mono">
          <span>{completedCount}/{Task.subTasks.length} Completed</span>
          <span>{Math.round((completedCount / Task.subTasks.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300 ease-in-out"
            style={{ width: `${(completedCount / Task.subTasks.length) * 100}%` }}
          />
        </div>
      </div>
    )}

    {/* Subtasks */}
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-row justify-center items-center gap-x-2">
            <span className="h-2 w-2 animate-ping bg-blue-500 rounded-full"></span>
        <h4 className="text-lg font-semibold text-purple-300">Subtasks</h4>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white text-sm font-medium hover:opacity-90 shadow-md transition-all"
        >
          🔁 Generate Again with AI
        </button>
      </div>

      <div className="grid gap-2">
        {Task?.subTasks?.length ? (
          Task.subTasks.map((subTask, i) => (
            <label
              key={i}
              className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg border-l-4 border-blue-400 hover:bg-white/20 transition"
            >
              <input
                type="checkbox"
                checked={updatedSubTask[i]?.completed}
                onChange={(e) => handleCheck(e, i)}
                disabled={completedCount >= Task.subTasks.length}
                className="accent-green-500 scale-110 cursor-pointer"
              />
              <span className={updatedSubTask[i]?.completed ? "line-through text-green-300" : ""}>
                {subTask?.text}
              </span>
            </label>
          ))
        ) : (
          <div className="text-center text-gray-400 text-sm">
            No Subtasks Found
          </div>
        )}
      </div>
    </div>

    {/* Modal */}
    <Modal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      inputs={inputs}
      setInputs={setInputs}
      onSubmit={handleSubmit}
    />
  </div>
</div>

  );
}

export default Todo;
