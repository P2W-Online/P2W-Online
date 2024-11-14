import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/main.js';
import Login from './components/login.js';
import Sign from './components/signin.js';
import Scoreboard from './components/scoreboard.js';
import { firebase_auth } from './firebase/firebase.js';
import { onAuthStateChanged } from "firebase/auth"
import { AuthContext } from './context/authContext';

const Stack = createStackNavigator();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /* const unsubscribe = onAuthStateChanged(firebase_auth, (user) => {
      setCurrentUser(user)
      console.log(user.email)
    }) */
      const unsubscribe = onAuthStateChanged(firebase_auth,initializeUser)

    return () => unsubscribe();

  }, [])

  const initializeUser = async (user) => {
    if (user) {
      setCurrentUser({ ...user })
      setUserLoggedIn(true)
    } else {
      setCurrentUser(null)
      setUserLoggedIn(false)
    }
    setLoading(false)
  }

  const value = {
    currentUser,
    userLoggedIn,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main" >
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Sign" component={Sign} options={{ headerShown: false }} />
          <Stack.Screen name="Scoreboard" component={Scoreboard} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}