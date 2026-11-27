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
    color: "#808080",
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
  screenLight: {
    backgroundColor: COLORS.background,
  },
  screenDark: {
    backgroundColor: COLORS.darkBackground,
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
  searchBarLight: {
    backgroundColor: COLORS.lightCard,
    color: COLORS.lightText,
  },
  searchBarDark: {
    backgroundColor: COLORS.darkCard,
    color: COLORS.darkText,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 20,
    width: "30%",
    alignItems: "center",
    alignSelf: "center",
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  historyTextLight: {
    color: COLORS.lightText,
  },
  historyTextDark: {
    color: COLORS.darkText,
  },
  historyBox: {
    backgroundColor: COLORS.lightCard,
    borderRadius: 5,
    padding: 20,
  },
  historyBoxDark: {
    backgroundColor: COLORS.darkCard,
    borderColor: COLORS.darkBorder,
    borderWidth: 1,
  },
  historyItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  historyIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  deleteIcon: {
    width: 30,
    height: 30,
  },
  historyIconDark: {
    width: 30,
    height: 30,
    marginRight: 8,
    tintColor: "#FFFFFF",
  },
  deleteIconDark: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  historySearchButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  deleteButton: {
    marginLeft: "auto",
  },
});

export const bottomStyles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 450,
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingBottom: 30,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },

  dragArea: {
    alignItems: "center",
    paddingVertical: 15,
  },

  dragHandle: {
    width: 45,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#CCCCCC",
    marginBottom: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },

  closeTabButton: {
    position: "absolute",
    top: 10,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
  },

  truckItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  truckName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222222",
  },

  truckNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  truckRating: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },

  starIconStyle: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  directionsIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
    resizeMode: "contain",
  },

  truckRatingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "bold",
    color: "#222222",
  },

  truckType: {
    fontSize: 14,
    color: "#777777",
    marginTop: 4,
  },

  arrow: {
    fontSize: 26,
    color: "#888888",
  },

  truckDetails: {
    paddingTop: 10,
  },

  // Layout for the selected truck's review text, rating, and photo row.
  detailsScroll: {
    flex: 1,
  },

  reviewSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },

  reviewHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
  },

  reviewCarousel: {
    marginTop: 10,
  },

  reviewCarouselContent: {
    paddingRight: 8,
  },

  reviewCard: {
    width: 168,
    marginRight: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
  },

  reviewImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    backgroundColor: "#EEEEEE",
  },

  reviewTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222222",
    minHeight: 44,
    marginBottom: 8,
  },

  reviewMessage: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
  },

  coordinates: {
    fontSize: 14,
    color: "#777777",
    marginTop: 8,
  },

  button: {
    backgroundColor: "#333333",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
  },

  emptyText: {
    textAlign: "center",
    color: "#777777",
    marginTop: 25,
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

  scanButton: {
    position: "absolute",
    right: 20,
    top: 20,
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
  scanIcon: {
    width: 40,
    height: 40,
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

export const ScanFoodTruckStyles = StyleSheet.create({
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
  subLabel: {
    color: "#666",
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
    marginBottom: 20,
  },
  cameraContainer: {
    height: 360,
    width: "100%",
    marginBottom: 24,
    overflow: "hidden",
    borderRadius: 8,
    backgroundColor: "#000",
  },
  cameraPreview: {
    flex: 1,
  },
  cameraPermission: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  cameraMessage: {
    color: "#fff",
    textAlign: "center",
  },
  newLocationContainer: {
    width: "100%",
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "#D3D3D3",
    borderRadius: 8,
  },
  newLocationText: {
    color: "#555",
    fontSize: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#801616",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
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
});
