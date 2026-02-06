'use client';

// Firebase Service Layer - Re-exports from lib
// This file acts as a central export point for all Firebase operations

export {
  // Config
  app,
  auth,
  db,
  
  // Auth
  signUp,
  signIn,
  logOut,
  getCurrentUser,
  onAuthChange,
  
  // Database
  createTask,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  
  // Helpers
  formatDate,
  isOverdue,
  getStatusColor,
  getStatusLabel,
  sortTasksByDueDate,
  filterTasksByStatus,
  validateTaskData,
  generateId,
  debounce,
} from '@/lib/firebase';
