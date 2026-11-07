import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import * as Location from "expo-location";
import { db } from "./firebaseConfig.js";
//import { Map, Camera, Marker } from "@maplibre/maplibre-react-native";
import FoodTruckMap from "./components/FoodTruckMap.js";

// Code from https://draftbit.com/answers/get-the-users-location-in-expo/ with changes made cuz idk what Promise.Race is
export async function getUserLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") return null;

  try {
    return await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    return await Location.getLastKnownPositionAsync();
  }
}


export default function MapScreen({ navigation, route }) {
  /* 
  //retrieve location data from firebase 

  {foodTrucks.map((truck) => (
  <Marker
    key={truck.id}
    coordinate={{
      latitude: truck.latitude,
      longitude: truck.longitude
    }}
    title={truck.name}
    description={truck.type}
  />
))}
  */

  // getting the search from search screen. 
  const search = route?.params?.searchQuery || "";
  // getting the user's location. src: https://draftbit.com/answers/get-the-users-location-in-expo/
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

  // Temporary food truck data
  const foodTrucks = [
    {
      id: "1",
      name: "Taco Truck",
      type: "Mexican",
      latitude: 49.2827,
      longitude: -123.1207,
    },
    {
      id: "2",
      name: "Burger Truck",
      type: "Burgers",
      latitude: 49.285,
      longitude: -123.115,
    },
    {
      id: "3",
      name: "Dessert Truck",
      type: "Desserts",
      latitude: 49.279,
      longitude: -123.125,
    },
  ];

  return (
    <View style={styles.container}>
      <FoodTruckMap
        foodTrucks={foodTrucks} // passing the list of trucks
        userLocation={location?.coords ?? null} // passing the user's location. if user didn't allow perms (earlier in code) then it is null.
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

/*

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
    padding: 30,
    alignItems: "center", // Center items
  },
});
*/
