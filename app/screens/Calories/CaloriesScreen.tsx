import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { createClient } from '@supabase/supabase-js';
import { Calendar } from 'react-native-calendars';

const SUPABASE_URL = 'https://zfpgtgaihwwctipacpgl.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmcGd0Z2FpaHd3Y3RpcGFjcGdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NzczMTQsImV4cCI6MjA1MzM1MzMxNH0.xCBt7nk2hFIM-rdWi5KWIsE02lhWAO9miuvqnIkF7tg';

const CaloriesScreen = ({ username }: { username: string }) => {
  const [caloriesProgress, setCaloriesProgress] = useState<number>(0);
  const [proteinProgress, setProteinProgress] = useState<number>(0);
  const [carbsProgress, setCarbsProgress] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false); // Track client-side rendering

  useEffect(() => {
    // Ensure that calendar is rendered only on the client side
    setIsClient(true);

    const fetchUserData = async () => {
      try {
        // Query the Supabase database for the user's data based on the username
        const { data, error } = await supabase
          .from('user_data') // Replace with your table name
          .select('calories, protein, carbs')
          .eq('username', username)
          .single(); // Assuming each user has only one entry

        if (error) throw error;

        // Assuming the database contains the user's progress as a number from 0-100
        if (data) {
          setCaloriesProgress(data.calories);
          setProteinProgress(data.protein);
          setCarbsProgress(data.carbs);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username]); // Re-run the query if the username changes

  const screenWidth = Dimensions.get('window').width; // Get the screen width

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Half - Rings for Calories, Protein, and Carbs */}
      <View style={styles.topHalf}>
        <Text style={styles.title}>Calories Page</Text>

        <View style={styles.ringsContainer}>
          {/* Calories Ring */}
          <View style={styles.ring}>
            <ProgressCircle
              percent={caloriesProgress}
              radius={50}
              borderWidth={8}
              color="#3498db"
              shadowColor="#ddd"
              bgColor="#fff"
            >
              <Text style={styles.ringText}>{caloriesProgress}%</Text>
            </ProgressCircle>
            <Text style={styles.ringLabel}>Calories</Text>
          </View>

          {/* Protein Ring */}
          <View style={styles.ring}>
            <ProgressCircle
              percent={proteinProgress}
              radius={50}
              borderWidth={8}
              color="#2ecc71"
              shadowColor="#ddd"
              bgColor="#fff"
            >
              <Text style={styles.ringText}>{proteinProgress}%</Text>
            </ProgressCircle>
            <Text style={styles.ringLabel}>Protein</Text>
          </View>

          {/* Carbs Ring */}
          <View style={styles.ring}>
            <ProgressCircle
              percent={carbsProgress}
              radius={50}
              borderWidth={8}
              color="#f39c12"
              shadowColor="#ddd"
              bgColor="#fff"
            >
              <Text style={styles.ringText}>{carbsProgress}%</Text>
            </ProgressCircle>
            <Text style={styles.ringLabel}>Carbs</Text>
          </View>
        </View>
      </View>

      {/* Bottom Half - Calendar (only client-side) */}
      <View style={styles.bottomHalf}>
        {isClient && (
          <Calendar
            markedDates={{
              '2025-01-25': { selected: true, marked: true, selectedColor: 'blue' },
              '2025-01-26': { selected: true, marked: true, selectedColor: 'blue' },
            }}
            onDayPress={(day) => {
              console.log('selected day', day);
            }}
          />
        )}
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
  ringsContainer: {
    flexDirection: 'row', // Align rings horizontally
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%', // Make the container take full width
    marginTop: 20,
  },
  ring: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ringLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 10,
  },
  bottomHalf: {
    flex: 1, // Takes up the bottom half of the screen
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default CaloriesScreen;
