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
      className="min-h-screen flex flex-col items-center justify-center text-foreground px-2 relative"
      style={{
        background: "linear-gradient(120deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      {apiCalled && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center">
          <span className="relative flex h-16 w-16">
            <span className="animate-spin rounded-full border-[6px] border-white/10 border-r-blue-400 w-full h-full" />
          </span>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="absolute top-4 left-2 md:left-4 z-50">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="rounded-full text-[3vw] md:text-xl px-2 py-1 md:px-4 md:py-2 bg-white/20 text-white shadow hover:bg-blue-400/30 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1 md:mr-2 text-[3vw] md:text-xl" /> Back
        </Button>
      </div>
      <div className="absolute top-4 right-[2%] flex flex-row justify-center items-center gap-x-2 md:gap-x-5 z-50">
        <Button
          onClick={removeTask}
          variant="ghost"
          className="rounded-full text-[3vw] md:text-xl px-2 py-1 md:px-4 md:py-2 bg-white/20 text-white shadow hover:bg-rose-500/30 transition"
        >
          <Trash className="w-4 h-4 mr-2" /> Remove
        </Button>


          <Button
          disabled={!changesMade}
          onClick={handleUpdate}
          variant="ghost"
          className="rounded-full px-2 py-1 md:px-4 md:py-2 text-[3vw] md:text-xl bg-white/20 text-white shadow hover:bg-green-400/30 transition"
        >
          <Save className="w-4 h-4 mr-1 md:mr-2" /> Save Changes
        </Button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-[#111827] mt-24 mb-10 p-8 rounded-2xl shadow-xl border border-white/10 backdrop-blur-lg flex flex-col gap-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="text-center text-white">
          <div className="flex items-center justify-center gap-2 text-2xl font-bold">
            {typeIcon} Task Details
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-sm text-white/70">
            <span className="bg-white/10 px-3 py-1 rounded-full">
              Created: {created}
            </span>
            <span
              className={`px-3 py-1 rounded-full font-semibold ${
                priority === "High"
                  ? "bg-red-500/30 text-red-200"
                  : priority === "Medium"
                  ? "bg-yellow-500/30 text-yellow-100"
                  : "bg-green-500/30 text-green-200"
              }`}
            >
              {priority} Priority
            </span>
            {tags.map((tag, i) => (
              <span key={i} className="bg-white/10 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-4">
          <input
            ref={title}
            onChange={() => setChangesMade(true)}
            placeholder="Title"
            className="bg-[#1e293b] text-white px-5 py-3 rounded-lg border border-blue-400/20 focus:ring-2 focus:ring-blue-500 outline-none text-xl font-semibold"
          />
          <textarea
            ref={desc}
            onChange={() => setChangesMade(true)}
            placeholder="Description..."
            className="bg-[#1e293b] text-white px-5 py-3 rounded-lg border border-pink-400/10 focus:ring-2 focus:ring-pink-400 outline-none text-base resize-none"
            rows={3}
          />
        </div>

        {/* Subtask Progress */}
        {Task?.subTasks?.length > 0 && (
          <div className="w-full">
            <div className="flex justify-between text-white/70 text-xs font-mono mb-1">
              <span>
                {completedCount}/{Task.subTasks.length} Completed
              </span>
              <span>
                {Math.round((completedCount / Task.subTasks.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400"
                style={{
                  width: `${(completedCount / Task.subTasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Subtasks */}
        <div>
          <div className="flex flex-row justify-between items-center">
            <h4 className="text-lg font-semibold text-purple-400 mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-pink-500 to-blue-400" />
              Subtasks
            </h4>
 <button
  onClick={() => setShowModal(true)}
  className="w-full sm:w-auto text-center 
             px-4 sm:px-5 py-2 sm:py-2.5 mb-2 
             rounded-lg font-semibold 
             text-white text-sm sm:text-base 
             bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
             hover:from-blue-700 hover:via-purple-700 hover:to-pink-600 
             transition-all duration-300 shadow-lg hover:shadow-xl 
             focus:outline-none"
>
  <span className="sm:hidden">🔁</span>
  <span className="hidden sm:inline">🔁 Generate Again With AI</span>
</button>


          </div>

          <div className="grid gap-2">
            {Task?.subTasks?.length ? (
              Task.subTasks.map((subTask, i) => (
                <label
                  key={i}
                  className="bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-3 border-l-4 border-blue-400 cursor-pointer"
                >
                  <input
                    type="checkbox"
                     checked={updatedSubTask[i]?.completed}
                    onChange={(e) => handleCheck(e,i)}
                    disabled={completedCount >= Task.subTasks.length}
                    className="accent-green-500 scale-110"
                  />
                  <span>{subTask?.text}</span>
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

      <style>
        {`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255,255,255,0.2);
          border-radius: 4px;
        }
        `}
      </style>
    </div>
  );
}

export default Todo;
