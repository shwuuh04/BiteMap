import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
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

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={styles.header}>Find a Bite near you!</Text>

      <TextInput
        placeholder="Search..."
        style={[
          styles.searchBar,
          { backgroundColor: colors.card, color: colors.text },
        ]}
        placeholderTextColor={colors.text}
        value={search}
        onChangeText={setSearch}
      />

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => {
          navigation.navigate("Map", { searchQuery: search });
        }}
      >
        <Text style={{ color: "#fff", fontSize: 16 }}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Light gray background
    padding: 30,
    alignItems: "center",
  },

  searchBar: {
    alignSelf: "center",
    width: "80%",
    height: 40,
    borderColor: "#d46c35", // Orange border color
    borderWidth: 1,
    borderRadius: 20,

    backgroundColor: "#fff",
    paddingHorizontal: 15, // Padding inside the search bar
    marginTop: 20,

    fontSize: 16,
  },

  searchButton: {
    backgroundColor: "#d46c35", // Orange background color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    width: "30%",
    alignItems: "center", // Center the text inside the button
    alignSelf: "center", // center the button itself
  },

  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d46c35",
    marginBottom: 20,
    marginTop: 60,
    textAlign: "center",
  },
});
