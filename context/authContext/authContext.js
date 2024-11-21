import React, { createContext, useState, useEffect } from 'react';
import { firebase_auth } from '../../firebase/firebase';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = createContext({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
  setUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const initializeUser = (user) => {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };

  const setUser = (userData) => {
    setCurrentUser(userData);
    setUserLoggedIn(true);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase_auth, initializeUser);
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userLoggedIn,
    loading,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};