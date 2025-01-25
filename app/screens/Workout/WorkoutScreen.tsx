import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const WorkoutScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text>This is the Workout Screen</Text>
      <Button
        title="Go Back to Home Screen"
        onPress={() => navigation.navigate('Home')}  
      />
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

export default WorkoutScreen;
