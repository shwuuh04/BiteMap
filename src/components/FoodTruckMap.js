import React from "react";
import { WebView } from "react-native-webview";

export default function FoodTruckMap({ foodTrucks = [] }) {
  // Convert the food truck data into JSON for Leaflet
  const trucksJSON = JSON.stringify(foodTrucks).replace(/</g, "\\u003c");

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
          // Create the map defualted to vancouver
          const map = L.map("map").setView(
            [49.2827, -123.1207],
            13
          );

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
      style={{ flex: 1 }}
      originWhitelist={["*"]}
      source={{ html: mapHTML }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
