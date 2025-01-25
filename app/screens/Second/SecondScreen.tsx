import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types'; // Correct import path

type SecondScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Second'>;

const SecondScreen = ({ navigation }: { navigation: SecondScreenNavigationProp }) => {
  return (
    <View style={styles.container}>
      <Text>This is the Second Screen</Text>
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

export default SecondScreen;
