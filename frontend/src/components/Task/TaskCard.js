'use client';

import { useState } from 'react';
import { formatDate, isOverdue, getStatusColor, getStatusLabel } from '@/services/firebase';

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const overdue = isOverdue(task.dueDate);
  const statusColor = getStatusColor(task.status);

  const handleStatusChange = (e) => {
    onStatusChange(task.id, e.target.value);
  };

  return (
    <div className={`task-card bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border-2 ${overdue && task.status !== 'done' ? 'border-l-8 border-l-gradient-to-b from-red-500 to-pink-600 border-purple-100' : 'border-purple-100'} overflow-hidden transition-all duration-200 transform hover:scale-[1.02]`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {task.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${task.status === 'done' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' : task.status === 'in-progress' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'}`}>
                {getStatusLabel(task.status)}
              </span>
              {overdue && task.status !== 'done' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-sm">
                  ⚠️ Overdue
                </span>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(task)}
              className="p-2.5 text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm"
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task)}
              className="p-2.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm"
              title="Delete task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mt-4">
            <p className={`text-gray-600 text-sm leading-relaxed ${!isExpanded ? 'line-clamp-2' : ''}`}>
              {task.description}
            </p>
            {task.description.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-600 text-sm mt-2 hover:text-purple-700 font-semibold hover:underline"
              >
                {isExpanded ? '↑ Show less' : '↓ Show more'}
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={overdue && task.status !== 'done' ? 'text-red-600 font-medium' : ''}>
              Due: {formatDate(task.dueDate)}
            </span>
          </div>

          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="text-sm font-semibold border-2 border-purple-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>
    </div>
  );
}
