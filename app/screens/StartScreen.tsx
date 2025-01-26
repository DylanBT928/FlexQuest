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
import { useUser } from '../Contexts/Usercontext';

// Initialize Supabase with anon key (secure for frontend use)
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const StartScreen = ({ navigation }: { navigation: any }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useUser();
  
    const handleLogin = async () => {
      if (!username || !password) {
        Alert.alert('Error', 'Please enter both username and password.');
        return;
      }
  
      // Check if username and password match
      const { data, error } = await supabase
        .from('User')
        .select('username, password')
        .eq('username', username)
        .eq('password', password);
  
      if (error) {
        Alert.alert('Error', 'Error checking credentials.');
        return;
      }
  
      if (data.length === 0) {
        Alert.alert('Error', 'Invalid username or password.');
      } else {
        setUser({ username });
        Alert.alert('Success', 'Login successful!');
        navigation.replace('Home'); // Navigate to the main app
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
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
        <Button title="Login" onPress={handleLogin} />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('NewUser' )} // Navigate to CreateAccountScreen
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
  });
  
  export default StartScreen;
