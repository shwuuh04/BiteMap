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
            alert("Invalid email. Try again.");
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
