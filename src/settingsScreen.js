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
// import { Switch } from "react-native-switch";
import { db } from "./firebaseConfig.js";

export default function SettingsScreen({ navigation, route }) {
  const username = "User";

  const [lightModeIsEnabled, setLightModeIsEnabled] = useState(false);
  const toggleLightModeSwitch = () => setLightModeIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>

      <Text style={styles.welcomeText}>Hello, {username}</Text>

      {/* switch source: https://reactnative.dev/docs/switch */}
      <View style={styles.buttonContainer}>
        <Text style={styles.labelText}>Dark Mode</Text>

        {/* Switch with text source: https://stackoverflow.com/questions/40865391/how-to-show-text-yes-no-inside-a-switch-in-react-native */}
        <Switch
          trackColor={{false: '#767577', true: '#f6d6a4'}}
          thumbColor={lightModeIsEnabled ? '#d46c35' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleLightModeSwitch}
          value={lightModeIsEnabled}
          // activeText={'On'}
          // inActiveText={'Off'}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.labelText}>Clear Search History</Text>
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
                  },},]);}
        }>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Text style={styles.labelText}>Log Out</Text>
        <TouchableOpacity
          style={styles.logOutbutton}
          onPress={() => {
            Alert.alert(
              // alert source: https://reactnative.dev/docs/alert
              'Log Out',
              'Are you sure you want to log out?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Log Out',
                  style: 'destructive',
                  onPress: () => {
                    // Added with Copilot: clear the signed-in state and return to the sign-in screen.
                    route.params.setIsSignedIn(false);
                  },},]);}
        }>
          <Text style={styles.buttonText}>Log Out</Text>
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
    alignItems: "center",
    marginBottom: 20,
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

  labelText: {
    fontSize: 16,
  },

  deleteSearchHistoryButton: {
    backgroundColor: "#d46c35", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "30%",
    borderRadius: 20,
    alignItems: "center", // Center the text inside the button
  },

  logOutbutton: {
    backgroundColor: "#d43535", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "30%",
    borderRadius: 20,
    alignItems: "center", // Center the text inside the button
  }
});
