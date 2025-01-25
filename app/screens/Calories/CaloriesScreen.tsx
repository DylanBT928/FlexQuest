import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CaloriesScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(''); // Store selected date
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
      <View style={styles.topHalf}>
        <Text style={styles.title}>Calories Page</Text>
        {/* You can add more content here, such as information about calories, stats, etc. */}
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
  },
});

export default CaloriesScreen;