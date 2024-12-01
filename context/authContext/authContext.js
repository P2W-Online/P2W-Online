import React, { createContext, useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDoc, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { firebase_auth, firebase_db } from '../../firebase/firebase';
import { getUserData } from '../../firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';

export const AuthContext = createContext({
  currentUser: null,
  userLoggedIn: false,
  loading: true,
  setUser: () => {},
  userData: null,
  setUserData: () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null)

  const initializeUser = async (user) => {
    if (user) {
      setCurrentUser({ ...user });
      setUserLoggedIn(true);
      const uData = await getUserData(user.uid)
      setUserData({...uData})
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
    }
    setLoading(false);
  };

  const setUser = (user) => {
    setCurrentUser(user);
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
    userData,
    setUser,
    setUserData,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};