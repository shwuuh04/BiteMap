import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebaseConfig.js";
import { ScanFoodTruckStyles as styles } from "./styles.js";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function ScanFoodTruckScreen({ navigation }) {
  const [truckId, setTruckId] = useState("");
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const isFocused = useIsFocused();

  // request camera permission
  async function requestCameraAccess() {
    try {
      await requestCameraPermission();
    } catch (error) {
      console.error("Camera permission request failed:", error);
      Alert.alert(
        "Camera unavailable",
        "Camera access couldn't be requested. Please try again.",
      );
    }
  }

  // check the entered truckID against the list of trucks, return the matches
  async function verifyTruckId() {
    const normalizedTruckId = truckId.trim();
    if (!normalizedTruckId) {
      Alert.alert("Enter a truck ID", "Type or scan a truck ID to continue.");
      return;
    }

    try {
      const result = await getDocs(
        query(
          collection(db, "foodTrucks"),
          where("truckID", "==", normalizedTruckId)
        )
      );

      if (result.empty) {
        Alert.alert("Truck not found", "No food truck has that ID.");
        return;
      }

      navigation.navigate("ConfirmFoodTruck", {
        truckId: normalizedTruckId,
      });
    } catch (error) {
      console.error("Truck ID verification failed:", error);
      Alert.alert(
        "Verification failed",
        "The truck ID couldn't be verified. Please try again.",
      );
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Food Truck Location</Text>
      {/* image entry */}
      <Text style={styles.label}>Scan QR Code</Text>
      <Text style={styles.subLabel}>Can&apos;t find the QR code? Ask the vendor for help!</Text>
        {/* camera view */}
        <View style={styles.cameraContainer}>
          {cameraPermission?.granted && isFocused ? (
            <CameraView
              style={styles.cameraPreview}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={({ data }) => {
                setTruckId(data);
                
              }}
            />
          ) : (
            <View style={styles.cameraPermission}>
              <Text style={styles.cameraMessage}>
                {!cameraPermission
                  ? "Checking camera permission..."
                  : cameraPermission.granted
                    ? "Camera preview paused."
                    : "Allow camera access to show the preview."}
              </Text>
              {cameraPermission && !cameraPermission.granted && (
                <TouchableOpacity
                  style={styles.button}
                  onPress={requestCameraAccess}
                >
                  <Text style={styles.buttonText}>Allow Camera</Text>
                </TouchableOpacity>
              )}
            </View>
        )}
      </View>

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
