import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // Set the button in the header on mount
    navigation.setOptions({
      headerRight: () => (
        <Button 
          title="Settings"
          onPress={() => navigation.navigate('Settings')}  // Navigate to Settings
        />
      ),
      headerLeft: () => (
        <Button 
          title="Bot"
          onPress={() => navigation.navigate('Ai')}  // Navigate to Ai
        />
      ),
    });
  }, [navigation]);

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
