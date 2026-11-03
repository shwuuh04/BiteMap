
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import SearchScreen from "./src/searchScreen.js";
import MapScreen from "./src/mapScreen.js";
import SettingsScreen from "./src/settingsScreen.js";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
