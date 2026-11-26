// Dependencies required. Some may be missing from here. The terminal will tell you which ones are needed if you try to run the app.
// npx expo install @maplibre/maplibre-react-native
// npx expo install expo-location
// npx expo install @react-native-async-storage/async-storage
// npx expo install expo-camera

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
//import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Asset } from "expo-asset";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider, useAppTheme } from "./src/themeMode.js";

import SearchScreen from "./src/searchScreen.js";
import MapScreen from "./src/mapScreen.js";
import SettingsScreen from "./src/settingsScreen.js";
import SignInScreen from "./src/signInScreen.js";
import ScanFoodTruckScreen from "./src/ScanFoodTruckScreen.js";
import { COLORS } from "./src/styles.js";
import { auth } from "./src/firebaseConfig.js";
import ConfirmUpdateScreen from "./src/confirmUpdateScreen.js";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// preloading icons for the search page
const SEARCH_ICONS = [
  require("./assets/historyIcon.png"),
  require("./assets/deleteIcon.png"),
  require("./assets/scanIcon.png"),
];

// ChatGPT helped create MainTabNavigator; Firebase auth state now controls access to the signed-in tabs.
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowIcon: false,
        headerShown: true,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.inactive,
      }}
    >
      {/* 3 buttons at the bottom nav bar */}
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// NavigationContainer created with the use of ChatGPT for passing the props to the MainTabNavigator.
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppContent() {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const { isDark, isLoaded } = useAppTheme();

  useEffect(() => {
    Asset.loadAsync(SEARCH_ICONS).catch((error) => {
      console.error("Failed to preload search icons:", error);
    });
  }, []);

  useEffect(() => {
    // Copilot: replacing the setIsSignedIn navigation boolean with this auth-state listener, which should work for persistence (we cant test since we're using expo go, its a fresh sign-in each time anyway).
    return onAuthStateChanged(auth, (user) => {
      setIsSignedIn(Boolean(user));
    });
  }, []);

  // Wait for the saved preference before showing the app.
  if (!isLoaded || isSignedIn === null) return null;

  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: COLORS.accent,
      background: isDark ? COLORS.darkBackground : COLORS.background,
      card: isDark ? COLORS.darkCard : COLORS.lightCard,
      text: isDark ? COLORS.darkText : COLORS.lightText,
      border: isDark ? COLORS.darkBorder : COLORS.lightBorder,
    },
  };
  return (
    <NavigationContainer theme={theme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          <>
            <Stack.Screen name="SignedIn" component={MainTabNavigator} />
            <Stack.Screen
              name="ScanFoodTruck"
              component={ScanFoodTruckScreen}
              options={{
                headerShown: true,
                title: "Scan to Update Pin",
                headerBackTitle: "Back",
              }}
            />
            <Stack.Screen
              name="ConfirmFoodTruck"
              component={ConfirmUpdateScreen}
              options={{
                headerShown: true,
                title: "Confirm to Update Pin",
                headerBackTitle: "Scan",
              }}
            />
          </>
        ) : (
          <Stack.Screen name="SignedOut" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
