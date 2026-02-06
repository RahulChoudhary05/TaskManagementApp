// Firebase Authentication Helper Functions
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} displayName - User's display name (optional)
 * @returns {Promise<Object>} - User credential object
 */
export const signUp = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
    }
    
    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Sign in existing user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User credential object
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Sign out the current user
 * @returns {Promise<Object>} - Sign out result
 */
export const logOut = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Signed out successfully!',
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getAuthErrorMessage(error.code),
    };
  }
};

/**
 * Get current authenticated user
 * @returns {Object|null} - Current user or null
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Listen to authentication state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Function} - Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

/**
 * Convert Firebase auth error codes to user-friendly messages
 * @param {string} errorCode - Firebase error code
 * @returns {string} - User-friendly error message
 */
const getAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Please use a different email or sign in.',
    'auth/invalid-email': 'Invalid email address. Please check your email.',
    'auth/weak-password': 'Password is too weak. Please use at least 6 characters.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check your credentials.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
