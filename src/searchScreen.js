import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { db } from "./firebaseConfig.js";
import { searchStyles as styles } from "./styles.js";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
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
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
