import { collection, getDocs } from "firebase/firestore";
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
  

  // getting the searchterm that is passed from search screen. 
  const search = route?.params?.searchQuery || "";
  const [foodTrucks, setFoodTrucks] = useState([]);
  // getting the user's location. src: https://draftbit.com/answers/get-the-users-location-in-expo/
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

  // getting updated truck data
  useEffect(() => {
    let isMounted = true;
    console.log("running load trucks")

    async function loadFoodTrucks() {
      try {
        const snapshot = await getDocs(collection(db, "foodTrucks"));
        const trucks = snapshot.docs.flatMap((truckDoc) => {
          const data = truckDoc.data();
          const mapLocation = data.mapLocation;
          const validTruck =
            typeof data.name === "string" &&
            typeof data.cuisineType === "string" &&
            Number.isFinite(mapLocation?.latitude) &&
            Number.isFinite(mapLocation?.longitude);

          if (!validTruck) {
            console.warn(`Skipping food truck with invalid data: ${truckDoc.id}`);
            return [];
          }

          return [{
            id: truckDoc.id,
            name: data.name,
            type: data.cuisineType,
            latitude: mapLocation.latitude,
            longitude: mapLocation.longitude,
          }];
        });

        if (isMounted) setFoodTrucks(trucks);
      } catch (error) {
        console.error("Failed to load food trucks from Firestore.", error);
        if (isMounted) {
          Alert.alert(
            "Food trucks unavailable",
            "Food truck locations couldn't be loaded."
          );
        }
      }
    }

    loadFoodTrucks();
    return () => {
      isMounted = false;
    };
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
