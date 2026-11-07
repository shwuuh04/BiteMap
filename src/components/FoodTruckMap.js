import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { WebView } from "react-native-webview";

const FoodTruckMap = forwardRef(function FoodTruckMap(
  { foodTrucks = [], userLocation = null },
  ref
) {
  const webViewRef = useRef(null);
  // Convert the data into JSON for Leaflet
  const trucksJSON = JSON.stringify(foodTrucks).replace(/</g, "\\u003c");
  const userLocationJSON = JSON.stringify(userLocation).replace(/</g, "\\u003c");

  // Created by CoPilot. This code makes the recenter function visible to the mapScreen.js so it can call the function when the recenter button is pressed.
  useImperativeHandle(ref, () => ({
    recenter(latitude, longitude) {
      webViewRef.current?.injectJavaScript(`
        if (typeof map !== "undefined") {
          map.setView([${latitude}, ${longitude}], 13);
        }
        true;
      `);
    },
  }));

  // via chatgpt sets default view to vancouver
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

        <style>
          html, body, #map {
            height: 100%;
            width: 100%;
            margin: 0;
            padding: 0;
          }
        </style>
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
                radius: 8,
                color: "#ffffff",
                fillColor: "#007AFF",
                fillOpacity: 1,
                weight: 2,
              }
            ).addTo(map);
          }

          // Add a marker for each food truck
          foodTrucks.forEach((truck) => {

            const marker = L.marker([
              truck.latitude,
              truck.longitude
            ]).addTo(map);

            marker.bindPopup(
              "<b>" + truck.name + "</b><br>" +
              truck.type
            );

          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      ref={webViewRef}
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={{ html: mapHTML }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
});

export default FoodTruckMap;
