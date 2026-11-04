
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { react, useState } from "react";

import SearchScreen from "./src/searchScreen.js";
import MapScreen from "./src/mapScreen.js";
import SettingsScreen from "./src/settingsScreen.js";
import SignInScreen from "./src/signInScreen.js";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// MainTabNavigator created with the use of ChatGPT. This handles the bottom tab navigation and passes the isSignedIn state to the SettingsScreen. This allows the user to sign out if they wish.
function MainTabNavigator({ route }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowIcon: false,
        headerShown: true,
        tabBarActiveTintColor: "#d46c35",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
      name="Search"
      component={SearchScreen}
      />
      
      <Tab.Screen
      name="Map"
      component={MapScreen}
      />
      
      {/* Added with Copilot: forwards the app-level auth setter to SettingsScreen. */}
      <Tab.Screen
      name="Settings"
      component={SettingsScreen}
      initialParams={{ setIsSignedIn: route.params.setIsSignedIn }}
      >
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// NavigationContainer created with the use of ChatGPT for passing the props to the MainTabNavigator. 
export default function App() {
const [isSignedIn, setIsSignedIn] = useState(false);

  return (
    <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          // Signed In: render all the screens in MainTabNavigator (SearchScreen, MapScreen, and SettingsScreen)
          <Stack.Screen
            name="SignedIn" 
            initialParams={{ setIsSignedIn }} 
            component={MainTabNavigator}
          />
        ) : (
          // Signed Out: unloads all tabs and only renders SignInScreen 
          <Stack.Screen
            name="SignedOut"
            initialParams={{ setIsSignedIn }} 
            component={SignInScreen}
          />
        )}
      </Stack.Navigator>
        
    </NavigationContainer>
  );
}
