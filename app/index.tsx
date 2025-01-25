import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CaloriesScreen from './screens/Calories/CaloriesScreen';  // Adjusted import path
import HomeScreen from './screens/Home/HomeScreen';  // Adjusted import path
import WorkoutScreen from './screens/Workout/WorkoutScreen';  // Adjusted import path

// Create a Bottom Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home">
        <Tab.Screen name="Calories" component={CaloriesScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Workout" component={WorkoutScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
