import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { WebView } from "react-native-webview";
import {
  MAP_DOCUMENT_STYLES,
  MAP_MARKER_STYLES,
  mapStyles,
} from "../styles.js";

const FoodTruckMap = forwardRef(function FoodTruckMap(
  { foodTrucks = [], userLocation = null, onMapLoadEnd },
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

            marker.bindPopup(
              "<b>" + truck.name + "</b><br>" +
              truck.type
            );

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
      onLoadEnd={onMapLoadEnd}
    />
  );
});

export default FoodTruckMap;
