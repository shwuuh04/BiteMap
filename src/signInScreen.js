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
import { db, auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export default function SignInScreen({ navigation, route }) {
const [activeTab, setActiveTab] = useState('signin');
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const fbAuth = auth;

// Handles the submit button. Based on which tab is active, it will either sign in or sign up the user. After successful sign in/up, set the signed-in state in App.js to true, which switches the screen to the SearchScreen (main app).
async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out all fields and try again.');
      return;
    }

    if (activeTab === 'signin') {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            route.params.setIsSignedIn(true);
        }
        catch (error) {
            console.log(error.message);
            alert(error.message);
        };
      console.log('Logging in with:', { email, password });
    } else {
        try {
            const response = await createUserWithEmailAndPassword(
                fbAuth,
                email,
                password,
            );
            route.params.setIsSignedIn(true);
        }
        catch (error) {
            console.log(error.message);
            alert(error.message);
        };
        console.log('Signing up with:', { email, password });
    }
}

  return (
      <View>


        <View style={styles.signInContainer}>
            <Text style={styles.title}>BiteMap</Text>

{/* Tab between sign in / sign up modes */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'signin' && styles.activeTabButton]} 
            onPress={() => setActiveTab('signin')}
          >
            <Text style={[styles.tabText, activeTab === 'signin' && styles.activeTabText]}>Sign In</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'signup' && styles.activeTabButton]} 
            onPress={() => setActiveTab('signup')}
          >
            <Text style={[styles.tabText, activeTab === 'signup' && styles.activeTabText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>



            <Text style={styles.subtitle}>{activeTab === 'signin' ? 'Sign in to Existing Account' : 'Create an Account'}</Text>

            <TextInput
            placeholder="Email"
            style={styles.textInputBar}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            />
                
            <TextInput
            placeholder="Password"
            style={styles.textInputBar}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            />

            {/* Updated with Copilot: use the route-provided setter to mark the user as signed in. */}
            <TouchableOpacity
            style={styles.signInButton}
            onPress={() => {handleSubmit(); console.log("submitted");}}
            >
            <Text style={styles.signUpText}>{activeTab === 'signin' ? 'Sign In' : 'Sign Up'}</Text>
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
    color: "#3fa8bd", 
    marginTop: 20,
    textAlign: "center",
    textDecorationLine: "underline",
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

 tabContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d46c35',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 20,
    width: '100%',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  activeTabButton: {
    backgroundColor: '#d46c35',
  },
  tabText: {
    color: '#d46c35',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },

  signUpText: {
    color: "#fff",
    fontSize: 16,
  },

});
