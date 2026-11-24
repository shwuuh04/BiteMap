import { Text, View } from "react-native";
import { ScanFoodTruckStyles as styles } from "./styles.js";

export default function ConfirmUpdateScreen({ route }) {
  const truckId =
    typeof route?.params?.truckId === "string" ? route.params.truckId : "";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Food Truck</Text>
      <Text style={styles.label}>
        {truckId ? `Truck ID: ${truckId}` : "No truck ID was provided."}
      </Text>
    </View>
  );
}
