import React, { useState } from 'react';
import { toast } from 'sonner';
import axiosInstance from '../../axios/axiosInstance';

function CreateTask() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tags, setTags] = useState([]);
  const [type, seType] = useState('Task');
  const [apiCalled, setApiCalled] = useState(false);

  const addTask = async () => {
    if (!title.trim() || !desc.trim()) {
      toast.error('Title and description cannot be empty.');
      return;
    }

    try {
      setApiCalled(true);
    const response = await axiosInstance.post('/add', {
        title,
        description: desc,
        priority,
        tags,
        type,
      });
console.log("response In Task Creation:- ",response);
      toast.success('Task created successfully!');
      setTitle('');
      setDesc('');
      setPriority('Medium');
      setTags([]);
      seType('Task');
    } catch (error) {
      toast.error('Failed to create task.');
    } finally {
      setApiCalled(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addTask();
  };

  return (
    <div className="relative h-[100%] w-[100%] bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex flex-col items-center justify-start px-6 py-10 overflow-y-auto">
      {apiCalled && (
        <div className="absolute w-[100%] h-[100%] inset-0 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="w-12 h-12 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-xl w-full bg-[#111827] border border-[#2c5364] rounded-2xl shadow-xl p-6 mt-20">
        <h1 className="text-2xl font-semibold text-white mb-2">📝 Create a New Task</h1>
        <p className="text-sm text-gray-400 mb-6">
          Just add a title, description, tags, type, and priority. We’ll take care of the subtasks automatically.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm text-gray-300 mb-1">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              className="w-full rounded-md bg-[#1e293b] text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="desc" className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-[#1e293b] text-white border border-gray-600 px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm text-gray-300 mb-1">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full rounded-md bg-[#1e293b] text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm text-gray-300 mb-1">Tags (comma separated)</label>
            <input
              id="tags"
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
              type="text"
              className="w-full rounded-md bg-[#1e293b] text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm text-gray-300 mb-1">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => seType(e.target.value)}
              className="w-full rounded-md bg-[#1e293b] text-white border border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Task">Task</option>
              <option value="Meeting">Meeting</option>
              <option value="Reminder">Reminder</option>
              <option value="Study">Study</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={apiCalled}
            className={`w-full py-2 px-4 ${
              apiCalled ? 'bg-gray-600 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
            } text-white font-medium rounded-md transition duration-200`}
          >
            {apiCalled ? 'Creating...' : 'Create Task'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateTask;
