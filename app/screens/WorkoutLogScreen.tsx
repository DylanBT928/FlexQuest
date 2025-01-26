import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkoutLog = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text>This is the new log Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default WorkoutLog;
