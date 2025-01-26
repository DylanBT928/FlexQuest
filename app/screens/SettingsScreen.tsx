import React, {useEffect} from 'react';
import {useState, useCallback} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';

import { createClient } from '@supabase/supabase-js';
import {useUser} from '../Contexts/Usercontext'

// Initialize Supabase client
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    );
  };

const SettingsScreen = ({ navigation }: { navigation: any }) => {
    const {user} = useUser();
    const [height, setHeight] = useState("Height");
    const [weight, setWeight] = useState("Weight");
    const [sex, setSex] = useState("Sex");
    const handleLogout = () => {
        // Extra steps to log out
        Alert.alert("Goodbye!", "You have been successfully logged out.");
        navigation.navigate("LoginScreen"); // Go back to the login screen
    }
    
    useEffect(() => {
    const loadUserData = async () => {
        // Fetch the user data from Supabase
        const { data, error } = await supabase
          .from('RPGStats') // Assuming you have a "user_stats" table
          .select('strength, dexterity, intelligence, faith, arcane, level, levelPoints,levelProgress')
          .eq('username',user?.username)
          .single(); // Assuming you're fetching one record
        //   setUserData(data);
        //   setIsLoading(false);
    };

          loadUserData();
        }, [user?.username]); // Empty dependency array to run on mount

    function handleHeight(text: string) {
        setHeight(text);
    }
    function handleWeight(text: string) {
        setWeight(text);
    }
    function handleSex(text: string) {
        setSex(text);
    }

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

    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
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
    borderColor: "gray",
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
  buttonText: {
    fontSize: 18, // Adjust text size
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default SettingsScreen;


