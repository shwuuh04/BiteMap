import { useMemo } from "react";
import { WebView } from "react-native-webview";
import {
  MAP_DOCUMENT_STYLES,
  mapStyles,
} from "../styles";

function getCoordinates(location) {
  const latitude = location?.latitude ?? location?._lat;
  const longitude = location?.longitude ?? location?._long;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

export default function NewLocationMap({ userLocation }) {
  const userLocationJSON = JSON.stringify(
    getCoordinates(userLocation),
  ).replace(/</g, "\\u003c");

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
          const userLocation = ${userLocationJSON};
          const defaultCenter = [49.2827, -123.1207];
          const initialCenter = userLocation
            ? [userLocation.latitude, userLocation.longitude]
            : defaultCenter;

          const map = L.map("map", {
            dragging: false,
            touchZoom: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            boxZoom: false,
            keyboard: false,
            zoomControl: false,
          }).setView(initialCenter, 13);

          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          }).addTo(map);

          if (userLocation) {
            L.marker([
              userLocation.latitude,
              userLocation.longitude,
            ]).addTo(map);
          }
        </script>
      </body>
    </html>
  `;
  const source = useMemo(() => ({ html: mapHTML }), [mapHTML]);

  return (
    <WebView
      style={mapStyles.webView}
      pointerEvents="none"
      originWhitelist={["*"]}
      source={source}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
}
