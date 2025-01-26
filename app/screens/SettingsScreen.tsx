import React, {useEffect} from 'react';
import {useState, useCallback} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';

import { createClient } from '@supabase/supabase-js';
import {useUser} from '../Contexts/Usercontext'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StartScreen from './StartScreen';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SettingsScreen">
        <Stack.Screen name='StartScreen' component={StartScreen} />
        <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Initialize Supabase client
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface State {
    weight: number;
    heightFt: string;
    sex: number;
  }
  
type CounterAction =
| { type: "setWeight"; value: number }
| { type: "setHeightFt"; value: string }
| { type: "setSex"; value: number };

// Logging Out Stuff
interface LogoutButtonProps {
    onLogout: () => void;
  }

  const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const handleLogout = () => {
      // Trigger logout logic
      Alert.alert("Logged Out", "You have been logged out successfully!");
      onLogout();
    };

    return (
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    );
  };



const SettingsScreen = ({ navigation }: { navigation: any }) => {
    const {user} = useUser();
    const [height, setHeight] = useState("Height");
    const [weight, setWeight] = useState("Weight");
    const [sex, setSex] = useState("Sex");
    const [loading, setLoading] = useState(false); // Loading state
    const handleLogout = () => {
        // Extra steps to log out
        navigation.navigate('StartScreen'); // Go back to the login screen
        Alert.alert("Goodbye!", "You have been successfully logged out.");
    }
    
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
    
          try {
            const { data, error } = await supabase
              .from('User') // Assuming you have a "user_stats" table
              .select('heightFt, weight')
              .eq('username', user?.username)
              .single(); // Assuming you're fetching one record
    
            if (error) {
              console.error('Error fetching data:', error.message);
              // If an error occurs or no data is found, populate with default values
              setHeight('Unknown');
              setWeight('Unknown');
              setSex('Unknown');
            } else {
                // If data is found, set it
                console.log('Fetched data:', data);
                setHeight(data.heightFt || 'Unknown');
                setWeight(data.weight || 'Unknown');
                // setSex(data.sex || 'Unknown');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                setHeight('Unknown');
                setWeight('Unknown');
                setSex('Unknown');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
        }, [user?.username]); // Dependency array to run on mount and when username changes

    function handleHeight(text: string) {
        setHeight(text);
    }
    function handleWeight(text: string) {
        setWeight(text);
    }
    function handleSex(text: string) {
        setSex(text);
    }

    const handleSaveChanges = async () => {
        // Save changes to Supabase
        const { error } = await supabase
          .from('User')
          .update({ heightFt: height, weight: weight})
          .eq('username', user?.username);
          Alert.alert('Success', 'Changes saved successfully.');
    };

  return (
    <View style={styles.container}>
      <Text style = {{fontSize: 20}}>User Settings</Text>
    {/* Height Text Box */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={height}
        onChangeText={handleHeight}
        placeholder="Enter Height..."
        placeholderTextColor="gray"
      />
        <Text style={styles.heightText}>{height}</Text>
        </View>
    {/* Weight Text Box  */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={weight}
        onChangeText={handleWeight}
        placeholder="Enter Weight..."
        placeholderTextColor="gray"
      />
        <Text style={styles.weightText}>{weight}</Text>
        </View>

    {/* Sex Text Box  */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={sex}
        onChangeText={handleSex}
        placeholder="Enter Sex..."
        placeholderTextColor="gray"
      />
        <Text style={styles.sexText}>{sex}</Text>
        </View>

    <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSaveChanges}>
            <Text style={styles.saveChangesText}>Save Changes</Text>
        </TouchableOpacity>
    </View>

    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
    </View>

    </View> 
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between', // Adjust spacing between label and input
      alignItems: 'center',
      marginVertical: 10,
      width: "90%", // Adjust width to fit better on mobile
    },
    input: {
      height: 40,
      borderColor: "black",
      borderWidth: 1, // Add a border to the input
      borderRadius: 5, // Rounded corners for the input
      paddingHorizontal: 10, // Add padding inside the input
      width: '50%', // Adjust width to scale properly
      backgroundColor: '#f9f9f9', // Light background for better visibility
    },
    heightText: {
      fontSize: 16,
      textAlign: 'right', // Align text to the left for better spacing
      marginRight: 10, // Add margin between text and input
      width: '40%', // Ensure text label takes up proper space
    },
    weightText: {
      fontSize: 16,
      textAlign: 'right', // Align text to the left for better spacing
      marginRight: 10, // Add margin between text and input
      width: '40%', // Ensure text label takes up proper space
    },
    sexText: {
      fontSize: 16,
      textAlign: 'right', // Align text to the left for better spacing
      marginRight: 10, // Add margin between text and input
      width: '40%', // Ensure text label takes up proper space
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      backgroundColor: "#007bff",
      borderRadius: 8,
    },
    logoutText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
    },
    saveChangesText: {
      fontSize: 12,
      color: "#fff",
      fontWeight: "bold",
      textAlign: "right",
    },
    buttonContainer: {
      alignItems: 'flex-end',
      marginTop: 10,
      width: '90%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
  });
  


export default SettingsScreen;


