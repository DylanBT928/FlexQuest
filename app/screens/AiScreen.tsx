import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { createClient } from '@supabase/supabase-js';
import { useUser } from '../Contexts/Usercontext';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";



const SUPABASE_URL = 'https://lifotcdgyxayvtxvjjmr.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxpZm90Y2RneXhheXZ0eHZqam1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3ODkwNDcsImV4cCI6MjA1MzM2NTA0N30.1_mUwKiJdFWHkK3zy6Y8MGFoMRlLH6W8hlqEmpVxBgI'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
};

const AiScreen = () => {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);


  const fetchResponse = async () => {
    setLoading(true);
  
    try {

      const { data: userData, error: userError } = await supabase
        .from("User")
        .select("equipment, weight, heightFt, heightIn, goalWeight, timeFrame, sex")
        .eq("username", user?.username);
      if (userError) throw new Error("Error fetching user data from User table");

      // Step 2: Fetch dietary habits
      const { data: userDataCalories, error: caloriesError } = await supabase
        .from("Calories")
        .select("calories, protein, carbs")
        .eq("username", user?.username);
      if (caloriesError) throw new Error("Error fetching user data from Calories table");

      // Step 3: Fetch workout history
      const { data: userDataWorkouts, error: workoutsError } = await supabase
        .from("Workout")
        .select("workoutType, duration, date")
        .eq("username", user?.username);
      if (workoutsError) throw new Error("Error fetching user data from Workout table");

      // Step 4: Summarize the fetched data
      const userSummary = `
        User Profile:
        - Sex: ${userData?.[0]?.sex || "Unknown"}
        - Weight: ${userData?.[0]?.weight || "Unknown"} lbs
        - Height: ${userData?.[0]?.heightFt || "Unknown"} ft ${userData?.[0]?.heightIn || "Unknown"} in
        - Goal Weight: ${userData?.[0]?.goalWeight || "Unknown"} lbs
        - Equipment Available: ${userData?.[0]?.equipment || "Unknown"}
        - Time Frame to Achieve Goal: ${userData?.[0]?.timeFrame || "Unknown"}

        Recent Diet:
        - Average Daily Calories: ${userDataCalories?.[0]?.calories || "Unknown"}
        - Protein: ${userDataCalories?.[0]?.protein || "Unknown"}g
        - Carbs: ${userDataCalories?.[0]?.carbs || "Unknown"}g

        Recent Workouts:
        ${userDataWorkouts?.length > 0
          ? userDataWorkouts
              .map(
                (workout) =>
                  `- ${workout.workoutType} for ${workout.duration} mins on ${workout.date}`
              )
              .join("\n")
          : "No recent workouts recorded."}
      `;

      // Step 5: Define the tailored base prompt
      const basePrompt = `
        You are a fitness and dietary expert. Use the user's profile, dietary habits, and workout history to provide personalized advice.
        User Summary:
        ${userSummary.trim()}
        
        Respond in a friendly and supportive tone, keeping the user's goals and habits in mind. Provide actionable tips for their fitness journey.
      `;

      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // or "gpt-3.5-turbo"
          messages: [
            { role: "system", content: basePrompt.trim() }, // Tailored system-level context
            { role: "user", content: input }, // User's question or message
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      const botMessage = res.data.choices[0].message.content;
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), sender: "user", text: input },
        { id: (Date.now() + 1).toString(), sender: "bot", text: botMessage },
      ]);
      setInput(""); // Clear input field
    } catch (error) {
      console.error("Error fetching OpenAI API:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (input.trim() === "") return;
    fetchResponse();
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

const renderMessage = ({ item }: { item: Message }) => (
  <View
    style={[
      styles.messageContainer,
      item.sender === "user" ? styles.userMessage : styles.botMessage,
    ]}
  >
    <Text
      style={[
        styles.messageText,
        item.sender === "user" ? styles.userMessageText : styles.botMessageText,
      ]}
    >
      {item.text}
    </Text>
  </View>
);


  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 110 : 70} // Adjust the offset for better lifting
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.innerContainer}>
          <FlatList 
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Allows taps to dismiss the keyboard
            keyboardDismissMode="on-drag" // Ensures the keyboard dismisses when scrolling
          />


          {loading && <ActivityIndicator size="large" color="#007bff" style={styles.loader} />}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              multiline
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
  },
  chatContainer: {
    flexGrow: 1,
    padding: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f1f1",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  // Modify text color for better readability
  userMessageText: {
    color: "#fff", // White text for user messages
  },
  botMessageText: {
    color: "#333", // Darker text for bot messages
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loader: {
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default AiScreen;