import { ThemeToggle } from "../components/ThemeToggle"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel
  } from "../components/ui/dropdown-menu"

import TodoList from "../TodoList"
import {useState,useEffect} from 'react'
import axios from 'axios'
import { Toaster } from "sonner";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom"

axios.defaults.withCredentials = true;



function App() {

  const [title,setTitle] = useState('');
  const [description,setDescription] = useState('');
  const [todos,setTodos] = useState([]);
  const [Image,setImage] = useState('');
  const [UserName,setUserName] = useState('User');

  const navigate = useNavigate();

  const BASE_URL = 'https://tasko-backendnew.onrender.com/';

  const handleAdd = async() => {
try{
const res = await axios.post(`${BASE_URL}/add`,{
  title,
  description
});
console.log(res.data);
toast.success("🎉 Task Added Successfully!");
setTitle('');
setDescription('');
await getTasks();
}catch(error){
  console.error(error);
  toast.error(error.response?.data?.message || "❌ Something went wrong!");
}
  }

  const getTasks = async () => {
    try {
      const Tasks = await axios.get(`${BASE_URL}/`);
      console.log("Tasks: ",Tasks);
      setTodos(Tasks.data.tasks);
      setUserName(Tasks.data.Name)
      setImage(Tasks.data.Image);
    } catch (error) {
      console.log("Error While Fetching Tasks!");
      console.log(error);
      toast.error(error.response?.data?.message || "❌ Unable to fetch tasks.");
    }
  }


  const removeTask = async (id) => {
    try {
      const removedTask = await axios.delete(`${BASE_URL}/remove/${id}`);
      toast.success("🗑️ Task Removed Successfully!");
      console.log("Removed Task: ",removedTask);
      await getTasks();
    } catch (error) {
      console.log("Error Ocurred While Removing Task!");
      console.log(error);
      toast.error(error.response?.data?.message || "❌ Failed to remove task.");
    }
  }

  useEffect(() => {
    getTasks();
  },[]);
  

  return (
    <div className="min-h-screen flex flex-col bg-background p-4 text-foreground transition-colors">
 <h1 className="text-5xl text-center font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
  Tasko
</h1>

<Toaster richColors position="top-center" />

<p className="text-sm text-muted-foreground mt-2 text-center">
    Manage your tasks with elegance ✨
  </p>
      <div className="absolute top-4 right-4 flex items-center gap-8">
      <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center justify-center cursor-pointer">
          <Avatar className="w-8 h-8 shadow-md ring-2 ring-gray-200">
            <AvatarImage src={Image} alt="Profile" />
          </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 mt-2">
      <DropdownMenuLabel className="text-sm font-semibold text-muted-foreground">
  Kya haal hai, {UserName}? 😎
</DropdownMenuLabel>

        <DropdownMenuItem onClick={() => navigate('/signup')}>
          Create New Account
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

        <ThemeToggle />
      </div>

      <div className="w-full max-w-md mx-auto mt-12 bg-card p-6 rounded-xl shadow-lg space-y-4">
  <div className="space-y-2">
    <Input
      type="text"
      placeholder="Task Heading likh — jaise 'DSA Revision' 🔥"
      className="text-md"
      value={title}
      onChange={(event) => {setTitle(event.target.value)}}
    />
    <Input
      type="text"
      placeholder="Plan bata — eg: '3 Leetcode + Notes 📒'"
      className="text-md"
      value={description}
      onChange={(event) => {setDescription(event.target.value)}}
    />
  </div>
  <Button type="submit" onClick={handleAdd} className="w-full">
    Add Task
  </Button>
</div>


    <TodoList todos={todos} removeTask={removeTask}/>
    </div>
  )
}

export default App
