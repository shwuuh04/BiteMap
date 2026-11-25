import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { Linking } from "react-native";
import { WebView } from "react-native-webview";
import {
  MAP_DOCUMENT_STYLES,
  MAP_MARKER_STYLES,
  mapStyles,
} from "../styles.js";

const FoodTruckMap = forwardRef(function FoodTruckMap(
  {
    foodTrucks = [],
    userLocation = null,
    searchResults = [],
    searchVersion = 0,
  },
  ref,
) {
  const webViewRef = useRef(null);
  const userLocationJSON = JSON.stringify(userLocation).replace(
    /</g,
    "\\u003c",
  );
  const latestFoodTrucks = useRef(foodTrucks);
  const latestSearchResults = useRef(searchResults);
  const mapIsReady = useRef(false);
  latestFoodTrucks.current = foodTrucks;
  latestSearchResults.current = searchResults;

  function injectFoodTrucks() {
    const trucksJSON = JSON.stringify(latestFoodTrucks.current).replace(
      /</g,
      "\\u003c",
    );

    webViewRef.current?.injectJavaScript(`
      if (window.setFoodTrucks) {
        window.setFoodTrucks(${trucksJSON});
      }
      true;
    `);
  }

  function injectSearchResults() {
    const searchResultsJSON = JSON.stringify(
      latestSearchResults.current,
    ).replace(/</g, "\\u003c");

    webViewRef.current?.injectJavaScript(`
      if (window.setSearchResults) {
        window.setSearchResults(${searchResultsJSON});
      }
      true;
    `);
  }

  function injectMapData() {
    injectFoodTrucks();
    injectSearchResults();
  }

  useEffect(() => {
    if (mapIsReady.current) {
      injectFoodTrucks();
    }
  }, [foodTrucks]);

  // opening leaflet's credit URLs in browser instead of in-app. in-app has no back-button to return to our mapview, which would softlock the user. i did not want to remove the credits altogether, so this is the next best option.
  // src: comments from https://stackoverflow.com/questions/3543187/prepending-http-to-a-url-that-doesnt-already-contain-http for the https check and https://reactnative.dev/docs/linking?language=javascript for the main function
  function handleShouldStartLoadWithRequest({ url }) {
    if (!/^https?:\/\//i.test(url)) return true;

    Linking.openURL(url).catch((error) => {
      console.error("Failed to open external link:", error);
    });
    return false;
  }

  // Copilot helped add search results to the map's starting view and recenter control.
  useImperativeHandle(ref, () => ({
    recenter(latitude, longitude) {
      webViewRef.current?.injectJavaScript(`
        if (window.foodTruckMap) {
          window.foodTruckMap.setView([${latitude}, ${longitude}], 13);
        }
        true;
      `);
    },
  }));

  // ChatGPT helped set Vancouver as the default view when no user location is available.
  const mapHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js">
        </script>

        <style>${MAP_DOCUMENT_STYLES}</style>
      </head>

      <body>
        <div id="map"></div>

        <script>
          // Create the map at user's location. if location not given then default to vancouver
          const userLocation = ${userLocationJSON};
          let initialCenter = [49.2827, -123.1207];
          if (userLocation) {
            initialCenter = [userLocation.latitude, userLocation.longitude];
          }
          const map = L.map("map").setView(initialCenter, 13);
          window.foodTruckMap = map;
          window.foodTruckMarkers = {};

          // Add OpenStreetMap tiles
          L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            }
          ).addTo(map);

          // place a marker at the user's location
          if (userLocation) {
            L.circleMarker(
              [userLocation.latitude, userLocation.longitude],
              {
                radius: ${MAP_MARKER_STYLES.user.radius},
                color: "${MAP_MARKER_STYLES.user.color}",
                fillColor: "${MAP_MARKER_STYLES.user.fillColor}",
                fillOpacity: ${MAP_MARKER_STYLES.user.fillOpacity},
                weight: ${MAP_MARKER_STYLES.user.weight},
              }
            ).addTo(map);
          }

          window.setFoodTrucks = (foodTrucks) => {
            const truckIds = foodTrucks.map((truck) => String(truck.id));
            Object.keys(window.foodTruckMarkers).forEach((truckId) => {
              if (!truckIds.includes(truckId)) {
                map.removeLayer(window.foodTruckMarkers[truckId]);
                delete window.foodTruckMarkers[truckId];
              }
            });

            foodTrucks.forEach((truck) => {
              const truckId = String(truck.id);
              const position = [truck.latitude, truck.longitude];
              let marker = window.foodTruckMarkers[truckId];

              if (marker) {
                marker.setLatLng(position);
              } else {
                marker = L.marker(position).addTo(map);
                window.foodTruckMarkers[truckId] = marker;
              }

              let popupContent =
                "<div style='width:200px;'>" +
                "<h3>" + truck.name + "</h3>" +
                "<p>" + truck.type + "</p>";

              if (truck.truckPhoto) {
                popupContent +=
                  "<img src='data:image/jpeg;base64," +
                  truck.truckPhoto +
                  "' style='width:100%; height:120px; object-fit:cover; border-radius:8px;'>";
              }

              if (truck.menuPhoto) {
                popupContent +=
                  "<p><b>Menu</b></p>" +
                  "<img src='data:image/jpeg;base64," +
                  truck.menuPhoto +
                  "' style='width:100%; border-radius:8px;'>";
              }

              marker.bindPopup(popupContent + "</div>");
            });
          };

          window.setSearchResults = (searchResults) => {
            if (searchResults.length === 1) {
              map.setView(searchResults[0], 13);
            } else if (searchResults.length > 1) {
              map.fitBounds(searchResults, {
                padding: [40, 40],
                maxZoom: 13,
              });
            }
          };

        </script>
      </body>
    </html>
  `;
  const source = useMemo(() => ({ html: mapHTML }), [mapHTML]);

  return (
    <WebView
      key={searchVersion}
      ref={webViewRef}
      style={mapStyles.webView}
      originWhitelist={["*"]}
      source={source}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
      onLoadEnd={() => {
        mapIsReady.current = true;
        injectMapData();
      }}
    />
  );
});

export default FoodTruckMap;
