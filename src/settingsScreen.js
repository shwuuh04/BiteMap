import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, 
  Keyboard,
  TouchableWithoutFeedback, 
  Switch
} from "react-native";
import { db } from "./firebaseConfig.js";

export default function SettingsScreen({ navigation }) {
  const username = "User";

  const [lightModeIsEnabled, setLightModeIsEnabled] = useState(false);
  const toggleLightModeSwitch = () => setLightModeIsEnabled(previousState => !previousState);

  return (
    <View>

      <Text style={styles.welcomeText}>Hello, {username}</Text>

      {/* switch source: https://reactnative.dev/docs/switch */}
      <View styles={styles.buttonContainer}>
        <Text>Light Mode</Text>
        <Switch
          trackColor={{false: '#767577', true: '#f6d6a4'}}
          thumbColor={lightModeIsEnabled ? '#d46c35' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLightModeSwitch}
          value={lightModeIsEnabled}
        />
      </View>

      <View styles={styles.buttonContainer}>
        <Text>Clear Search History</Text>
        <TouchableOpacity
          style={styles.deleteSearchHistoryButton}
          onPress={() => {
            Alert.alert(
              // alert source: https://reactnative.dev/docs/alert
              'Clear Search History',
              'Are you sure you want to clear your search history? This can\'t be undone.',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => {
                    // Put your delete history logic here
                  },
                },
              ]
    );


          }}
        >
          <Text style={styles.buttonText}>Delete</Text>

        </TouchableOpacity>
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
    padding: 30,
    alignItems: "center", // Center items
  },

  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },  

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  toggleLightModeButton: {
    backgroundColor: "#d46c35", // Orange background color  
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    width: "20%",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  deleteSearchHistoryButton: {
    backgroundColor: "#d46c35", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "30%",
    borderRadius: 20,
    alignItems: "center", // Center the text inside the button
  }
});
