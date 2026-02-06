'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create the authentication context
const AuthContext = createContext({});

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const firebaseLoadedRef = useRef(false);

  useEffect(() => {
    // Dynamically import Firebase only on the client side
    const setupAuth = async () => {
      try {
        const { onAuthChange } = await import('@/services/firebase');
        
        // Subscribe to auth state changes
        const unsubscribe = onAuthChange((firebaseUser) => {
          if (firebaseUser) {
            // User is signed in
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              emailVerified: firebaseUser.emailVerified,
            });
          } else {
            // User is signed out
            setUser(null);
          }
          setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } catch (error) {
        console.error('Failed to load Firebase:', error);
        setLoading(false);
      }
    };

    if (!firebaseLoadedRef.current) {
      firebaseLoadedRef.current = true;
      let unsubscribe;
      setupAuth().then(unsub => {
        unsubscribe = unsub;
      });

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
