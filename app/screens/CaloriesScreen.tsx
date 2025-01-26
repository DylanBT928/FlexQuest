import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Bar } from 'react-native-progress';
import { useUser } from '../Contexts/Usercontext';
import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface State {
  calories_lost: number;
  protein: number;
  carbs: number;
}

type CounterAction =
  | { type: "setCalories_lost"; value: number }
  | { type: "setProtein"; value: number }
  | { type: "setCarbs"; value: number };

const CaloriesScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(''); // Store selected date
  const [data, setData] = useState<any | null>(null); // Store fetched data
  const [loading, setLoading] = useState(false); // Loading state
  const { user } = useUser();
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

  // Fetch data from Supabase
  useEffect(() => {
    console.log('Username:', user?.username);
    console.log('Selected Date:', selectedDate);

    const fetchData = async () => {
      if (!selectedDate) {
        setData(null);
        return;
      }
  
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Calories')
          .select('calories_lost, protein, carbs')
          .eq('date', selectedDate)
          .eq('username', user?.username);
        
        if (error) {
          console.error('Error fetching data:', error.message);
          // If an error occurs or no data is found, populate with 0 values
          setData({ calories: 0, protein: 0, carbs: 0 });
        } else {
          // If data is found, set it
          console.log('Fetched data:', data);
          setData({
            calories: data[0]?.calories_lost || 0,
            protein: data[0]?.protein || 0,
            carbs: data[0]?.carbs || 0,
          }); // Use default values if `result` is null
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setData({ calories: 0, protein: 0, carbs: 0 });
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedDate]);
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half Content */}
      <View style={styles.topHalf}>
        <Text style={styles.title}>Calories Page</Text>
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : data ? (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Text>Calories: {data.calories} / 2000</Text>
              <Bar progress={data.calories / 2000} width={screenWidth * 0.8} color="orange" />
            </View>
            <View style={styles.progressBar}>
              <Text>Protein: {data.protein} / 150g</Text>
              <Bar progress={data.protein / 150} width={screenWidth * 0.8} color="blue" />
            </View>
            <View style={styles.progressBar}>
              <Text>Carbs: {data.carbs} / 300g</Text>
              <Bar progress={data.carbs / 300} width={screenWidth * 0.8} color="green" />
            </View>
          </View>
        ) : (
          <Text>Select a date to view data.</Text>
        )}
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up full screen space
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

export default CaloriesScreen;