import React, { useEffect, useReducer, useState } from 'react';
import { View, Button, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '../Contexts/Usercontext'


// Initialize Supabase client
const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
      return state;
  }
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);
  const [level, setLevel] = useState(1); // State to manage player's level
  const [levelPoints, setLevelPoints] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const {user} = useUser();

  const MAX_LEVEL = 100;
  const MAX_VALUE = 50;

  const calculateProgress = (value: number) => value / MAX_VALUE;

  useEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
            <Button 
              title="AI"
              onPress={() => navigation.navigate('AI')}  // Navigate to AI
            />
            <Button 
              title="Settings"
              onPress={() => navigation.navigate('Settings')}  // Navigate to Settings
            />
          </View>
        ),
      });
    }, [navigation]);

    useEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Button title="AI" onPress={() => navigation.navigate('AI')} />
            <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
          </View>
        ),
      });
    }, [navigation]);
  
    useEffect(() => {
      const loadUserData = async () => {
        try {
          // Fetch the user data from Supabase
          const { data, error } = await supabase
            .from('RPGStats') // Assuming you have a "user_stats" table
            .select('strength, dexterity, intelligence, faith, arcane, level, levelPoints, levelProgress')
            .eq('username', user?.username)
            .single(); // Fetch a single record
  
          if (error) {
            console.error('Error fetching data from Supabase:', error.message);
            throw error; // Rethrow the error to handle it in the catch block
          }
  
          // If the user data exists, initialize state with it
          if (data) {
            console.log(data)
            const { strength, dexterity, intelligence, faith, arcane, level, levelPoints, levelProgress } = data;
            dispatch({ type: 'setStrength', value: strength });
            dispatch({ type: 'setDexterity', value: dexterity });
            dispatch({ type: 'setIntelligence', value: intelligence });
            dispatch({ type: 'setFaith', value: faith });
            dispatch({ type: 'setArcane', value: arcane });
            setLevel(level);
            setLevelPoints(levelPoints);
            setLevelProgress(levelProgress);
          } else {
            console.log("no data")
            // If no data is found, create a new row with default values
            await createUserInDatabase();
          }
        } catch (error) {
          await createUserInDatabase();
        } finally {
          setIsLoading(false); // Data is loaded (whether successfully or with error)
        }
      };
  
    loadUserData();
  }, []); // Empty dependency array to run on mount
  const createUserInDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('RPGStats') // Replace with your actual table name
        .insert([{
          username: user!.username, // Add the username from your user context
          strength: 0,
          dexterity: 0,
          intelligence: 0,
          faith: 0,
          arcane: 0,
          level: 1, // Default level
          levelPoints: 0, // Default level points
          levelProgress: 0, // Default progress
        }]);

      if (error) {
        console.error('Error creating user in database:', error.message);
        throw error;
      }

      console.log('New user data successfully inserted:', data);
      // You can also initialize your state here if needed
      dispatch({ type: 'setStrength', value: 0 });
      dispatch({ type: 'setDexterity', value: 0 });
      dispatch({ type: 'setIntelligence', value: 0 });
      dispatch({ type: 'setFaith', value: 0 });
      dispatch({ type: 'setArcane', value: 0 });
      setLevel(1);
      setLevelPoints(0);
      setLevelProgress(0);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };
  useEffect(() => {
    if (levelProgress >= 1) {
      setLevel(level + 1);
      setLevelProgress(0);
      setLevelPoints(levelPoints + 1);
    }
  }, [levelProgress, level, levelPoints]);

  const handleIncreaseLevel = async () => {
    if (levelProgress < 1) {
      setLevelProgress(levelProgress + 0.1); // Increase progress by 10%
      updateUserData({}, level, levelPoints, levelProgress)
    }
  
    // Update level after progress is maxed out
    if (levelProgress >= 1) {
      setLevel(level + 1); // Increment level
      setLevelProgress(0); // Reset progress bar
      setLevelPoints(levelPoints + 1); // Increment level points
  
      // Update level and level points in Supabase
      await updateUserData({}, level + 1, levelPoints + 1, 0); // Empty object for stats as we're only updating level/level points
    }
  };

  const updateUserData = async (updatedStats: Partial<State>, updatedLevel: number, updatedLevelPoints: number, updatedLevelProgress: number) => {
    try {
      const { data, error } = await supabase
        .from('RPGStats') // Replace with your actual table name
        .update({ ...updatedStats, level: updatedLevel, levelPoints: updatedLevelPoints,levelProgress: updatedLevelProgress }) // Update fields
        .eq('username', user!.username); // Assuming 'user_id' is your unique identifier, replace with actual user identifier
  
      if (error) {
        console.error("Error updating user data:", error.message);
        throw error;
      }
      console.log("User data successfully updated:", data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };


  const handleIncreaseStat = async (stat: keyof State) => {
    if (levelPoints > 0 && state[stat] < 50) {
      // Update the local state (increase the stat)
      const newValue = state[stat] + 5;
      dispatch({
        type: `set${stat.charAt(0).toUpperCase() + stat.slice(1)}` as CounterAction["type"],
        value: newValue,
      });

      // Decrease the available level points
      setLevelPoints(levelPoints - 1);

      // Prepare updated data for Supabase
      const updatedStats: Partial<State> = { [stat]: newValue };
      await updateUserData(updatedStats, level, levelPoints,levelProgress); // Update the Supabase database
    }
  };
  const handleRespec = async () => {
    // Set levelPoints to current level
    setLevelPoints(level); 
  
    // Reset character stats to 0 in the local state
    dispatch({ type: 'respec' });
  
    // Update stats in Supabase to zero, leaving level and levelPoints unchanged
    try {
      const { data, error } = await supabase
        .from('RPGStats') // Replace with your actual table name
        .update({
          strength: 0,
          dexterity: 0,
          intelligence: 0,
          faith: 0,
          arcane: 0,
          levelPoints: level, // Keep the current levelPoints
        })
        .eq('username', user!.username); // Assuming 'username' is your unique identifier
    
      if (error) {
        console.error("Error updating user data:", error.message);
        throw error;
      }
      console.log("User data successfully updated:", data);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Loading screen or user data
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Object.keys(state).map((lebron) => (
        <View style={styles.lebron}>
        <Image
          source={require('../../assets/images/lebron.png')}
          style={{
            width: 50 + level * 30, // Increase width as the player gains levels
            height: 50 + level * 30, // Increase height as the player gains levels
            marginLeft: 40
          }}
        />
      </View>))}
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

      <Button title="Re-Spec" onPress={handleRespec} />

      <View style={styles.levelContainer}>
        <Text style={styles.levelLabel}>
          Level: {level}
        </Text>
        <View style={styles.levelProgressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(levelProgress * 100, 100)}%`,
                backgroundColor: '#FF5722',
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
  lebron: {
    position: 'absolute',
    flex: 1,
    resizeMode: 'stretch',
  },
});

export default HomeScreen;
