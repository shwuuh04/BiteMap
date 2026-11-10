import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext(null);
const STORAGE_KEY = "bitemap.theme";

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveQueue = useRef(Promise.resolve());

  // Read the saved preference when the app starts.
  useEffect(() => {
    async function loadTheme() {
      try {
        const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
        setIsDark(savedTheme === "dark");
      } catch {
        Alert.alert(
          "Theme unavailable",
          "Your saved preference could not be loaded. Using light mode."
        );
      } finally {
        setIsLoaded(true);
      }
    }

    loadTheme();
  }, []);

  // Save the choice, then update the app's appearance.
  async function changeTheme(nextIsDark) {
    if (!isLoaded) return false;

    const save = saveQueue.current.then(async () => {
      setIsSaving(true);
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          nextIsDark ? "dark" : "light"
        );
        setIsDark(nextIsDark);
        return true;
      } catch {
        Alert.alert("Couldn't save theme", "Please try again.");
        return false;
      } finally {
        setIsSaving(false);
      }
    });
    saveQueue.current = save;
    return save;
  }

  return (
    <ThemeContext.Provider
      value={{ isDark, isLoaded, isSaving, changeTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(ThemeContext);
}