import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Image, Dimensions } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import CaloriesScreen from './screens/CaloriesScreen';
import SettingsScreen from './screens/SettingsScreen';
import StartScreen from './screens/StartScreen';
import NewUserScreen from './screens/NewUserScreen';
import AiScreen from './screens/AiScreen';
import WorkoutLog from './screens/WorkoutLogScreen';
import CaloriesLog from './screens/CaloriesLogScreen';
import { UserProvider } from './Contexts/Usercontext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const homeIcon = require('../assets/images/home.png'); // Import the home.png image
const caloriesIcon = require('../assets/images/calories.png'); // Import the calories.png image
const workoutIcon = require('../assets/images/workout.png'); // Import the workout.png image

const { width: screenWidth } = Dimensions.get('window');
const iconSize = screenWidth * 0.1; // Adjust the icon size based on screen width

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
        tabBarIcon: () => (
          <Image
            source={workoutIcon}
            style={{ width: iconSize * 1.8, height: iconSize, marginTop: iconSize }} // Use responsive icon size
          />
        ),
      }}
    />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: () => (
          <Image
            source={homeIcon}
            style={{ width: iconSize, height: iconSize, marginTop: iconSize }} // Use responsive icon size
          />
        ),
      }}
    />
    <Tab.Screen
      name="Calories"
      component={CaloriesScreen}
      options={{
        tabBarIcon: () => (
          <Image
            source={caloriesIcon}
            style={{ width: iconSize, height: iconSize * 1.01, marginTop: iconSize }} // Use responsive icon size
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
            options={({navigation}) => ({
                headerShown: false,
                headerRight: () => (
                    <>
                    <Button
                      onPress={() => navigation.navigate('Settings')}
                      title="Settings"
                    />
                    <Button
                      onPress={() => navigation.navigate('Ai')}
                      title="AI"
                    />
                  </>
                ),
            })}
                
                // Disable header for MainTabs
          />

            {/* Settings Screen */}
            <Stack.Screen name="Settings" component={SettingsScreen} />

            {/* AI Screen */}
            <Stack.Screen name="AI" component={AiScreen} />

            {/* Workout Log Screen */}
            <Stack.Screen name="WorkoutLog" component={WorkoutLog} />

            {/* Calories Log Screen */}
            <Stack.Screen name="CaloriesLog" component={CaloriesLog} />
            
  
        </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
};

export default App;
