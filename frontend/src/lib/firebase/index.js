// Firebase Service Layer - Central export point
// This file acts as a barrel export for all Firebase modules

// Config
export { app, auth, db } from './config';

// Auth functions
export {
  signUp,
  signIn,
  logOut,
  getCurrentUser,
  onAuthChange,
} from './auth';

// Database functions
export {
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from './db';

// Helper functions
export {
  formatDate,
  isOverdue,
  getStatusColor,
  getStatusLabel,
  sortTasksByDueDate,
  filterTasksByStatus,
  validateTaskData,
  generateId,
  debounce,
} from './helpers';
