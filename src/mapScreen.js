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
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "./firebaseConfig.js";
//import { Map, Camera, Marker } from "@maplibre/maplibre-react-native";
import FoodTruckMap from "./components/FoodTruckMap.js";

export default function MapScreen({ navigation }) {
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
      <FoodTruckMap foodTrucks={foodTrucks} />
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
