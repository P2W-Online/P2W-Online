import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Main from './components/main.js';
import Login from './components/login.js';
import Sign from './components/signin.js';
import Scoreboard from './components/scoreboard.js';
import CoinShop from './components/coinshop.js';
import BoxShop from './components/boxshop.js';
import Inventory from './components/inventory.js';
import { AuthProvider } from './context/authContext/authContext.js';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Sign" component={Sign} options={{ headerShown: false }} />
          <Stack.Screen name="Scoreboard" component={Scoreboard} options={{ headerShown: false }} />
          <Stack.Screen name="Coinshop" component={CoinShop} options={{ headerShown: false }} />
          <Stack.Screen name="Boxshop" component={BoxShop} options={{ headerShown: false }} />
          <Stack.Screen name="Inventory" component={Inventory} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}