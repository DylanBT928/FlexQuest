import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Switch,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with anon key (secure for frontend use)
const SUPABASE_URL = 'https://zfpgtgaihwwctipacpgl.supabase.co'; // Replace with your Supabase URL
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcGd0Z2FpaHd3Y3RpcGFjcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzczMTQsImV4cCI6MjA1MzM1MzMxNH0.xCBt7nk2hFIM-rdWi5KWIsE02lhWAO9miuvqnIkF7tg'; // Replace with anon key
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const StartScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isNewAccount, setIsNewAccount] = useState(false);

  // Test connection to Supabase
  useEffect(() => {
    const testConnection = async () => {
      const { error } = await supabase.from('users').select('*').limit(1);
      if (error) {
        console.error('Error connecting to Supabase:', error);
        Alert.alert('Error', 'Unable to connect to the database.');
      } else {
        console.log('Supabase connection successful.');
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      if (isNewAccount) {
        // Check if the username already exists
        const { data: existingUsers, error: selectError } = await supabase
          .from('users') // Replace with your table name
          .select('username')
          .eq('username', username);

        if (selectError) throw selectError;

        if (existingUsers.length > 0) {
          Alert.alert('Error', 'Username already exists. Please choose another.');
        } else {
          // Add the new user
          const { error: insertError } = await supabase
            .from('users') // Replace with your table name
            .insert([{ username, password }]);

          if (insertError) throw insertError;

          Alert.alert('Success', 'Account created successfully!');
          navigation.replace('MainTabs'); // Navigate to the main app
        }
      } else {
        // Check if username and password match
        const { data: users, error: loginError } = await supabase
          .from('users') // Replace with your table name
          .select('username, password')
          .eq('username', username)
          .eq('password', password);

        if (loginError) throw loginError;

        if (users.length === 0) {
          Alert.alert('Error', 'Invalid username or password.');
        } else {
          Alert.alert('Success', 'Login successful!');
          navigation.replace('MainTabs'); // Navigate to the main app
        }
      }
    } catch (error) {
      console.error('Supabase Error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
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
      <View style={styles.toggleContainer}>
        <Text>Create New Account</Text>
        <Switch value={isNewAccount} onValueChange={setIsNewAccount} />
      </View>
      <Button
        title={isNewAccount ? 'Create Account' : 'Login'}
        onPress={handleSubmit}
      />
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

export default StartScreen;
