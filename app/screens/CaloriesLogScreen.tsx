import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '../Contexts/Usercontext';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

// Initialize Supabase (replace with your Supabase URL and key)
const supabaseUrl = 'https://lifotcdgyxayvtxvjjmr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI';

const supabase = createClient(supabaseUrl, supabaseKey);

const CaloriesLog = ({ navigation }: { navigation: any }) => {
  const [calories, setCalories] = useState<number | ''>(''); // Changed to an empty string for better handling
  const [protein, setProtein] = useState<number | ''>(''); // Optional field, can be empty
  const [carbs, setCarbs] = useState<number | ''>(''); // Optional field, can be empty
  const [date, setDate] = useState<Date | null>(null); // Store the selected date
  const [showDatePicker, setShowDatePicker] = useState(false); // Show/hide date picker
  const { user } = useUser();

  const logCaloriesHandler = async () => {
    if (calories === '' || !date) { // Ensure calories and date are entered
      alert('Please enter calories and select a date.');
      return;
    }

    const calorieData = {
      username: user!.username,
      calories,
      protein: protein !== '' ? protein : null, // If protein is empty, set as null
      carbs: carbs !== '' ? carbs : null, // If carbs is empty, set as null
      date: date.toLocaleDateString(), // Format the date
    };

    try {
      const { data, error } = await supabase.from('Calories').insert([calorieData]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Failed to log calories. Please try again.');
      } else {
        console.log('Calories logged:', data);
        alert('Calories successfully logged!');
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error logging calories:', err);
      alert('An error occurred while logging the calories.');
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter Your Nutritional Info</Text>

      <TextInput
        style={styles.input}
        placeholder="Calories (Required)"
        placeholderTextColor="#999" // Make placeholder text gray
        keyboardType="numeric"
        value={calories === '' ? '' : calories.toString()} // Display value or empty
        onChangeText={(text) => setCalories(text === '' ? '' : Number(text))} // Handle empty input
      />

      <TextInput
        style={styles.input}
        placeholder="Protein (grams - Optional)"
        placeholderTextColor="#999" // Make placeholder text gray
        keyboardType="numeric"
        value={protein === '' ? '' : protein.toString()} // Display value or empty
        onChangeText={(text) => setProtein(text === '' ? '' : Number(text))} // Handle empty input
      />

      <TextInput
        style={styles.input}
        placeholder="Carbs (grams - Optional)"
        placeholderTextColor="#999" // Make placeholder text gray
        keyboardType="numeric"
        value={carbs === '' ? '' : carbs.toString()} // Display value or empty
        onChangeText={(text) => setCarbs(text === '' ? '' : Number(text))} // Handle empty input
      />

      {/* Button to show date picker */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={{ fontSize: 16, color: date ? '#333' : '#bbb' }}>
          {date ? `Selected Date: ${date.toLocaleDateString()}` : 'Select Date (Required)'}
        </Text>
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}

      <TouchableOpacity style={styles.logButton} onPress={logCaloriesHandler}>
        <Text style={styles.logButtonText}>Log Calories</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    borderWidth: 1,
    fontSize: 16,
  },
  logButton: {
    width: '80%',
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CaloriesLog;
