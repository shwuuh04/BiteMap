import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { searchStyles as styles } from "./styles.js";

const SEARCH_HISTORY_KEY = "bitemap.searchHistory";

async function addSearchTerm(term) {
  const normalizedTerm = term.trim();
  if (!normalizedTerm) return;

  try {
    const savedHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    const history = savedHistory ? JSON.parse(savedHistory) : [];

    if (
      !Array.isArray(history) ||
      !history.every((entry) => typeof entry === "string")
    ) {
      throw new Error("Saved search history has an invalid format.");
    }

    await AsyncStorage.setItem(
      SEARCH_HISTORY_KEY,
      JSON.stringify([...history, normalizedTerm])
    );
  } catch {
    Alert.alert(
      "Search history unavailable",
      "Your search couldn't be saved. Please try again."
    );
  }
}

export async function clearSearchHistory() {
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}

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
        onPress={async () => {
          const searchTerm = search.trim();
          await addSearchTerm(searchTerm);
          navigation.navigate("Map", { searchQuery: searchTerm });
        }}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
