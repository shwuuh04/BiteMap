import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { WebView } from "react-native-webview";
import {
  MAP_DOCUMENT_STYLES,
  MAP_MARKER_STYLES,
  mapStyles,
} from "../styles.js";

const FoodTruckMap = forwardRef(function FoodTruckMap(
  { foodTrucks = [], userLocation = null, onMapLoadStart, onMapLoadEnd },
  ref,
) {
  const webViewRef = useRef(null);
  // Convert the data into JSON for Leaflet
  const trucksJSON = JSON.stringify(foodTrucks).replace(/</g, "\\u003c");
  const userLocationJSON = JSON.stringify(userLocation).replace(
    /</g,
    "\\u003c",
  );

  // Copilot helped expose map controls to MapScreen for recentering and fitting search results.
  useImperativeHandle(ref, () => ({
    recenter(latitude, longitude) {
      webViewRef.current?.injectJavaScript(`
        if (window.foodTruckMap) {
          window.foodTruckMap.setView([${latitude}, ${longitude}], 13);
        }
        true;
      `);
    },
    fitLocations(locations) {
      const coordinates = JSON.stringify(
        locations.map(({ latitude, longitude }) => [latitude, longitude]),
      );
      webViewRef.current?.injectJavaScript(`
        if (window.foodTruckMap) {
          window.foodTruckMap.fitBounds(${coordinates}, {
            padding: [40, 40],
            maxZoom: 13,
          });
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
          const initialCenter = userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : [49.2827, -123.1207];
          const map = L.map("map").setView(initialCenter, 13);
          window.foodTruckMap = map;

          // Add OpenStreetMap tiles
          L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              maxZoom: 19,
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
            }
          ).addTo(map);

          // Food truck information from React Native
          const foodTrucks = ${trucksJSON};


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

          // Add a marker for each food truck
          foodTrucks.forEach((truck) => {

            const marker = L.marker([
              truck.latitude,
              truck.longitude
            ]).addTo(map);

            let popupContent =
  "<div style='width:200px;'>" +
  "<h3>" + truck.name + "</h3>" +
  "<p>" + truck.type + "</p>";

// Display food truck photo
if (truck.truckPhoto) {
  popupContent +=
    "<img src='data:image/jpeg;base64," +
    truck.truckPhoto +
    "' style='width:100%; height:120px; object-fit:cover; border-radius:8px;'>";
}

// Display menu photo
if (truck.menuPhoto) {
  popupContent +=
    "<p><b>Menu</b></p>" +
    "<img src='data:image/jpeg;base64," +
    truck.menuPhoto +
    "' style='width:100%; border-radius:8px;'>";
}

popupContent += "</div>";

marker.bindPopup(popupContent);

          });
        </script>
      </body>
    </html>
  `;
  const source = useMemo(() => ({ html: mapHTML }), [mapHTML]);

  return (
    <WebView
      ref={webViewRef}
      style={mapStyles.webView}
      originWhitelist={["*"]}
      source={source}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      onLoadStart={onMapLoadStart}
      onLoadEnd={onMapLoadEnd}
    />
  );
});

export default FoodTruckMap;
