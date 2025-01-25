import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase
const SUPABASE_URL = 'https://zfpgtgaihwwctipacpgl.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcGd0Z2FpaHd3Y3RpcGFjcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzczMTQsImV4cCI6MjA1MzM1MzMxNH0.xCBt7nk2hFIM-rdWi5KWIsE02lhWAO9miuvqnIkF7tg'; // Replace with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const NewUserScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateAccount = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    // Check if username already exists
    const { data, error } = await supabase
      .from('users')
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
        .from('users')
        .insert([{ username, password }]);

      if (insertError) {
        Alert.alert('Error', 'Error creating account.');
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
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
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
  },
});

export default NewUserScreen;
