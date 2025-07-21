import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card"
import { useNavigate } from 'react-router-dom'
import {
  FolderIcon,
  BellIcon,
  CalendarIcon,
  ListTodoIcon,
} from 'lucide-react'

const accentClasses = [
  "bg-blue-900",
  "bg-fuchsia-800",
  "bg-purple-900",
  "bg-cyan-900",
  "bg-lime-800",
  "bg-yellow-700",
  "bg-rose-900",
  "bg-emerald-900",
  "bg-indigo-900",
  "bg-orange-900",
  "bg-slate-900",
  "bg-pink-900",
];

function TodoList({ todos }) {
  const navigate = useNavigate();

  const handleClick = (todoId) => {
    navigate(`/todo/${todoId}`);
  };

  return (
    <div className="grid mt-[5vh] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 sm:px-6 md:px-12 py-20 max-w-7xl mx-auto w-full">
      {todos?.map((todo, i) => {
        const accent = accentClasses[i % accentClasses.length];

        // Dummy fallbacks
        const tags = todo.tags || ["Work", "Urgent"];
        const createdAt = todo.createdAt || new Date().toISOString();
        const priority = todo.priority || ["High", "Medium", "Low"][i % 3];
        const subTasks = todo.subTasks || [ {}, {}, {} ];
        const completedSubTasks = todo.completedSubTasks ?? Math.floor(Math.random() * (subTasks.length + 1));
        const type = todo.type || ["Task", "Meeting", "Reminder"][i % 3];

        const renderTypeIcon = () => {
          switch (type) {
            case "Meeting": return <CalendarIcon className="w-5 h-5 text-white/70" />;
            case "Reminder": return <BellIcon className="w-5 h-5 text-white/70" />;
            default: return <ListTodoIcon className="w-5 h-5 text-white/70" />;
          }
        };

        return (
          <Card
            key={todo._id}
            onClick={() => handleClick(todo._id)}
            onKeyDown={(e) => e.key === 'Enter' && handleClick(todo._id)}
            role="button"
            tabIndex={0}
            className={`group ${accent} cursor-pointer hover:scale-[1.03] active:scale-[.98] focus:ring-2 focus:ring-pink-300
              hover:brightness-110 hover:shadow-[0_10px_40px_rgba(255,255,255,0.15)]
              transition-all duration-300 ease-in-out shadow-xl border border-white/10
              rounded-2xl w-full max-w-[420px] mx-auto
            `}
          >
            <CardHeader className="flex items-center flex-row gap-3 pt-6 pb-0 px-6">
              {/* Type Icon */}
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md shadow-inner">
                {renderTypeIcon()}
              </div>
              <CardTitle className="text-white text-xl font-bold tracking-tight truncate max-w-[200px]">
                {todo.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pt-4 pb-6 space-y-3">
              {/* Description */}
              <p className="text-white/90 text-base leading-relaxed break-words line-clamp-4">
                {todo.description.length > 100
                  ? todo.description.slice(0, 100) + "..."
                  : todo.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="text-xs bg-white/10 text-white px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Subtask Progress */}
              {subTasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  <span className="text-xs text-white/70">
                    {completedSubTasks}/{subTasks.length} completed
                  </span>
                  <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-yellow-300 h-full transition-all"
                      style={{ width: `${(completedSubTasks / subTasks.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Created Date & Priority */}
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-white/60">
                  Created on {new Date(createdAt).toLocaleDateString()}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full inline-block
                  ${priority === 'High' ? 'bg-red-500/30 text-red-200' :
                    priority === 'Medium' ? 'bg-yellow-500/30 text-yellow-200' :
                      'bg-green-500/30 text-green-200'}
                `}>
                  {priority} Priority
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}

export default TodoList
