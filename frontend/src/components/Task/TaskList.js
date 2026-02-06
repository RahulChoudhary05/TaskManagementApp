'use client';

import TaskCard from './TaskCard';

export default function TaskList({ 
  tasks, 
  onEdit, 
  onDelete, 
  onStatusChange,
  loading 
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border-2 border-purple-100 p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-xl w-3/4 mb-2"></div>
                <div className="h-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg w-24"></div>
              </div>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-purple-100 rounded-xl"></div>
                <div className="w-10 h-10 bg-red-100 rounded-xl"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg w-full"></div>
              <div className="h-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-purple-100 shadow-xl">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-110 transition-all duration-200">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
            />
          </svg>
        </div>
        <h3 className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2">
          No tasks found 📦
        </h3>
        <p className="text-gray-600 font-medium text-lg">
          Create your first task to get started ✨
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}
