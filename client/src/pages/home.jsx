import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  LogOut,
} from "lucide-react"
import Dashboard from '../components/home/Dashboard';
import ManageTasks from '../components/home/ManageTasks';
import CreateTask from '../components/home/CreateTask';
import Logout from '../components/home/Logout';
import axiosInstance from '../axios/axiosInstance';

function Home() {
  const [component, setComponent] = useState("Dashboard");
  const [userDetails, setUserDetails] = useState({});

  const getUser = async () => {
    const response = await axiosInstance.get('/user/get-user');
    setUserDetails(response?.data?.user);
  }

  useEffect(() => {
    getUser();
  }, []);

  const navigate = useNavigate();

  return (
    <div
      className='min-h-screen w-full flex flex-col'
      style={{
        background: "linear-gradient(120deg, #0f2027, #203a43, #2c5364)"
      }}
    >

      {/* NavBar */}
      <div className="h-[100px] w-full px-4 flex justify-between items-center border-b">
        <div>
          <h1 className="text-3xl sm:text-[2vw] font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text drop-shadow-md">
            Tasko
          </h1>
          <p className="text-sm mt-1 text-white/60">Manage your tasks with elegance ✨</p>
        </div>
        <div
          onClick={() => navigate('/canvas')}
          className="animate-bounce transition-all duration-300"
        >
          <button className="px-4 sm:px-6 py-2 text-sm sm:text-base cursor-pointer backdrop-blur-md bg-white/10 text-white border border-white/30 rounded-full shadow-md hover:bg-white/20 transition duration-300 font-semibold tracking-wide">
            Try Collaborative Whiteboard
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className='flex flex-col sm:flex-row w-full flex-1'>

        {/* Sidebar */}
        <div className="w-full sm:w-[22%] py-6 sm:py-10 px-4 sm:px-0 border-b sm:border-b-0 sm:border-r border-[#2c5364] bg-[#0f1e2b]/60 shadow-inner">
          {/* Profile Section */}
          <div className="w-full pb-6 sm:pb-10 flex flex-col items-center gap-y-2 border-b border-[#2c5364]">
            <img
              className="w-20 h-20 object-cover rounded-full border-4 border-rose-700 shadow-md"
              src={userDetails.image}
              alt="User"
            />
            <p className="text-white font-semibold text-lg mt-2 text-center">{userDetails.name}</p>
            <p className="text-sm text-white/60 text-center">{userDetails.email}</p>
          </div>

          {/* Navigation Options */}
          <div className="mt-6 sm:mt-10 w-full flex flex-col gap-y-2">
            {[
              { label: "Dashboard", icon: LayoutDashboard, Component: "Dashboard" },
              { label: "Manage Tasks", icon: ListChecks, Component: "Tasks" },
              { label: "Create Task", icon: PlusCircle, Component: "AddTask" },
              { label: "Logout", icon: LogOut, Component: "Logout" },
            ].map(({ label, icon: Icon, Component }, index) => (
              <div
                key={index}
                onClick={() => setComponent(Component)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-lg cursor-pointer transition-all duration-200 
                ${component === Component
                    ? 'bg-cyan-700 text-white shadow-md'
                    : 'hover:bg-white/10 text-white/80 hover:text-white'}`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm sm:text-base">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Component Area */}
        <div className='w-full sm:w-[78%] px-4 sm:px-6 py-4 sm:py-8'>
          {component === "Dashboard" && <Dashboard />}
          {component === "Tasks" && <ManageTasks />}
          {component === "AddTask" && <CreateTask />}
          {component === "Logout" && <Logout />}
        </div>
      </div>
    </div>
  )
}

export default Home;
