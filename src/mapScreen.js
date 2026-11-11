import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import {
  Alert,
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
import { mapStyles as styles } from "./styles.js";

// Code from https://draftbit.com/answers/get-the-users-location-in-expo/ with changes made cuz idk what Promise.Race is
// Function to ask for the user's position and then get location data
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

// Function for screen !!
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

  // getting the searchterm that is passed from search screen. 
  const search = route?.params?.searchQuery || "";
  // getting the user's location. src: https://draftbit.com/answers/get-the-users-location-in-expo/
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

  // Function to recenter the map on the user's location, created by CoPilot. 
  function recenterMap() {
    if (!location?.coords) {
      Alert.alert(
        "Location unavailable",
        "Allow location access to recenter the map."
      );
      return;
    }

    mapRef.current?.recenter(
      location.coords.latitude,
      location.coords.longitude
    );
  }

  // Temporary food truck data in an array. Will be moved to Firestore soon.
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

  // Actual view
  return (
    <View style={styles.container}>
      {/* The map, passing the list of truck data (which the map uses to display pins) and the userLocation (which the map uses to center itself on startup) */}
      <FoodTruckMap
        ref={mapRef}
        foodTrucks={foodTrucks} // passing the list of trucks
        userLocation={location?.coords ?? null} // passing the user's location. if user didn't allow perms (earlier in code) then it is null.
      />
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={recenterMap}
      >
        <View style={styles.recenterCircle} />
      </TouchableOpacity>

    </View>
  );
}
