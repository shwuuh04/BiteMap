import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { addFoodTruckStyles as styles } from "./styles.js";

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


      {/* manual entry */}
      <Text style={styles.label}>Manually Enter truck ID</Text>
      <TextInput
        style={styles.input}
        value={truckId}
        onChangeText={setTruckId}
        placeholder="Truck ID"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={verifyTruckId}>
        <Text style={styles.buttonText}>Verify Truck ID</Text>
      </TouchableOpacity>
    </View>
  );
}
