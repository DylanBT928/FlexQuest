import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AiScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <Text>This is the Ai Screen</Text>
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

export default AiScreen;
