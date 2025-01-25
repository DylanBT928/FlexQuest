import React, { useEffect, useReducer } from 'react';
import { View, Button, StyleSheet } from 'react-native';

interface State {
  strength: number
  dexterity: number
  intelligence: number
  faith: number
  arcane: number
}

type CounterAction =
  | { type: "respec" }
  | { type: "setStrength"; value: State["strength"] }
  | { type: "setDexterity"; value: State["dexterity"] }
  | { type: "setIntelligence"; value: State["intelligence"] }
  | { type: "setFaith"; value: State["faith"] }
  | { type: "setArcane"; value: State["arcane"] }

const initialStrength: State = { strength: 0 }
const initialDexterity: State = { dexterity: 0 }
const initialIntelligence: State = { intelligence: 0 }
const initialFaith: State = { faith: 0 }
const initialArcane: State = { arcane: 0 }

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "respec":
      return initialState
    case "setStrength":
      return initialStrength
    case "setDexterity":
      return initialDexterity
    case "setIntelligence":
      return initialIntelligence
    case "setFaith":
      return initialFaith
    case "setArcane":
      return initialArcane
    default:
      throw new Error("Unknown action.");
  }
}

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
