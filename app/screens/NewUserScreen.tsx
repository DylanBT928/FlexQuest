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
  const [sex, setSex] = useState('');
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
    const finalSex = sex ? sex : null;
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
            sex: finalSex,
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
        placeholder="Sex (Optional):"
        placeholderTextColor="#888" // Set placeholder color
        value={sex}
        onChangeText={setSex}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Height (ft)"
          placeholderTextColor="#888"
          value={heightFt}
          onChangeText={setHeightFt}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Height (in)"
          placeholderTextColor="#888"
          value={heightIn}
          onChangeText={setHeightIn}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Weight (lbs)"
          placeholderTextColor="#888"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={[styles.input, styles.halfInput]}
          placeholder="Goal Weight (Optionsl)"
          placeholderTextColor="#888"
          value={goalWeight}
          onChangeText={setGoalWeight}
        />
      </View>
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
    width: '100%',
    padding: 8,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInput: {
    width: '48%',
  },
});

export default NewUserScreen;
