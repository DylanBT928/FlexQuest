import React from 'react';
import {useState, useCallback} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';

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
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    );
  };

const SettingsScreen = ({ navigation }: { navigation: any }) => {
    const [user, setUser] = useState("User");
    const [email, setEmail] = useState("Email");
    const [password, setPassword] = useState("Password");
    const [height, setHeight] = useState("Height");
    const [weight, setWeight] = useState("Weight");
    const [sex, setSex] = useState("Sex");
    const handleLogout = () => {
        // Extra steps to log out
        Alert.alert("Goodbye!", "You have been successfully logged out.");
        navigation.navigate("LoginScreen"); // Go back to the login screen
    }

    function handleUser(text: string) {
        setEmail(text);
    }
    function handleEmail(text: string) {
        setEmail(text);
    }
    function handlePassword(text: string) {
        setPassword(text);
    }
    function handleHeight(text: string) {
        setHeight(text);
    }
    function handleWeight(text: string) {
        setWeight(text);
    }
    function handleSex(text: string) {
        setSex(text);
    }

  return (
    <View style={styles.container}>
      <Text style = {{fontSize: 20}}>User Settings</Text>
    {/* User Text Boxes */}
    <View style={styles.inputRow}> 
      <TextInput
        style={styles.input}
        // value={user}
        onChangeText={handleUser}
        placeholder="Enter Username..."
      />
        <Text style={styles.userText}>{user}</Text>
        </View>

    {/* Email Text Boxes */}
    <View style={styles.inputRow}> 
      <TextInput
        style={styles.input}
        // value={email}
        onChangeText={handleEmail}
        placeholder="Enter Email..."
      />
        <Text style={styles.emailText}>{email}</Text>
        </View>

    {/* Password Text Boxes */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={password}
        onChangeText={handlePassword}
        placeholder="Enter Password..."
      />
        <Text style={styles.passwordText}>{password}</Text>
        </View>

    <Text style = {{fontSize: 20}}>Stats</Text>

    {/* Height Text Box */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={height}
        onChangeText={handleHeight}
        placeholder="Enter Height..."
      />
        <Text style={styles.heightText}>{height}</Text>
        </View>

    {/* Weight Text Box  */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={weight}
        onChangeText={handleWeight}
        placeholder="Enter Weight..."
      />
        <Text style={styles.weightText}>{weight}</Text>
        </View>

    {/* Sex Text Box  */}
    <View style={styles.inputRow}> 
        <TextInput
        style={styles.input}
        // value={sex}
        onChangeText={handleSex}
        placeholder="Enter Sex..."
      />
        <Text style={styles.sexText}>{sex}</Text>
        </View>

    <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
    </View>

    </View> 
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    width: "25%",
  },
  input: {
    height: 40,
    borderColor: "gray",
    width: '50%',
  },
  userText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  emailText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  passwordText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  heightText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  weightText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  sexText: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    marginLeft: 10, 
  },
  button: {
    paddingVertical: 10, // Adjust vertical size
    paddingHorizontal: 10, // Adjust horizontal size
    backgroundColor: "#007bff",
    borderRadius: 8, // Rounded corners
  },
  buttonText: {
    fontSize: 18, // Adjust text size
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});


export default SettingsScreen;


