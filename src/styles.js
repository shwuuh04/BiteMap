import { StyleSheet } from "react-native";

export const COLORS = {
  accent: "#d46c35",
  background: "#F5F5F5",
  darkBackground: "#121212",
  darkCard: "#222222",
  darkBorder: "#444444",
  darkText: "#F5F5F5",
  inactive: "gray",
  lightCard: "#FFFFFF",
  lightBorder: "#DDDDDD",
  lightText: "#111111",
  logout: "#d43535",
  mapBlue: "#007AFF",
  white: "#fff",
};

export const SETTINGS_SWITCH_COLORS = {
  track: { false: "#767577", true: "#f6d6a4" },
  thumb: { light: "#f4f3f4", dark: COLORS.accent },
  iosBackground: "#3e3e3e",
};

export const MAP_MARKER_STYLES = {
  user: {
    radius: 8,
    color: COLORS.white,
    fillColor: COLORS.mapBlue,
    fillOpacity: 1,
    weight: 2,
  },
};

export const signInStyles = StyleSheet.create({
  signInContainer: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "80%",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 20,
    marginTop: 220,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 10,
    textAlign: "center",
  },
  textInputBar: {
    height: 40,
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 20,
    fontSize: 16,
  },
  signInButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  tabContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 25,
    overflow: "hidden",
    marginBottom: 20,
    width: "100%",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  activeTabButton: {
    backgroundColor: COLORS.accent,
  },
  tabText: {
    color: COLORS.accent,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
  },
});

export const searchStyles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.accent,
    marginBottom: 20,
    marginTop: 60,
    textAlign: "center",
  },
  searchBar: {
    alignSelf: "center",
    width: "80%",
    height: 40,
    borderColor: COLORS.accent,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    marginTop: 20,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    width: "30%",
    alignItems: "center",
    alignSelf: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  recenterButton: {
    position: "absolute",
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recenterCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.mapBlue,
    borderWidth: 2,
    borderColor: "#fff",
  },
  webView: {
    flex: 1,
  },
});

export const settingsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 30,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  labelText: {
    fontSize: 16,
  },
  deleteSearchHistoryButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "30%",
    borderRadius: 20,
    alignItems: "center",
  },
  logOutbutton: {
    backgroundColor: COLORS.logout,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "30%",
    borderRadius: 20,
    alignItems: "center",
  },
});

export const MAP_DOCUMENT_STYLES = `
  html, body, #map {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }
`;
