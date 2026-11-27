import { collection, onSnapshot } from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { db } from "./firebaseConfig.js";
//import { Map, Camera, Marker } from "@maplibre/maplibre-react-native";
import FoodTruckMap from "./components/FoodTruckMap.js";
import BottomSheet from "./BottomSheet.js";
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
  const searchQuery =
    typeof route?.params?.searchQuery === "string"
      ? route.params.searchQuery.trim()
      : "";
  const searchVersion = route?.params?.searchVersion ?? 0;
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [foodTrucksStatus, setFoodTrucksStatus] = useState("loading");
  const [selectedTruck, setSelectedTruck] = useState(null);
  // getting the user's location. src: https://draftbit.com/answers/get-the-users-location-in-expo/
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);
  let searchResults = [];
  if (foodTrucksStatus === "loaded" && searchQuery) {
    const normalizedQuery = searchQuery.toLowerCase();
    const matches = foodTrucks.filter(
      (truck) =>
        truck.name.toLowerCase().includes(normalizedQuery) ||
        truck.type.toLowerCase().includes(normalizedQuery),
    );
    searchResults = matches.map(({ latitude, longitude }) => [
      latitude,
      longitude,
    ]);
  }
  useEffect(() => {
    getUserLocation().then(setLocation);
  }, []);

  // getting truck data from Firestore
  useEffect(() => {
    // subscribing to Firestore onSnapshot:
    // this listens for ANY changes made to firestore. this way, when a user updates the truck location, it will be updated in real-time for all active users
    // scr: https://firebase.google.com/docs/firestore/query-data/listen
    const unsubscribe = onSnapshot(
      collection(db, "foodTrucks"),
      (snapshot) => {
        const trucks = snapshot.docs.flatMap((truckDoc) => {
          const data = truckDoc.data();
          const mapLocation = data.mapLocation;
          const validTruck =
            typeof data.name === "string" &&
            typeof data.cuisineType === "string" &&
            typeof data.description === "string" &&
            Number.isFinite(mapLocation?.latitude) &&
            Number.isFinite(mapLocation?.longitude);

          if (!validTruck) {
            console.warn(
              `Skipping food truck with invalid data: ${truckDoc.id}`,
            );
            return [];
          }

          return [
            {
              id: truckDoc.id,
              name: data.name,
              type: data.cuisineType,
              cuisineType: data.cuisineType,
              description: data.description,
              latitude: mapLocation.latitude,
              longitude: mapLocation.longitude,

              // Images saved in Firestore
              truckPhoto: data.truckPhoto,
              menuPhoto: data.menuPhoto,
            },
          ];
        });

        setFoodTrucks(trucks);
        setFoodTrucksStatus("loaded");
      },
      (error) => {
        console.error("Failed to listen for food truck updates.", error);
        setFoodTrucksStatus("failed");
        Alert.alert(
          "Food trucks unavailable",
          "Food truck locations couldn't be loaded.",
        );
      },
    );

    return unsubscribe;
  }, []);

  // Show a message when the search does not match a truck.
  useEffect(() => {
    if (
      foodTrucksStatus === "loaded" &&
      searchQuery &&
      searchResults.length === 0
    ) {
      Alert.alert(
        "No matching food truck",
        `No food truck matched "${searchQuery}".`,
      );
    }
  }, [foodTrucksStatus, searchQuery, searchResults.length, searchVersion]);

  // Function to recenter the map on the user's location, created by CoPilot.
  function recenterMap() {
    if (!location?.coords) {
      Alert.alert(
        "Location unavailable",
        "Allow location access to recenter the map.",
      );
      return;
    }

    mapRef.current?.recenter(
      location.coords.latitude,
      location.coords.longitude,
    );
  }

  // Function to select a truck and recenter the map
  function recenterOnTruck(truck) {
    setSelectedTruck(truck);

    mapRef.current?.recenter(truck.latitude, truck.longitude);
  }

  // Actual view
  return (
    <View style={styles.container}>
      {/* The map, passing the list of truck data (which the map uses to display pins) and the userLocation (which the map uses to center itself on startup) */}
      <FoodTruckMap
        ref={mapRef}
        foodTrucks={foodTrucks} // passing the list of trucks
        userLocation={location?.coords ?? null} // passing the user's location. if user didn't allow perms (earlier in code) then it is null.
        searchResults={searchResults}
        searchVersion={searchVersion}
        onTruckTap={recenterOnTruck}
      />
      <BottomSheet
        foodTrucks={foodTrucks}
        selectedTruck={selectedTruck}
        onSelectTruck={recenterOnTruck}
        onClearSelection={() => setSelectedTruck(null)}
      />
      <TouchableOpacity style={styles.recenterButton} onPress={recenterMap}>
        <View style={styles.recenterCircle} />
      </TouchableOpacity>
      {/* food truck add button */}
      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => navigation.navigate("ScanFoodTruck")}
      >
        <Image
          source={require("../assets/scanIcon.png")}
          style={styles.scanIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
