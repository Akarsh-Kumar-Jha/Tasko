import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios/axiosInstance'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { useNavigate } from 'react-router-dom'
import {
  BellIcon,
  CalendarIcon,
  ListTodoIcon,
} from 'lucide-react'

function ManageTasks() {
  const [allTasks, setAllTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [allTags, setAllTags] = useState([])
  const [apiCalled, setApiCalled] = useState(false)

  const accentClasses = [
    "bg-blue-900", "bg-fuchsia-800", "bg-purple-900", "bg-cyan-900",
    "bg-lime-800", "bg-yellow-700", "bg-rose-900", "bg-emerald-900",
    "bg-indigo-900", "bg-orange-900", "bg-slate-900", "bg-pink-900",
  ]

  const fetchTasks = async () => {
    setApiCalled(true)
    try {
      const res = await axiosInstance.get('/')
      const tasks = res.data?.tasks || []
      setAllTasks(tasks)
      setFilteredTasks(tasks)

      // Unique tag list
      const uniqueTags = [...new Set(tasks.flatMap(t => t.tags || []))]
      setAllTags(uniqueTags)
    } catch (err) {
      console.error("Failed to fetch tasks:", err)
    } finally {
      setApiCalled(false)
    }
  }

  const toggleTag = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]

    setSelectedTags(newSelectedTags)

    if (newSelectedTags.length === 0) {
      setFilteredTasks(allTasks)
    } else {
      const filtered = allTasks.filter(task =>
        task.tags?.some(t => newSelectedTags.includes(t))
      )
      setFilteredTasks(filtered)
    }
  }

  const resetFilters = () => {
    setSelectedTags([])
    setFilteredTasks(allTasks)
  }

  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="h-[calc(100vh-100px)] w-full overflow-y-auto px-4 py-6 relative">
      {apiCalled && (
        <div className="absolute inset-0 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
          <div className="w-12 h-12 border-4 border-teal-400 border-dashed rounded-full animate-spin"></div>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-3 mb-6 justify-start items-center">
        {allTags.map((tag, index) => (
          <button
            key={index}
            onClick={() => toggleTag(tag)}
            className={`px-4 py-2 rounded-full font-medium text-sm tracking-wide
              ${selectedTags.includes(tag)
                ? "bg-pink-700/70 text-white"
                : "bg-gradient-to-br from-blue-800 via-indigo-800 to-purple-800 text-white/90"}
              shadow-md hover:shadow-lg transition-all duration-300
              backdrop-blur-lg border border-white/10`}
          >
            #{tag}
          </button>
        ))}

        {selectedTags.length > 0 && (
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-full font-medium text-sm tracking-wide
              bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300
              border border-white/20 backdrop-blur-md shadow"
          >
            🔄 Reset Filters
          </button>
        )}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-white/70 text-sm text-center mt-10">
          No tasks match the selected filters.
        </p>
      )}

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((todo, i) => {
          const accent = accentClasses[i % accentClasses.length]
          const tags = todo.tags || []
          const createdAt = todo.createdAt || new Date().toISOString()
          const priority = todo.priority || "Medium"
          const subTasks = todo.subTasks || []
          const completedSubTasks = todo.completedSubTasks ?? 0
          const type = todo.type || "Task"

          const renderTypeIcon = () => {
            switch (type) {
              case "Meeting": return <CalendarIcon className="w-5 h-5 text-white/70" />
              case "Reminder": return <BellIcon className="w-5 h-5 text-white/70" />
              default: return <ListTodoIcon className="w-5 h-5 text-white/70" />
            }
          }

          return (
            <Card
              key={todo._id}
              onClick={() => navigate(`manageTask/${todo._id}`)}
              role="button"
              tabIndex={0}
              className={`group ${accent} cursor-pointer hover:scale-[1.03] active:scale-[.98]
                transition-all duration-300 ease-in-out shadow-lg border border-white/10
                rounded-2xl w-full`}
            >
              <CardHeader className="flex items-center flex-row gap-3 pt-6 pb-0 px-6">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md">
                  {renderTypeIcon()}
                </div>
                <CardTitle className="text-white text-lg font-bold tracking-tight truncate max-w-[200px]">
                  {todo.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 pt-4 pb-6 space-y-3">
                <p className="text-white/90 text-sm leading-relaxed break-words line-clamp-4">
                  {todo.description.length > 100
                    ? todo.description.slice(0, 100) + "..."
                    : todo.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Subtask Progress */}
                {subTasks.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-white/70">
                      {completedSubTasks}/{subTasks.length} subtasks completed
                    </span>
                    <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                      <div
                        className="bg-yellow-400 h-full transition-all"
                        style={{ width: `${(completedSubTasks / subTasks.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Date & Priority */}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-white/60">
                    Created {new Date(createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full
                    ${priority === 'High' ? 'bg-red-500/20 text-red-300' :
                      priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-200' :
                        'bg-green-500/20 text-green-200'}`}>
                    {priority}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default ManageTasks
