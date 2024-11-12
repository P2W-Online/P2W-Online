import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/main.js';
import Login from './components/login.js';
import Sign from './components/signin.js';
import Scoreboard from './components/scoreboard.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main" >
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} /> 
        <Stack.Screen name="Sign" component={Sign}  options={{ headerShown: false }} />
        <Stack.Screen name="Scoreboard" component={Scoreboard}  options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}