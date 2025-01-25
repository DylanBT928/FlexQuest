import React, { useEffect } from 'react';
import { View, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // Set the button in the header on mount
    navigation.setOptions({
      headerStyle: {
        backgroundColor: '#FFFFFF', // Header background color
        height: 50, // Set header height to 50px
      },
      headerTitleStyle: {
        fontSize: 18, // Set font size to 18px
        color: '#000000', // Set font color to black
      },
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
    width: '100%', 
    maxWidth: 600, 
    marginHorizontal: 'auto', 
  },
});


export default HomeScreen;
