import React from 'react';
import { Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import HomeScreen from './screens/Home/HomeScreen';
import WorkoutScreen from './screens/Workout/WorkoutScreen';
import CaloriesScreen from './screens/Calories/CaloriesScreen';
import SettingsScreen from './screens/Settings/SettingsScreen';
import StartScreen from './screens/Start/StartScreen';
import NewUserScreen from './screens/NewUser/NewUserScreen';
import AiScreen from './screens/Ai/AiScreen';

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

// Create the main Stack Navigator
const App = () => {
  return (
    <SafeAreaProvider>
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
          <Stack.Screen name="Ai" component={AiScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

// Safe styles for reusable layout
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});