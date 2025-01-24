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

// Custom marker icons
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

const Map = ({ setFormCoordinates, incidents, setIncidents, setSelectedIncident, formCoordinates }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({}); // Track markers by incident ID
  const manualMarkerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return; // Prevent map re-initialization

    const map = L.map("map").setView([45.815399, 15.966568], 13);
    mapRef.current = map;

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

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    incidents.forEach((incident) => {
      // Remove the old marker if it exists
      if (markersRef.current[incident.id]) {
        map.removeLayer(markersRef.current[incident.id]);
      }

      /*// Add a new marker with updated priority
      const marker = L.marker([incident.latitude, incident.longitude], {
        icon: markerIcons[incident.priority || "default"],
      }).addTo(map);
*/
const lat = incident.latitude;
  const lng = incident.longitude;

  if (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)) {
    const marker = L.marker([lat, lng], {
      icon: markerIcons[incident.priority || "default"],
    }).addTo(map);
      markersRef.current[incident.id] = marker; // Track the marker by incident ID
 
      const renderPopupContent = () => `
        <strong>${incident.type}</strong><br>
        ${incident.description}
        ${
          incident.photo
            ? `<br><img src="${incident.photo}" alt="Incident Photo" style="width:100px;height:auto;" />`
            : ""
        }
        ${incident.additionalInfo ? `<br><em>Details:</em> ${incident.additionalInfo}` : ""}
        ${incident.priority ? `<br><strong>Priority:</strong> ${incident.priority}` : ""}
        <br>
        <button class="priority-button red-button" data-id="${incident.id}" data-priority="red">Very Dangerous</button>
        <button class="priority-button orange-button" data-id="${incident.id}" data-priority="orange">Dangerous</button>
        <button class="priority-button green-button" data-id="${incident.id}" data-priority="green">Not So Dangerous</button>
        <br>
        <button class="accept-button" data-id="${incident.id}">Accept</button>
        <button class="reject-button" data-id="${incident.id}">Reject</button>
      `;

      marker.bindPopup(renderPopupContent());

      marker.on("popupopen", () => {
        // Handle priority updates
        document
          .querySelector(`.priority-button.red-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "red" } : inc))
            );
            marker.setIcon(markerIcons.red);
            map.closePopup();
          });

        document
          .querySelector(`.priority-button.orange-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "orange" } : inc))
            );
            marker.setIcon(markerIcons.orange);
            map.closePopup();
          });

        document
          .querySelector(`.priority-button.green-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "green" } : inc))
            );
            marker.setIcon(markerIcons.green);
            map.closePopup();
          });

        // Handle accept and reject buttons
        document
          .querySelector(`.accept-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setSelectedIncident(incident);
            map.closePopup();
          });

        document
          .querySelector(`.reject-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) => prev.filter((inc) => inc.id !== incident.id));
            map.removeLayer(marker);
          });
      });}else{console.error("Invalid coordinates for incident:", incident);}
    }); 
  }, [incidents, setIncidents, setSelectedIncident]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default Map;
