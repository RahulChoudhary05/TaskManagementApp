'use client';

import { useState, useCallback, useRef } from 'react';
import { createTask, getUserTasks, updateTask, deleteTask } from '@/lib/firebase/db';

/**
 * Custom hook for task management operations using Firebase directly
 * @param {string} userId - Current user ID
 * @returns {Object} - Task methods and state
 */
export const useTasks = (userId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const lastFiltersRef = useRef({ status: 'all', sortBy: 'dueDate', sortOrder: 'asc' });

  /**
   * Fetch all tasks for the current user
   * @param {Object} filters - Optional filters (status, sortBy, sortOrder)
   */
  const fetchTasks = useCallback(async (filters = {}) => {
    if (!userId) return;
    
    const normalizedFilters = {
      status: filters.status || 'all',
      sortBy: filters.sortBy || 'dueDate',
      sortOrder: filters.sortOrder || 'asc',
    };
    lastFiltersRef.current = normalizedFilters;

    setLoading(true);
    setError(null);
    
    try {
      const result = await getUserTasks(userId, {
        status: normalizedFilters.status,
        sortBy: normalizedFilters.sortBy,
        sortOrder: normalizedFilters.sortOrder,
      });
      
      if (result.success) {
        setTasks(result.tasks);
      } else {
        setError(result.message);
        setTasks([]);
      }
      
      return { success: true, tasks: result.tasks };
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
      setTasks([]);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Add a new task
   * @param {Object} taskData - Task data (title, description, dueDate, status)
   */
  const addTask = async (taskData) => {
    if (!userId) {
      return { success: false, message: 'User not authenticated' };
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await createTask(taskData, userId);
      
      if (result.success) {
        // Refresh tasks using the current filters so the new task appears immediately
        await fetchTasks(lastFiltersRef.current);
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to create task');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Edit an existing task
   * @param {string} taskId - Task ID
   * @param {Object} updateData - Data to update
   */
  const editTask = async (taskId, updateData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateTask(taskId, updateData);
      
      if (result.success) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, ...updateData } : task
          )
        );
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update task');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Remove a task
   * @param {string} taskId - Task ID
   */
  const removeTask = async (taskId) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await deleteTask(taskId);
      
      if (result.success) {
        // Remove from local state
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to delete task');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Change task status
   * @param {string} taskId - Task ID
   * @param {string} status - New status
   */
  const changeTaskStatus = async (taskId, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateTask(taskId, { status });
      
      if (result.success) {
        // Update local state
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? { ...task, status } : task
          )
        );
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'Failed to update task status');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear any error messages
   */
  const clearError = () => {
    setError(null);
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    changeTaskStatus,
    clearError,
  };
};

export default useTasks;

