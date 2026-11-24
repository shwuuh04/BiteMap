import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { addFoodTruckStyles as styles } from "./styles.js";
import { CameraView } from "expo-camera";

export default function AddFoodTruckScreen() {
  const [truckId, setTruckId] = useState("");

  async function verifyTruckId() {
    const normalizedTruckId = truckId.trim();
    if (!normalizedTruckId) return;

    try {
      const result = await getDocs(
        query(
          collection(db, "foodTrucks"),
          where("truckID", "==", normalizedTruckId)
        )
      );

      if (!result.empty) {
        console.log(true);
      }
    } catch (error) {
      console.error("Truck ID verification failed:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Food Truck</Text>
      {/* image entry */}
      <Text style={styles.label}>Scan QR Code</Text>
      <Text style={styles.subLabel}>Can&apos;t find the QR code? Ask the vendor for help!</Text>
      {/* camera view */}
      <CameraView>

      {/* 1. ask for camera permissions
      2. display camera view
      3. if qr code scanned, get that string
      4. (!string) check string with truckids, get the match
      5. next page: display the user's location, confirm the truck name, and a button that says "upload new location to map" */}

      </CameraView>

      {/* manual entry */}
      <Text style={styles.label}>Manually Enter truck ID</Text>
      <TextInput
        style={styles.input}
        value={truckId}
        onChangeText={setTruckId}
        placeholder="eg. 1234567ab"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={verifyTruckId}>
        <Text style={styles.buttonText}>Verify Truck ID</Text>
      </TouchableOpacity>
    </View>
  );
}
