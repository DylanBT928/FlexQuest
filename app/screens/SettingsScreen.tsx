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
    // fontSize: 30,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: "25%",
  },
  input: {
    height: 40,
    borderColor: "black",
    width: '50%',
  },
  userText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  passwordText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  heightText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  weightText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  sexText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  button: {
    paddingVertical: 10, // Adjust vertical size
    paddingHorizontal: 10, // Adjust horizontal size
    backgroundColor: "#007bff",
    borderRadius: 8, // Rounded corners
  },
  logoutText: {
    fontSize: 18, // Adjust text size
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  saveChangesText: {
    fontSize: 12, // Adjust text size
    color: "#fff",
    fontWeight: "bold",
    textAlign: "right",
  },
  buttonContainer: {
    alignItems: 'flex-end', // Align the button to the right
    marginTop: 10, // Add some margin to the top
    width: '25%', // Ensure the container takes full width
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align the button to the right
  },
});


export default SettingsScreen;


