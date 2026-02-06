// Common Helper Functions

/**
 * Format date to display string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return 'No date';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  
  return d.toLocaleDateString('en-US', options);
};

/**
 * Check if a date is overdue
 * @param {Date|string} dueDate - Due date
 * @returns {boolean} - True if overdue
 */
export const isOverdue = (dueDate) => {
  if (!dueDate) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  
  return due < today;
};

/**
 * Get status color class for UI
 * @param {string} status - Task status
 * @returns {string} - Tailwind CSS color class
 */
export const getStatusColor = (status) => {
  const colors = {
    'todo': 'bg-gray-100 text-gray-800 border-gray-300',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
    'done': 'bg-green-100 text-green-800 border-green-300',
  };
  
  return colors[status] || colors['todo'];
};

/**
 * Get status label for display
 * @param {string} status - Task status
 * @returns {string} - Human-readable status label
 */
export const getStatusLabel = (status) => {
  const labels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  };
  
  return labels[status] || status;
};

/**
 * Sort tasks by due date
 * @param {Array} tasks - Array of tasks
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} - Sorted tasks
 */
export const sortTasksByDueDate = (tasks, order = 'asc') => {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.dueDate || 0);
    const dateB = new Date(b.dueDate || 0);
    
    if (order === 'desc') {
      return dateB - dateA;
    }
    return dateA - dateB;
  });
};

/**
 * Filter tasks by status
 * @param {Array} tasks - Array of tasks
 * @param {string} status - Status to filter by
 * @returns {Array} - Filtered tasks
 */
export const filterTasksByStatus = (tasks, status) => {
  if (!status || status === 'all') {
    return tasks;
  }
  return tasks.filter(task => task.status === status);
};

/**
 * Validate task data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} - Validation result
 */
export const validateTaskData = (taskData) => {
  const errors = [];
  
  if (!taskData.title || taskData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  if (taskData.title && taskData.title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }
  
  if (taskData.description && taskData.description.length > 500) {
    errors.push('Description must be less than 500 characters');
  }
  
  if (!taskData.dueDate) {
    errors.push('Due date is required');
  }
  
  const validStatuses = ['todo', 'in-progress', 'done'];
  if (taskData.status && !validStatuses.includes(taskData.status)) {
    errors.push('Invalid status');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate unique ID (for client-side use)
 * @returns {string} - Unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function to limit how often a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
