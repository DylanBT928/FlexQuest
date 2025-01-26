import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { createClient } from '@supabase/supabase-js';
import { useNavigation } from '@react-navigation/native';
import WorkoutLogScreen from '../screens/WorkoutLogScreen';


// Initialize Supabase client
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


const WorkoutScreen = () => {
  const navigation = useNavigation(); 
  const [selectedDate, setSelectedDate] = useState<string>(''); // Store selected date
  const [data, setData] = useState<any | null>(null); // Store fetched data
  const [loading, setLoading] = useState(false); // Loading state
  const screenWidth = Dimensions.get('window').width; // Get the screen width

  // Get current date in yyyy-mm-dd format
  const currentDate = new Date().toISOString().split('T')[0];

  const handleDayPress = (day: any) => {
    // If the selected day is the current day, reset the previously selected date
    if (day.dateString === currentDate) {
      setSelectedDate(''); // Reset the previously selected date
    } else {
      setSelectedDate(day.dateString); // Update selected date
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half Content */}


      {/* Bottom Half - Calendar */}
      <View style={styles.bottomHalf}>
        <Calendar
          style={[styles.calendar, { width: screenWidth }]} // Use screen width to ensure full width
          onDayPress={handleDayPress} // Handle day press event
          monthFormat={'yyyy MM'}
          markingType={'dot'} // Marking type set to dot
          markedDates={{
            [currentDate]: { // Keep the current day always blue
              selected: true, // Highlight the current day
              selectedColor: 'blue', // Blue color for the current day
              selectedTextColor: 'white', // White text color for the current day
            },
            [selectedDate]: { // Highlight only the selected date if it's not the current day
              selected: true, // Highlight the selected day
              selectedColor: 'lightgrey', // Light grey color for the selected day
              selectedTextColor: 'black', // Black text color for the selected day
            },
          }}
        />
      </View>
      <Button
          title="Log Workout"
          onPress={() => navigation.navigate('WorkoutLog')} // Navigate to CreateAccountScreen
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up full screen space
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHalf: {
    flex: 1, // Takes up the top half of the screen
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bottomHalf: {
    flex: 1, // Takes up the bottom half of the screen
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1, // Optional, adds a border between top and bottom halves
    borderTopColor: '#ddd',
  },
  calendar: {
    height: '100%', // Calendar takes up full height of the bottom half
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  progressBar: {
    marginVertical: 10,
    alignItems: 'center',
  },
});

export default WorkoutScreen;
