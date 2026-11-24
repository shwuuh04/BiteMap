import { Text, TouchableOpacity, View } from "react-native";
import { ScanFoodTruckStyles as styles } from "./styles.js";

export default function ConfirmUpdateScreen({ route }) {
  const truckId =
    typeof route?.params?.truckId === "string" ? route.params.truckId : "";
  const truckName =
    typeof route?.params?.truckName === "string"
      ? route.params.truckName
      : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update this Vendor?</Text>
      
      {/* truck details */}
      <Text style={styles.label}>Name: {truckName}</Text>
      <Text style={styles.label}>Truck ID: {truckId}</Text>

      {/* map and pin of new location, not interactable */}
      <View style={styles.newLocationContainer}>
        <Text style={styles.newLocationText}>New Location Here</Text>
      </View>

      {/* confirm button, return to map */}
      <TouchableOpacity
      style={styles.button}
     
      onPress={() => console.log("confirmed!")}
      >
        <Text style={styles.buttonText}>Confirm and Update</Text>
      </TouchableOpacity>
       {/* NEXT STEP HERE: update truck pin location in firebase, return to map screen, center on new pin, and show a pop up saying thanks for contributing to the map!*/}
    </View>
  );
}
