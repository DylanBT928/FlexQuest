import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/Home/HomeScreen';  // Correct import path
import WorkoutScreen from './screens/Workout/WorkoutScreen';  // Correct import path
import CaloriesScreen from './screens/Calories/CaloriesScreen';  // Correct import path
import SettingsScreen from './screens/Settings/SettingsScreen';  // Correct import path

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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Main Tab Navigator as the first screen */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        
        {/* Settings screen as a separate screen in the Stack */}
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
