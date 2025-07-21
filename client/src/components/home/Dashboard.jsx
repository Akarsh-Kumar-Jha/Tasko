import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios/axiosInstance';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userDetails, setUserDetails] = useState({});
  const [statusChartData, setStatusChartData] = useState([]);
  const [priorityData, setPriorityData] = useState([]);
  const [recentTasks,setRecentTasks] = useState([]);

  const navigate = useNavigate();

  const [apiCalled,setApiCalled] = useState(false);

  const COLORS = ['#14b8a6', '#22c55e', '#facc15', '#ef4444'];

  const fetchData = async () => {
    setApiCalled(true);
    const response = await axiosInstance.get('/getRecentTasks');
    console.log("recent Tasks Response In Dashboard:- ",response.data.recentTasks.tasks);
    const user = response.data.recentTasks;
    setApiCalled(false);
    setUserDetails(user);
    setRecentTasks(response.data.recentTasks.tasks)

    // Status Data
    const taskStatusCounts = {};
    user?.tasks?.forEach((task) => {
      taskStatusCounts[task.status] = (taskStatusCounts[task.status] || 0) + 1;
    });

    const formattedStatusData = Object.entries(taskStatusCounts).map(
      ([status, value]) => ({ name: status, value })
    );

    // Priority Data
    const priorityCount = {};
    user.tasks.forEach(task => {
      priorityCount[task.priority] = (priorityCount[task.priority] || 0) + 1;
    });

    const formattedPriorityData = Object.entries(priorityCount).map(
      ([priority, value]) => ({ name: priority, value })
    );

    setStatusChartData(formattedStatusData);
    setPriorityData(formattedPriorityData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-[100%] h-[100%] p-6 relative overflow-y-auto">
       {apiCalled && (
        <div className="absolute inset-0 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="w-12 h-12 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}
<div className="bg-[#111827] w-[100%] rounded-xl p-5 shadow-md space-y-2 border border-[#2c5364]">
  <h1 className="text-white text-2xl font-semibold">Hi, {userDetails.name} 👋</h1>
  <p className="text-sm text-gray-400">Welcome back! Here's your task summary:</p>

  <div className="mt-4 space-y-1">
    <p className="text-base text-gray-200">
      📌 <span className="font-semibold">{userDetails?.tasks?.length}</span> Total Tasks
    </p>

    {statusChartData?.map((chart, index) => (
      <p key={index} className="text-base text-gray-300">
        ✅ <span className="font-semibold">{chart?.value}</span> {chart?.name} Tasks
      </p>
    ))}
  </div>
</div>


      {/* Chart Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Task Status Chart */}
        <div className="bg-[#111827] border border-[#2c5364] rounded-2xl shadow-xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
            📊 Task Status
          </h2>
          {statusChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`status-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "#fff"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                {statusChartData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name}: <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No tasks available.</p>
          )}
        </div>

        {/* Task Priority Chart */}
        <div className="bg-[#111827] border border-[#2c5364] rounded-2xl shadow-xl p-6">
          <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-2">
            🚦 Task Priority
          </h2>
          {priorityData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`priority-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "none",
                      color: "#fff"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                {priorityData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></span>
                    {entry.name}: <span className="font-medium">{entry.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm">No priority data available.</p>
          )}
        </div>
      </div>

{/* Recent Tasks Section */}
<div className="mt-10">
  <h2 className="text-white text-2xl font-semibold mb-4"> Your Recent Tasks</h2>

  {recentTasks.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {recentTasks.map((task, index) => (
        <div
          key={task._id || index}
          onClick={() => navigate(`manageTask/${task._id}`)}
          className="bg-[#111827] border border-[#2c5364] rounded-xl p-5 cursor-pointer shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-white text-lg font-bold truncate max-w-[80%]">
              {task.title}
            </h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium
                ${task.priority === 'High'
                  ? 'bg-red-600/20 text-red-300'
                  : task.priority === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-200'
                  : 'bg-green-600/20 text-green-300'}`}
            >
              {task.priority}
            </span>
          </div>

          <p className="text-white/70 text-sm line-clamp-3 mb-4">
            {task.description || "No description provided."}
          </p>

          <div className="flex justify-between items-center text-sm text-white/60">
            <span
              className={`px-3 py-1 rounded-full text-xs
                ${task.status === 'Completed'
                  ? 'bg-green-600/20 text-green-400'
                  : task.status === 'Pending'
                  ? 'bg-yellow-400/20 text-yellow-300'
                  : 'bg-blue-400/20 text-blue-300'}`}
            >
              {task.status}
            </span>
            <span>
              {new Date(task.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-white/60 text-sm mt-4">You have no recent tasks yet.</p>
  )}
</div>

    </div>
  );
}

export default Dashboard;
