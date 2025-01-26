import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { createClient } from '@supabase/supabase-js';
import {useUser} from '../Contexts/Usercontext'


// Initialize Supabase (replace with your Supabase URL and key)
const supabaseUrl = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'

const supabase = createClient(supabaseUrl, supabaseKey);

const WorkoutLog = ({ navigation }: { navigation: any }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<number>(0); // Duration stored as integer (in minutes)
  const [modalVisible, setModalVisible] = useState(false);
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const workoutOptions = ['Chest', 'Triceps', 'Back', 'Biceps', 'Legs'];
  const {user} = useUser();

  // Duration options in minutes
  const durationOptions = [
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hr', value: 60 },
    { label: '1 hr 15 min', value: 75 },
    { label: '1 hr 30 min', value: 90 },
  ];

  const toggleWorkout = (workout: string) => {
    if (selectedWorkouts.includes(workout)) {
      setSelectedWorkouts((prev) => prev.filter((item) => item !== workout));
    } else {
      setSelectedWorkouts((prev) => [...prev, workout]);
    }
  };

  const logWorkoutHandler = async () => {
    if (!selectedWorkouts.length || !selectedDuration) {
      alert('Please select both workouts and duration');
      return;
    }

    const workoutData = {
      username: user!.username,
      workoutType: selectedWorkouts.join(', '),
      duration: selectedDuration,
      date: getFormattedDate(), // Use the formatted date here
    };

    try {
      const { data, error } = await supabase
        .from('Workout')
        .insert([workoutData]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Failed to log workout. Please try again.');
      } else {
        console.log('Workout logged:', data);
        alert('Workout successfully logged!');
        navigation.goBack();
      }
    } catch (err) {
      console.error('Error logging workout:', err);
      alert('An error occurred while logging the workout.');
    }
  };

  // Get formatted date in day/month/year format
  const getFormattedDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${year}/${month}/${day}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Select Type of Workout</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedWorkouts.length > 0
            ? `Selected: ${selectedWorkouts.join(', ')}`
            : 'Select Workouts'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Select Workout Duration</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDurationModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedDuration > 0 ? `Duration: ${selectedDuration} min` : 'Select Duration'}
        </Text>
      </TouchableOpacity>

      {/* Modal for Workouts */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Choose Workouts</Text>

            <FlatList
              data={workoutOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionTouchable}
                  onPress={() => toggleWorkout(item)}
                >
                  <View style={styles.option}>
                    <View style={styles.checkboxContainer}>
                      <Checkbox
                        status={selectedWorkouts.includes(item) ? 'checked' : 'unchecked'}
                        onPress={() => toggleWorkout(item)}
                      />
                    </View>
                    <Text style={styles.optionText}>{item}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Duration */}
      <Modal
        visible={durationModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setDurationModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Choose Duration</Text>

            <FlatList
              data={durationOptions}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionTouchable}
                  onPress={() => {
                    setSelectedDuration(item.value); // Store the value (in minutes)
                    setDurationModalVisible(false);
                  }}
                >
                  <View style={[styles.option, styles.durationOption]}>
                    <Text style={styles.optionText}>{item.label}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDurationModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logButton} onPress={logWorkoutHandler}>
        <Text style={styles.logButtonText}>Log Workout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  dropdownButton: {
    width: '80%',
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1, // Black border for the dropdown button
    borderColor: '#000',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  optionTouchable: {
    width: '100%',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkboxContainer: {
    borderWidth: 1, // Black border for the checkbox
    borderColor: '#000',
    borderRadius: 3,
    padding: 2, // Adds some padding around the checkbox
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  },
  durationOption: {
    borderWidth: 1, // Black border around duration options
    borderColor: '#000', // Black color for the border
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
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

export default WorkoutLog;
