import React, { useEffect, useReducer } from 'react';
import { View, Button, StyleSheet, Text,TouchableOpacity } from 'react-native';

interface State {
  strength: number;
  dexterity: number;
  intelligence: number;
  faith: number;
  arcane: number;
}

type CounterAction =
  | { type: "respec" }
  | { type: "setStrength"; value: number }
  | { type: "setDexterity"; value: number }
  | { type: "setIntelligence"; value: number }
  | { type: "setFaith"; value: number }
  | { type: "setArcane"; value: number };

const initialState: State = {
  strength: 0,
  dexterity: 0,
  intelligence: 0,
  faith: 0,
  arcane: 0,
};

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "respec":
      return initialState; // Reset all categories
    case "setStrength":
      return { ...state, strength: action.value };
    case "setDexterity":
      return { ...state, dexterity: action.value };
    case "setIntelligence":
      return { ...state, intelligence: action.value };
    case "setFaith":
      return { ...state, faith: action.value };
    case "setArcane":
      return { ...state, arcane: action.value };
    default:
      throw new Error("Unknown action.");
  }
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const MAX_VALUE = 100; // Assume the max value for each category is 100
  const calculateProgress = (value: number) => value / MAX_VALUE;

  useEffect(() => {
    // Set the header options when the screen mounts
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
          onPress={() => navigation.navigate('Settings')} // Navigate to Settings
        />
      ),
      headerLeft: () => (
        <Button
          title="Bot"
          onPress={() => navigation.navigate('Ai')} // Navigate to Ai
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {Object.keys(state).map((stat) => (
        <View key={stat} style={styles.progressContainer}>
          <Text style={styles.label}>{stat.toUpperCase()}</Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculateProgress(state[stat as keyof State]) * 100}%` },
                ]}
              />
            </View>
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() =>
                dispatch({
                  type: `set${stat.charAt(0).toUpperCase() + stat.slice(1)}` as CounterAction["type"],
                  value: state[stat as keyof State] + 5,
                })
              }
            >
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      <Button title="Respec" onPress={() => dispatch({ type: "respec" })} />
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
  progressContainer: {
    width: '80%',
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50', // Green color for the bar
    borderRadius: 10,
  },
  plusButton: {
    marginLeft: 8,
    backgroundColor: '#2196F3', // Blue button color
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
