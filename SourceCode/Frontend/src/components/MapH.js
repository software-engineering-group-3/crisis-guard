import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const MapH = ({ setFormCoordinates, incidents, setIncidents, setSelectedIncident }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([51.505, -0.09], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    incidents.forEach((incident) => {
      if (markersRef.current[incident.id]) {
        map.removeLayer(markersRef.current[incident.id]);
      }

      const marker = L.marker([incident.latitude, incident.longitude], {
        icon: markerIcons[incident.priority || "default"],
      }).addTo(map);

      markersRef.current[incident.id] = marker;

      const renderPopupContent = () => `
        <strong>${incident.type}</strong><br>
        ${incident.description}
        ${incident.additionalInfo ? `<em>Details:</em> ${incident.additionalInfo}<br>` : ""}
        <strong>Priority:</strong> ${incident.priority || "None"}<br>
        <div style="margin-top: 10px;">
          <button class="priority-button red-button" data-id="${incident.id}" data-priority="red">Very Dangerous</button>
          <button class="priority-button orange-button" data-id="${incident.id}" data-priority="orange">Dangerous</button>
          <button class="priority-button green-button" data-id="${incident.id}" data-priority="green">Not So Dangerous</button>
        </div>
        <div style="margin-top: 10px;">
          <button class="accept-button" data-id="${incident.id}">Accept</button>
          <button class="reject-button" data-id="${incident.id}">Reject</button>
        </div>
      `;

      marker.bindPopup(renderPopupContent());

      marker.on("popupopen", () => {
        document.querySelector(`.priority-button.red-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "red" } : inc))
            );
            marker.setIcon(markerIcons.red);
            map.closePopup();
          });

        document.querySelector(`.priority-button.orange-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "orange" } : inc))
            );
            marker.setIcon(markerIcons.orange);
            map.closePopup();
          });

        document.querySelector(`.priority-button.green-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) =>
              prev.map((inc) => (inc.id === incident.id ? { ...inc, priority: "green" } : inc))
            );
            marker.setIcon(markerIcons.green);
            map.closePopup();
          });

        document.querySelector(`.accept-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setSelectedIncident(incident);
            map.closePopup();
          });

        document.querySelector(`.reject-button[data-id="${incident.id}"]`)
          ?.addEventListener("click", () => {
            setIncidents((prev) => prev.filter((inc) => inc.id !== incident.id));
            map.removeLayer(marker);
          });
      });
    });
  }, [incidents, setIncidents, setSelectedIncident]);

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapH;
