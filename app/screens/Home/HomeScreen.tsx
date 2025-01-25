import React, { useEffect, useReducer, useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
  const [level, setLevel] = useState(0); // Track the level
  const [levelPoints, setLevelPoints] = useState(0); // Track available points
  const [levelProgress, setLevelProgress] = useState(0); // Track level progress

  const MAX_LEVEL = 100; // Max level value
  const MAX_VALUE = 50; // Max value for each stat

  const calculateProgress = (value: number) => value / MAX_VALUE;

  // Handle filling the level bar and incrementing the level
  useEffect(() => {
    if (levelProgress >= 1) {
      setLevel(level + 1); // Increment level when maxed
      setLevelProgress(0); // Reset level progress bar
      setLevelPoints(levelPoints + 1); // Add a point when the level is completed
    }
  }, [levelProgress, level, levelPoints]);

  const handleIncreaseLevel = () => {
    if (levelProgress < 1) {
      setLevelProgress(levelProgress + 0.1); // Increase progress by 10% each time
    }
  };

  const handleIncreaseStat = (stat: keyof State) => {
    if (levelPoints > 0) {
      dispatch({
        type: `set${stat.charAt(0).toUpperCase() + stat.slice(1)}` as CounterAction["type"],
        value: state[stat] + 5,
      });
      setLevelPoints(levelPoints - 1); // Deduct one point after assigning it to a stat
    }
  };

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
              onPress={() => handleIncreaseStat(stat as keyof State)}
            >
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <Button title="Respec" onPress={() => dispatch({ type: "respec" })} />

      {/* Level Progress Bar */}
      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>
          Level: {level}
        </Text>
        <View style={styles.levelProgressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(levelProgress * 100, 100)}%`, // Level progress bar fills up
                backgroundColor: '#FF5722', // Orange color for level
              },
            ]}
          />
        </View>
      </View>

      <Button title="Increase Level" onPress={handleIncreaseLevel} />

      <Text style={styles.levelPoints}>Level Points: {levelPoints}</Text>
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
    backgroundColor: '#4caf50', // Green color for the stat bars
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
  levelContainer: {
    width: '80%',
    marginTop: 20,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  levelProgressBar: {
    height: 30, // Height of the level progress bar
    backgroundColor: '#e0e0e0', // Light gray background
    borderRadius: 15, // Rounded corners
    overflow: 'hidden',
  },
  levelPoints: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default HomeScreen;
