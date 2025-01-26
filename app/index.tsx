import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import CaloriesScreen from './screens/CaloriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import StartScreen from './screens/StartScreen';
import NewUserScreen from './screens/NewUserScreen';
import AiScreen from './screens/AiScreen';
import WorkoutLog from './screens/WorkoutLogScreen';
import { UserProvider } from './Contexts/Usercontext';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const homeIcon = require('../assets/images/home.png'); // Import the home.png image
const caloriesIcon = require('../assets/images/calories.png'); // Import the calories.png image
const workoutIcon = require('../assets/images/workout.png'); // Import the workout.png image

// Create the Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      tabBarShowLabel: false, // Hide the text labels
      tabBarStyle: { height: 80 }, // Increase the height of the tab bar
    }}
  >
    <Tab.Screen
      name="Workout"
      component={WorkoutScreen}
      options={{
        tabBarIcon: ({ size }) => (
          <Image
            source={workoutIcon}
            style={{ width: 110, height: 110, marginTop: 25, marginLeft: 10 }} // Make the icon bigger
          />
        ),
      }}
    />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ size }) => (
          <Image
            source={homeIcon}
            style={{ width: 120, height: 120, marginTop: 42 }} // Make the icon bigger
          />
        ),
      }}
    />
    <Tab.Screen
      name="Calories"
      component={CaloriesScreen}
      options={{
        tabBarIcon: ({ size }) => (
          <Image
            source={caloriesIcon}
            style={{ width: 72, height: 72, marginTop: 40}} // Make the icon bigger
          />
        ),
      }}
    />
  </Tab.Navigator>
);

// Create the main Stack Navigator
const App = () => {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Start"
            screenOptions={{
              headerShown: true,
              headerStyle: {
                backgroundColor: '#FFFFFF', // Customize header background
                height: 50, // Adjust header height for compact design
              },
              headerTitleStyle: {
                fontSize: 18,
                color: '#000000', // Customize header text color
              },
              headerStatusBarHeight: 0, // Adjust for devices with notches
            }}
          >
            {/* Start Screen */}
            <Stack.Screen
              name="Start"
              component={StartScreen}
              options={{ headerShown: false }}
            />

            {/* New User Screen */}
            <Stack.Screen
              name="NewUser"
              component={NewUserScreen}
              options={{ headerShown: false }}
            />

            {/* Main Tab Navigator */}
            <Stack.Screen
              name="Home"
              component={TabNavigator}
              options={{ headerShown: false }} // Disable header for MainTabs
            />

            {/* Settings Screen */}
            <Stack.Screen name="Settings" component={SettingsScreen} />

            {/* AI Screen */}
            <Stack.Screen name="Ai" component={AiScreen} />

            {/* Workout Log Screen */}
            <Stack.Screen name="WorkoutLog" component={WorkoutLog} />
            
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
