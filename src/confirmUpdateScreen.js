import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { ScanFoodTruckStyles as styles } from "./styles.js";
import NewLocationMap from "./components/newLocationMap.js";

export default function ConfirmUpdateScreen({ route, navigation }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const truck = route?.params?.truck;
  const newLocation = route?.params?.newLocation;

  function formatLocation(location) {
    const latitude = location?.latitude ?? location?._lat;
    const longitude = location?.longitude ?? location?._long;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return "Unavailable";
    }

    const latitudeHemisphere = latitude >= 0 ? "N" : "S";
    const longitudeHemisphere = longitude >= 0 ? "E" : "W";
    return `${Math.abs(latitude).toFixed(6)}\u00B0 ${latitudeHemisphere}, ${Math.abs(longitude).toFixed(6)}\u00B0 ${longitudeHemisphere}`;
  }

  async function confirmLocationUpdate() {
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, "foodTrucks", truck.id), {
        mapLocation: newLocation,
      });
      Alert.alert("Location updated", "The food truck location was updated.");
      navigation.navigate("SignedIn", { screen: "Map" });
    } catch (error) {
      console.error("Failed to update food truck location:", error);
      Alert.alert(
        "Update failed",
        "The food truck location couldn't be updated. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update this Vendor?</Text>
      
      {/* truck details */}
      <Text style={styles.label}>Name: {truck?.name ?? "Unavailable"}</Text>
      <Text style={styles.label}>Truck ID: {truck?.truckID ?? "Unavailable"}</Text>
      <Text style={styles.label}>New Location: {formatLocation(newLocation)}</Text>

      {/* map and pin of new location, not interactable */}
      <NewLocationMap
        userLocation={newLocation}
      />

      {/* confirm button, return to map */}
      <TouchableOpacity
        style={styles.button}
        onPress={confirmLocationUpdate}
        disabled={isUpdating}
      >
        <Text style={styles.buttonText}>
          {isUpdating ? "Updating..." : "Confirm and Update"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
