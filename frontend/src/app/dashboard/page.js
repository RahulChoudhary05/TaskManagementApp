'use client';

import { useState, useEffect } from 'react';
import { useAuth as useAuthContext } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import TaskList from '@/components/Task/TaskList';
import TaskForm from '@/components/Task/TaskForm';
import TaskFilters from '@/components/Task/TaskFilters';
import Modal from '@/components/UI/Modal';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuthContext();
  const { 
    tasks, 
    loading, 
    error, 
    fetchTasks, 
    addTask, 
    editTask, 
    removeTask, 
    changeTaskStatus 
  } = useTasks(user?.uid);

  const [filters, setFilters] = useState({
    status: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    if (user?.uid) {
      fetchTasks(filters);
    }
  }, [user?.uid, filters]);

  // Handle create/edit task
  const handleSubmit = async (formData) => {
    setFormLoading(true);
    
    let result;
    if (editingTask) {
      result = await editTask(editingTask.id, formData);
    } else {
      result = await addTask(formData);
    }

    if (result.success) {
      setIsModalOpen(false);
      setEditingTask(null);
    }
    
    setFormLoading(false);
  };

  // Handle edit button click
  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (taskId) => {
    await removeTask(taskId);
  };

  // Handle status change
  const handleStatusChange = async (taskId, status) => {
    await changeTaskStatus(taskId, status);
  };

  // Open modal for new task
  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Apply client-side filtering and sorting
  const filteredTasks = tasks.filter(task => {
    if (filters.status === 'all') return true;
    return task.status === filters.status;
  });

  const getTaskTime = (task, field) => {
    const value = task?.[field];
    if (!value) return 0;
    if (value instanceof Date) return value.getTime();
    if (typeof value === 'string') return new Date(value).getTime();
    if (typeof value?.toDate === 'function') return value.toDate().getTime();
    return 0;
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const field = filters.sortBy === 'createdAt' ? 'createdAt' : 'dueDate';
    const aTime = getTaskTime(a, field);
    const bTime = getTaskTime(b, field);
    if (aTime === bTime) return 0;
    return filters.sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
  });

  // Calculate task stats
  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
            My Tasks
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            Manage and track your tasks efficiently 🎯
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl border border-purple-100 p-6 transform hover:scale-105 transition-all duration-200">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Tasks</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text mt-2">{stats.total}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg hover:shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">To Do</p>
            <p className="text-4xl font-extrabold mt-2">{stats.todo}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">In Progress</p>
            <p className="text-4xl font-extrabold mt-2">{stats.inProgress}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl shadow-lg hover:shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <p className="text-sm font-semibold uppercase tracking-wide opacity-90">Done</p>
            <p className="text-4xl font-extrabold mt-2">{stats.done}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <button
            onClick={openNewTaskModal}
            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add New Task
          </button>

          <button
            onClick={() => fetchTasks(filters)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-gray-700 bg-white/90 backdrop-blur-xl border-2 border-purple-200 rounded-xl hover:bg-white hover:border-purple-300 disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 font-semibold"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-start gap-3 shadow-lg">
            <svg className="w-6 h-6 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <TaskFilters 
            filters={filters} 
            onFilterChange={setFilters}
            taskCount={sortedTasks.length}
          />
        </div>

        {/* Task List */}
        <TaskList
          tasks={sortedTasks}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          loading={loading}
        />
      {/* Add/Edit Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          loading={formLoading}
        />
      </Modal>
      </div>
    </div>
  );
}
