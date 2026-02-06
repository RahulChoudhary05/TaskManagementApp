'use client';

import { useState } from 'react';
import { signUp, signIn, logOut } from '@/services/firebase';
import { authAPI } from '@/services/api';

/**
 * Custom hook for authentication operations
 * @returns {Object} - Auth methods and state
 */
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} displayName - User display name
   */
  const register = async (email, password, displayName = '') => {
    setLoading(true);
    setError(null);
    
    try {
      // First, create user in Firebase Auth (client-side)
      const firebaseResult = await signUp(email, password, displayName);
      
      if (!firebaseResult.success) {
        setError(firebaseResult.message);
        return firebaseResult;
      }
      
      // Then register user in backend (this creates the user record if needed)
      try {
        await authAPI.register(email, password, displayName);
      } catch (backendError) {
        // If backend registration fails but Firebase succeeded, that's okay
        // User can still authenticate via Firebase
        console.warn('Backend registration warning:', backendError.message);
      }
      
      return firebaseResult;
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await signIn(email, password);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await logOut();
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred during logout');
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
    register,
    login,
    logout,
    loading,
    error,
    clearError,
  };
};

export default useAuth;
