'use client';

// Firestore Database Operations for Tasks
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

// Collection name for tasks
const TASKS_COLLECTION = 'tasks';

/**
 * Create a new task
 * @param {Object} taskData - Task data object
 * @param {string} taskData.title - Task title
 * @param {string} taskData.description - Task description
 * @param {string} taskData.dueDate - Task due date (ISO string)
 * @param {string} taskData.status - Task status (todo, in-progress, done)
 * @param {string} userId - User ID who owns the task
 * @returns {Promise<Object>} - Created task with ID
 */
export const createTask = async (taskData, userId) => {
  try {
    const task = {
      ...taskData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, TASKS_COLLECTION), task);
    
    return {
      success: true,
      taskId: docRef.id,
      message: 'Task created successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to create task. Please try again.',
    };
  }
};

/**
 * Get all tasks for a specific user
 * @param {string} userId - User ID
 * @param {Object} filters - Optional filters
 * @param {string} filters.status - Filter by status
 * @param {string} filters.sortBy - Sort field (dueDate)
 * @param {string} filters.sortOrder - Sort order (asc, desc)
 * @returns {Promise<Object>} - Array of tasks
 */
export const getUserTasks = async (userId, filters = {}) => {
  try {
    // Fetch by userId only to avoid composite index requirements.
    // Filtering and sorting are applied client-side.
    const q = query(
      collection(db, TASKS_COLLECTION),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    
    const tasks = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tasks.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to JavaScript Date objects
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      });
    });
    
    return {
      success: true,
      tasks,
      count: tasks.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: error.message || 'Failed to fetch tasks. Please try again.',
      tasks: [],
    };
  }
};

/**
 * Get a single task by ID
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} - Task data
 */
export const getTaskById = async (taskId) => {
  try {
    const taskDoc = await getDoc(doc(db, TASKS_COLLECTION, taskId));
    
    if (!taskDoc.exists()) {
      return {
        success: false,
        message: 'Task not found.',
      };
    }
    
    const data = taskDoc.data();
    return {
      success: true,
      task: {
        id: taskDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to fetch task. Please try again.',
    };
  }
};

/**
 * Update an existing task
 * @param {string} taskId - Task ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Update result
 */
export const updateTask = async (taskId, updateData) => {
  try {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    
    await updateDoc(taskRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
    
    return {
      success: true,
      message: 'Task updated successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to update task. Please try again.',
    };
  }
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteTask = async (taskId) => {
  try {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
    
    return {
      success: true,
      message: 'Task deleted successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: error.message || 'Failed to delete task. Please try again.',
    };
  }
};

/**
 * Update task status
 * @param {string} taskId - Task ID
 * @param {string} status - New status (todo, in-progress, done)
 * @returns {Promise<Object>} - Update result
 */
export const updateTaskStatus = async (taskId, status) => {
  return updateTask(taskId, { status });
};
