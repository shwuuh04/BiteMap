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
  TouchableWithoutFeedback 
} from "react-native";
import { db } from "./firebaseConfig.js";

export default function SignInScreen({ navigation, route }) {
const [user, setUser] = useState("");
const [password, setPassword] = useState("");


  return (
      <View>


        <View style={styles.signInContainer}>
            <Text style={styles.title}>BiteMap</Text>
            <Text style={styles.body}>Returning user?</Text>
            <Text style={styles.subtitle}>Log In</Text>

            <TextInput
            placeholder="Username"
            style={styles.textInputBar}
            value={user}
            onChangeText={setUser}
            />
                
            <TextInput
            placeholder="Password"
            style={styles.textInputBar}
            value={password}
            onChangeText={setPassword}
            secureTextEntry   
            />

            {/* Updated with Copilot: use the route-provided setter to mark the user as signed in. */}
            <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {route.params.setIsSignedIn(true); console.log("User signed in");}}
            >
            <Text style={{ color: "#fff", fontSize: 16 }}>Sign In</Text>
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
    alignItems: "center",
  },
 
  searchBar: {
    alignSelf: "center",
    width: "80%",
    height: 40,
    borderColor: "#d46c35", // Orange border color
    borderWidth: 1,
    borderRadius: 20,

    backgroundColor: "#fff",
    paddingHorizontal: 15, // Padding inside the search bar
    marginTop: 20,

    fontSize: 16,
  },

  searchButton: {
    backgroundColor: "#d46c35", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    width: "30%",
    alignItems: "center", // Center the text inside the button
    alignSelf : "center", // center the button itself
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d46c35", 
    marginBottom: 20,
    marginTop: 60,
    textAlign: "center",
  },

  signInContainer: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%",
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#d46c35", 
    marginBottom: 20,
    marginTop: 220,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d46c35", 
    marginBottom: 10,
    textAlign: "center",
  },

  body: {
    fontSize: 18,
    color: "#d46c35", 
    marginBottom: 20,
    textAlign: "center",
  },    

  textInputBar: {
    height: 40,
    borderColor: "#d46c35",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 20,
    fontSize: 16,
  },

  signInButton: {
    backgroundColor: "#d46c35", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,

  },

});
