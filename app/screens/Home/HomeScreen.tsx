import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Button 
        title="Go to Workout Screen"
        onPress={() => navigation.navigate('Workout')}
      />
      <Button 
        title="Go to Calories Screen"
        onPress={() => navigation.navigate('Calories')}
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

export default HomeScreen;
