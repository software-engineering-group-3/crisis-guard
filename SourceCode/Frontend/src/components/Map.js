import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const markerIcons = {
  red: L.icon({
    iconUrl: require("../assets/marker-icon-red.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  orange: L.icon({
    iconUrl: require("../assets/marker-icon-orange.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  green: L.icon({
    iconUrl: require("../assets/marker-icon-green.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
  default: L.icon({
    iconUrl: require("leaflet/dist/images/marker-icon.png"),
    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  }),
};

function getIconBySeverity(sev) {
  switch (sev) {
    case "VERY_LOW":
    case "LOW":
      return markerIcons.red;
    case "MEDIUM":
    case "HIGH":
      return markerIcons.orange;
    case "VERY_HIGH":
    case "CRITICAL":
      return markerIcons.green;
    default:
      return markerIcons.default;
  }
}

const Map = ({ setMapInstance, setFormCoordinates, incidents, setIncidents, setSelectedIncident, formCoordinates, reports }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Track markers by incident ID
  const manualMarkerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent map re-initialization

    const map = L.map("map").setView([45.815399, 15.966568], 13);
    mapRef.current = map;
    setMapInstance(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Handle map click to place a marker
    map.on("click", async (e) => {
      const { lat, lng } = e.latlng;

      // Add or move the manual marker
      if (manualMarkerRef.current) {
        manualMarkerRef.current.setLatLng(e.latlng);
      } else {
        const manualMarker = L.marker([lat, lng], { icon: markerIcons.default }).addTo(map);
        manualMarkerRef.current = manualMarker;

        // Handle marker removal on click
        manualMarker.on("click", () => {
          map.removeLayer(manualMarker);
          manualMarkerRef.current = null;
          setFormCoordinates(null); // Clear form coordinates
        });
      }

      // Fetch the address for the clicked location
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
        );
        setFormCoordinates({
          lat,
          lng,
          address: response.data.display_name || "Unknown Location",
        });
      } catch {
        setFormCoordinates({
          lat,
          lng,
          address: "Unknown Location",
        });
      }
    });
  }, [setFormCoordinates]);

  useEffect(() => {
    if (formCoordinates && mapRef.current) {
      const map = mapRef.current;

      // Add or move the manual marker
      if (manualMarkerRef.current) {
        manualMarkerRef.current.setLatLng([formCoordinates.lat, formCoordinates.lng]);
      } else {
        const manualMarker = L.marker([formCoordinates.lat, formCoordinates.lng], {
          icon: markerIcons.default,
        }).addTo(map);
        manualMarkerRef.current = manualMarker;

        // Allow marker removal on click
        manualMarker.on("click", () => {
          map.removeLayer(manualMarker);
          manualMarkerRef.current = null;
          setFormCoordinates(null); // Clear form coordinates
        });
      }

      // Center the map to the submitted location
      map.setView([formCoordinates.lat, formCoordinates.lng], 13);
    }
  }, [formCoordinates, setFormCoordinates]);

  if (mapRef.current) {
    const map = mapRef.current;

    incidents.forEach((incident) => {
      if (markersRef.current[incident.coords]) {
        map.removeLayer(markersRef.current[incident.coords]);
      }
      var lat = incident.coords.split(", ")[0];
      var lon = incident.coords.split(", ")[1];

      if (lat != null && lon != null) {
        const marker = L.marker([lat, lon], {
          icon: getIconBySeverity(incident.severity),
        }).addTo(map);

        markersRef.current[incident.coords] = marker;

        const renderPopupContent = () => `
        <strong>${incident.type_dis_id}</strong><br>
        ${incident.additionalInfo ? `<em>Details:</em> ${incident.additionalInfo}<br>` : ""}
        <strong>Priority:</strong> ${incident.severity || "None"}<br>
      `;

        marker.bindPopup(renderPopupContent());

      } else { console.error("Invalid coordinates for incident:", incident); }
    });

    reports.forEach((report) => {
      if (markersRef.current[report.coords]) {
        map.removeLayer(markersRef.current[report.coords]);
      }
      const lat = report.coords.split(", ")[0];
      const lon = report.coords.split(", ")[1];

      if (lat != null && lon != null) {
        const marker = L.marker([lat, lon], {
          icon: markerIcons.default,
        }).addTo(map);

        markersRef.current[report.coords] = marker;

        const renderPopupContent = () => `
      <strong>Report</strong><br>
      ${report.desc_report}
    `;

        marker.bindPopup(renderPopupContent());

        marker.on("popupopen", () => {
          document.querySelector(`.accept-button[data-id="${report.coords}"]`)
            ?.addEventListener("click", () => {
              setSelectedIncident(incident);
              map.closePopup();
            });

          document.querySelector(`.reject-button[data-id="${report.coords}"]`)
            ?.addEventListener("click", () => {
              setIncidents((prev) => prev.filter((inc) => inc.coords !== report.coords));
              map.removeLayer(marker);
            });
        });
      }
    });
  }

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default Map;
