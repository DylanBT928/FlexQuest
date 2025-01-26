import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import { createClient } from "@supabase/supabase-js";
import { useUser } from "../Contexts/Usercontext";

const SUPABASE_URL = "https://lifotcdgyxayvtxvjjmr.supabase.co";
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface State {
    weight: number;
    heightFt: string;
    sex: number;
  }
  
type CounterAction =
| { type: "setWeight"; value: number }
| { type: "setHeightFt"; value: string }
| { type: "setSex"; value: number };

// Logging Out Stuff
interface LogoutButtonProps {
    onLogout: () => void;
  }

  const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const handleLogout = () => {
      // Trigger logout logic
      Alert.alert("Logged Out", "You have been logged out successfully!");
      onLogout();
    };

    return (
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    );
  };



const SettingsScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useUser();
  const [heightFt, setHeightFt] = useState("");
  const [heightIn, setHeightIn] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    navigation.navigate("Start");
    Alert.alert("Goodbye!", "You have been successfully logged out.");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("User")
          .select("heightFt, heightIn, weight, sex")
          .eq("username", user?.username)
          .single();

        if (error) {
          console.error("Error fetching data:", error.message);
          setHeightFt("");
          setHeightIn("");
          setWeight("");
          setSex("");
        } else {
          setHeightFt(data?.heightFt || "");
          setHeightIn(data?.heightIn || "");
          setWeight(data?.weight || "");
          setSex(data?.sex || "");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.username]);

  const handleSaveChanges = async () => {
    const { error } = await supabase
      .from("User")
      .update({
        heightFt,
        heightIn,
        weight,
        sex,
      })
      .eq("username", user?.username);

    if (!error) {
      Alert.alert("Success", "Changes saved successfully.");
    } else {
      Alert.alert("Error", "Failed to save changes.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Settings</Text>

      <View style={styles.card}>
        {/* Height Section */}
        <Text style={styles.label}>Height</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={heightFt}
            onChangeText={setHeightFt}
            placeholder="Feet"
            keyboardType="numeric"
            placeholderTextColor="gray"
          />
          <TextInput
            style={styles.input}
            value={heightIn}
            onChangeText={setHeightIn}
            placeholder="Inches"
            keyboardType="numeric"
            placeholderTextColor="gray"
          />
        </View>
      </View>

      <View style={styles.card}>
        {/* Weight Section */}
        <Text style={styles.label}>Weight</Text>
        <TextInput
          style={styles.inputFull}
          value={weight}
          onChangeText={setWeight}
          placeholder="Enter Weight..."
          keyboardType="numeric"
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.card}>
        {/* Sex Section */}
        <Text style={styles.label}>Sex</Text>
        <TextInput
          style={styles.inputFull}
          value={sex}
          onChangeText={setSex}
          placeholder="Enter Sex..."
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    backgroundColor: "#f9f9f9",
  },
  inputFull: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButtonText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SettingsScreen;
