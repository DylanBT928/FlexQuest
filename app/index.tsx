import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home/HomeScreen';
import WorkoutScreen from './screens/Workout/WorkoutScreen';
import CaloriesScreen from './screens/Calories/CaloriesScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import StartScreen from './screens/Start/StartScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create the Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator initialRouteName="Home">
    <Tab.Screen name="Workout" component={WorkoutScreen} />
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Calories" component={CaloriesScreen} />
  </Tab.Navigator>
);

// Create the main Stack Navigator that includes the Settings screen
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }} 
        initialRouteName="Start" // Ensure this points to StartScreen
      >
        {/* StartScreen as the initial screen */}
        <Stack.Screen name="Start" component={StartScreen} />

        {/* Main Tab Navigator */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />

        {/* Settings Screen */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
