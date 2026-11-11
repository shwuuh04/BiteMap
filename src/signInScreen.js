import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View, 
  Keyboard,
  TouchableWithoutFeedback 
} from "react-native";
import { db, auth } from "./firebaseConfig.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { signInStyles as styles } from "./styles.js";

// Function for screen!!
export default function SignInScreen({ navigation, route }) {
const [activeTab, setActiveTab] = useState('signin');
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const fbAuth = auth;

// Function to handle the submit button. Based on which tab is active, it will either sign in or sign up the user. After successful sign in/up, set the signed-in state in App.js to true, which switches the screen to the SearchScreen (main app).
async function handleSubmit() {
    // if either field is left empty, display error
    if (!email || !password) {
      Alert.alert('Error', 'Please fill out all fields and try again.');
      return;
    }

    // if user is on SignIn page,
    // sign in to Firebase Auth with the user's email and password
    // and set isSignedIn boolean to true, which switches the user to the searchscreen (main app navigation)
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
    } 
    // ELSE occurs if the user is on SignUp page,
    // create a new account via Firebase Auth with the inputted email and password
    // then change the boolean isSignedIn to true again, which switches the user to the searchscreen (main app navigation)
    else {
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
            alert("Invalid email. Try again.");
        };
        console.log('Signing up with:', { email, password });
    }
}

  // Actual view
  return (
      <View>

        {/* Container that holds the app title, the SignIn/Up toggles, the 2 input bars, and the signup button */}
        <View style={styles.signInContainer}>
            <Text style={styles.title}>BiteMap</Text>

          {/* Buttons to tab between sign in / sign up modes */}
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

          {/* Based on active tab, either prompt the user to sign in or to create account */}
          <Text style={styles.subtitle}>{activeTab === 'signin' ? 'Sign in to Existing Account' : 'Create an Account'}</Text>

          {/* email input bar */}
          <TextInput
            placeholder="Email"
            style={styles.textInputBar}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          
          {/* password input bar */}
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
