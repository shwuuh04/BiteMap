import { useState, useEffect } from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system/legacy";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "./firebaseConfig.js";

import { addFoodTruckStyles as styles } from "./styles.js";

export default function AddFoodTruckScreen() {
  const [foodTrucks, setFoodTrucks] = useState([]);
  const [selectedTruck, setSelectedTruck] = useState("");
  const [menuPhoto, setMenuPhoto] = useState(null);
  const [truckPhoto, setTruckPhoto] = useState(null);
  // Get food trucks from Firestore
  useEffect(() => {
    async function getFoodTrucks() {
      try {
        const snapshot = await getDocs(collection(db, "foodTrucks"));

        const trucks = snapshot.docs.map((truckDoc) => ({
          id: truckDoc.id,
          ...truckDoc.data(),
        }));

        setFoodTrucks(trucks);
      } catch (error) {
        console.log("Error getting food trucks:", error);
      }
    }

    getFoodTrucks();
  }, []);

  async function takeTruckPhoto() {
    // Request permission to use camera
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow camera access to take a photo.",
      );

      return;
    }

    // Open camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    // Save selected photo
    if (!result.canceled) {
      setTruckPhoto(result.assets[0].uri);
    }
  }

  async function uploadTruckPhoto() {
    if (!selectedTruck || !truckPhoto) {
      Alert.alert("Missing information", "Select a truck and take a photo.");
      return;
    }

    try {
      // Convert image into Base64
      const base64Image = await FileSystem.readAsStringAsync(truckPhoto, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Save image directly in Firestore
      await updateDoc(doc(db, "foodTrucks", selectedTruck), {
        truckPhoto: base64Image,
      });

      Alert.alert("Success", "Truck photo saved!");

      setTruckPhoto(null);
    } catch (error) {
      console.log("Upload error:", error);
      Alert.alert("Error", error.message);
    }
  }

  // Select a menu photo
  async function pickMenuPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setMenuPhoto(result.assets[0].uri);
    }
  }

  // Upload the menu photo
  async function uploadMenu() {
    if (selectedTruck === "" || menuPhoto === null) {
      Alert.alert(
        "Missing information",
        "Please select a food truck and a menu photo.",
      );

      return;
    }

    try {
      // Convert image into a file
      const response = await fetch(menuPhoto);
      const blob = await response.blob();

      // Create a Firebase Storage reference
      const imageRef = ref(storage, `menus/${selectedTruck}/menu.jpg`);

      // Upload image
      await uploadBytes(imageRef, blob);

      // Get image URL
      const imageURL = await getDownloadURL(imageRef);

      // Update selected food truck in Firestore
      await updateDoc(doc(db, "foodTrucks", selectedTruck), {
        menuPhoto: imageURL,
      });

      Alert.alert("Success", "Menu photo uploaded successfully!");

      setMenuPhoto(null);
      setSelectedTruck("");
    } catch (error) {
      console.log("Upload error:", error);

      Alert.alert("Upload failed", "Could not upload the menu photo.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Food Truck Menu</Text>

      <Text style={styles.label}>Select a food truck</Text>

      <Picker
        selectedValue={selectedTruck}
        onValueChange={(value) => setSelectedTruck(value)}
      >
        <Picker.Item label="Choose a food truck" value="" />

        {foodTrucks.map((truck) => (
          <Picker.Item key={truck.id} label={truck.name} value={truck.id} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={pickMenuPhoto}>
        <Text style={styles.buttonText}>Choose Menu Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={takeTruckPhoto}>
        <Text style={styles.buttonText}>Take Food Truck Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={uploadTruckPhoto}>
        <Text style={styles.buttonText}>Upload Truck Photo</Text>
      </TouchableOpacity>
      {menuPhoto && (
        <Image source={{ uri: menuPhoto }} style={styles.preview} />
      )}
      {truckPhoto && (
        <Image source={{ uri: truckPhoto }} style={styles.preview} />
      )}
      <TouchableOpacity style={styles.button} onPress={uploadMenu}>
        <Text style={styles.buttonText}>Upload Menu</Text>
      </TouchableOpacity>
    </View>
  );
}

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#F5F5F5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#801616",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  preview: {
    width: "100%",
    height: 250,
    resizeMode: "contain",
    marginTop: 20,
  },
});
*/
