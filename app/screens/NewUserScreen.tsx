import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const NewUserScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [equipment, setEquipment] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [weight, setWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [timeFrame, setTimeFrame] = useState('');

  const handleCreateAccount = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }
  
    if (!heightFt || !heightIn) {
      Alert.alert('Error', 'Please enter valid height.');
      return;
    }
  
    if (!weight) {
      Alert.alert('Error', 'Please enter weight.');
      return;
    }
  
    // Ensure that number fields are null if empty
    const finalHeightFt = heightFt ? Number(heightFt) : null;
    const finalHeightIn = heightIn ? Number(heightIn) : null;
    const finalWeight = weight ? Number(weight) : null;
    const finalGoalWeight = goalWeight ? Number(goalWeight) : null;
    const finalTimeFrame = timeFrame ? timeFrame : null;
  
    // Check if username already exists
    const { data, error } = await supabase
      .from('User')
      .select('username')
      .eq('username', username);
  
    if (error) {
      Alert.alert('Error', 'Error checking username.');
      return;
    }
  
    if (data.length > 0) {
      Alert.alert('Error', 'Username already exists. Please choose another.');
    } else {
      // Add the new user
      const { error: insertError } = await supabase
        .from('User')
        .insert([
          { 
            username, 
            password, 
            equipment, 
            heightFt: finalHeightFt, 
            heightIn: finalHeightIn, 
            weight: finalWeight, 
            goalWeight: finalGoalWeight, 
            timeFrame: finalTimeFrame 
          }
        ]);
  
      if (insertError) {
        console.error('Insert Error:', insertError); // Log the error to see what went wrong
        Alert.alert('Error', insertError.message || 'Error creating account.'); // Display the error message
      } else {
        Alert.alert('Success', 'Account created successfully!');
        navigation.replace('Start'); // Navigate back to login
      }
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username: "
        placeholderTextColor="#888" // Set placeholder color
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password:"
        placeholderTextColor="#888" // Set placeholder color
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Equipment (Optional):"
        placeholderTextColor="#888" // Set placeholder color
        value={equipment}
        onChangeText={setEquipment}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (Ft):"
        placeholderTextColor="#888" // Set placeholder color
        value={heightFt}
        onChangeText={setHeightFt}
      />
      <TextInput
        style={styles.input}
        placeholder="Height (In):"
        placeholderTextColor="#888" // Set placeholder color
        value={heightIn}
        onChangeText={setHeightIn}
      />
      <TextInput
        style={styles.input}
        placeholder="Weight:"
        placeholderTextColor="#888" // Set placeholder color
        value={weight}
        onChangeText={setWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Goal Weight (Optional):"
        placeholderTextColor="#888" // Set placeholder color
        value={goalWeight}
        onChangeText={setGoalWeight}
      />
      <TextInput
        style={styles.input}
        placeholder="Time Frame (Optional):"
        placeholderTextColor="#888" // Set placeholder color
        value={timeFrame}
        onChangeText={setTimeFrame}
      />

      <Button title="Create Account" onPress={handleCreateAccount} />
      <Button title="Back to Login" onPress={() => navigation.navigate('Start')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
    color: '#333', // Ensure input text is visible
  },
});

export default NewUserScreen;
