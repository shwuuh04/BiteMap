import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { useAppTheme } from "./themeMode.js";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Switch,
} from "react-native";
import { signOut } from "firebase/auth";
// import { Switch } from "react-native-switch";
import { auth } from "./firebaseConfig.js";
import { settingsStyles as styles } from "./styles.js";
import { clearSearchHistory } from "./searchScreen.js";

// Function for screen !!
export default function SettingsScreen({ navigation, route }) {
  // will be changed to grab the username by doing email - everything after @.  splice or whatever the method is.
  const username = "User";

  const { isDark, isSaving, changeTheme } = useAppTheme();
  const { colors } = useTheme();

  // Actual view
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Display the username at the top */}
      <Text style={[styles.welcomeText, { color: colors.text }]}>
        Hello, {username}
      </Text>

      {/* switch source: https://reactnative.dev/docs/switch */}
      {/* Light/Dark mode switch toggle */}
      <View style={styles.buttonContainer}>
        <Text style={[styles.labelText, { color: colors.text }]}>Dark Mode</Text>

        {/* Switch with text source: https://stackoverflow.com/questions/40865391/how-to-show-text-yes-no-inside-a-switch-in-react-native
        UNUSED as of now but might be changed, i dunno. its not important right now */}
        <Switch
          trackColor={{ false: "#767577", true: "#f6d6a4" }}
          thumbColor={isDark ? "#d46c35" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={changeTheme}
          value={isDark}
          disabled={isSaving}
        />
      </View>

      {/* Clear search history button.
      onPress, show an alert asking for confirmation
      Then delete search history if user chooses delete. */}
      <View style={styles.buttonContainer}>
        <Text style={[styles.labelText, { color: colors.text }]}>Clear Search History</Text>
        <TouchableOpacity
          style={styles.deleteSearchHistoryButton}
          onPress={() => {
            Alert.alert(
              // alert source: https://reactnative.dev/docs/alert
              "Clear Search History",
              "Are you sure you want to clear your search history? This can't be undone.",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      await clearSearchHistory();
                    } catch {
                      Alert.alert(
                        "Couldn't clear search history",
                        "Please try again."
                      );
                    }
                  },
                },
              ],
            );
          }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>

      {/* Log out button.
      onPress, show an alert asking for confirmation
      if user chooses logout, change the app's theme to light mode
      then log the user out */}
      <View style={styles.buttonContainer}>
        <Text style={[styles.labelText, { color: colors.text }]}>Log Out</Text>
        <TouchableOpacity
          style={styles.logOutbutton}
          onPress={() => {
            Alert.alert(
              // alert source: https://reactnative.dev/docs/alert
              "Log Out",
              "Are you sure you want to log out?",
              [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Log Out",
                  style: "destructive",
                  onPress: async () => {
                    await changeTheme(false);
                    try {
                      await signOut(auth);
                      route.params.setIsSignedIn(false);
                    } catch {
                      Alert.alert(
                        "Couldn't log out",
                        "Please check your connection and try again."
                      );
                    }
                  },
                },
              ],
            );
          }}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
