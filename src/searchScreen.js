import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { searchStyles as styles } from "./styles.js";

const SEARCH_HISTORY_KEY = "bitemap.searchHistory";

// Function to get the search history list from AsyncStorage
// SEARCH_HISTORY_KEY is the name of the key
// each term is saved under this key in JSON format, which needs to be parsed into an array in order to be used
// the array is returned as 'history'
async function getSearchHistory() {
  const savedHistory = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
  const history = savedHistory ? JSON.parse(savedHistory) : [];

  if (
    !Array.isArray(history) ||
    !history.every((entry) => typeof entry === "string")
  ) {
    throw new Error("Saved search history has an invalid format.");
  }

  return history;
}

async function deleteSearchHistory(index) {
  const history = await getSearchHistory();
  const updatedHistory = history.filter((_, historyIndex) => historyIndex !== index);
  await AsyncStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );
  return updatedHistory;
}

// Function to add a search term to the history 
// first, trim any blank spaces from the term
// then get the list from the getSearchHistory() function
// add the new search term to the end of the list
// convert it back into JSON before storing it in AsyncStorage
// then the function returns the 'updatedHistory' array, which is displayed on the search page
async function addSearchTerm(term) {
  const normalizedTerm = term.trim();
  if (!normalizedTerm) return null;

  const history = await getSearchHistory();
  const updatedHistory = [...history, normalizedTerm];
  await AsyncStorage.setItem(
    SEARCH_HISTORY_KEY,
    JSON.stringify(updatedHistory)
  );
  return updatedHistory;
}

// Function that clears search history by deleting the SEARCH_HISTORY_KEY from AsyncStorage
// exported so the settings page can access the function
export async function clearSearchHistory() {
  await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
}

// Function for the screen!!
export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const { colors, dark } = useTheme();
  const historyTextStyle = dark
    ? styles.historyTextDark
    : styles.historyTextLight;

  // When this screen is in focus, get the latest search history and update it
  // this is necessary to ensure the history is displayed properly on the screen
  useFocusEffect(
    useCallback(() => {
      let isFocused = true;

      getSearchHistory()
        .then((history) => {
          if (isFocused) setSearchHistory(history);
        })
        .catch(() => {
          Alert.alert(
            "Search history unavailable",
            "Your saved searches couldn't be loaded."
          );
        });

      return () => {
        isFocused = false;
      };
    }, [])
  );

  // Actual view
  return (
    <View style={[styles.screen, dark ? styles.screenDark : styles.screenLight]}>

      <Text style={styles.header}>Find a Bite near you!</Text>

      {/* Search bar */}
      <TextInput
        placeholder="Search..."
        style={[
          styles.searchBar,
          dark ? styles.searchBarDark : styles.searchBarLight,
        ]}
        placeholderTextColor={colors.text}
        value={search}
        onChangeText={setSearch}
      />

      {/* Search button. Pressing does 3 things:
      - Adds the search term to the search history via addSearchTerm(searchTerm)
      - Updates the search history array using setSearchHistory(updatedHistory)
      - Navigates to the Map page and passes the search term to be used to display the result*/}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={async () => {
          const searchTerm = search.trim();

          try {
            const updatedHistory = await addSearchTerm(searchTerm);
            if (updatedHistory) setSearchHistory(updatedHistory);
          } catch {
            Alert.alert(
              "Search history unavailable",
              "Your search couldn't be saved."
            );
          }

          setSearch("");
          navigation.navigate("Map", { searchQuery: searchTerm });
        }}
      >
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {/* Display the recent search terms in order of recency. */}
      <FlatList
        data={searchHistory}
        keyExtractor={(item, index) => `${index}-${item}`}
        ListEmptyComponent={
          <Text style={historyTextStyle}>No history to show.</Text>
        }
        renderItem={({ item, index }) => (
          <View style={styles.historyBox}>
            <Text style={historyTextStyle}>{item}</Text>
            <Text>Icon</Text>
            <TouchableOpacity
              onPress={async () => {
                try {
                  const updatedHistory = await deleteSearchHistory(index);
                  setSearchHistory(updatedHistory);
                } catch {
                  Alert.alert(
                    "Couldn't delete search",
                    "Please try again."
                  );
                }
              }}
            >
              <Text>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
