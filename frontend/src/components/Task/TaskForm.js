'use client';

import { useState, useEffect } from 'react';
import { validateTaskData } from '@/services/firebase';

export default function TaskForm({ task, onSubmit, onCancel, loading }) {
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'todo',
  });
  const [errors, setErrors] = useState([]);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        status: task.status || 'todo',
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validation = validateTaskData(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div>
        <label 
          htmlFor="title" 
          className="block text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2"
        >
          Task Title <span className="text-red-500">★</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 font-medium shadow-sm"
          maxLength={100}
          required
          disabled={loading}
        />
        <p className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mt-1.5">
          {formData.title.length}/100 characters
        </p>
      </div>

      {/* Description */}
      <div>
        <label 
          htmlFor="description" 
          className="block text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 font-medium resize-none shadow-sm"
          rows={3}
          maxLength={500}
          disabled={loading}
        />
        <p className="text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mt-1.5">
          {formData.description.length}/500 characters
        </p>
      </div>

      {/* Due Date */}
      <div>
        <label 
          htmlFor="dueDate" 
          className="block text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2"
        >
          Due Date <span className="text-red-500">★</span>
        </label>
        <input
          id="dueDate"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 font-medium shadow-sm"
          required
          disabled={loading}
        />
      </div>

      {/* Status */}
      <div>
        <label 
          htmlFor="status" 
          className="block text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mb-2"
        >
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-200 font-semibold shadow-sm cursor-pointer"
          disabled={loading}
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {/* Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border-2 border-red-300 text-red-700 px-5 py-4 rounded-xl shadow-lg">
          <ul className="list-none text-sm font-medium space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-red-500">⚠️</span>
                <span>{error}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-6 py-3.5 border-2 border-purple-200 text-purple-600 font-bold rounded-xl hover:bg-purple-50 hover:border-purple-300 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 transition-all duration-200 shadow-sm transform hover:scale-[1.02]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-200 disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>
              {isEditing ? '✏️ Update Task' : '✨ Create Task'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
