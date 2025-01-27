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

const MapH = ({ setFormCoordinates, incidents, setIncidents, setSelectedIncident, reports }) => {
  const mapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([45.815399, 15.966568], 13);
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);
  }, []);

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
        <div style="margin-top: 10px;">
          <button class="priority-button red-button" data-id="${incident.coords}" data-priority="red">Very Dangerous</button>
          <button class="priority-button orange-button" data-id="${incident.coords}" data-priority="orange">Dangerous</button>
          <button class="priority-button green-button" data-id="${incident.coords}" data-priority="green">Not So Dangerous</button>
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
        });
      } else { console.error("Invalid coordinates for incident:", incident); }
    });

    reports.forEach((report) => {
      if (markersRef.current[report.coords]) {
        map.removeLayer(markersRef.current[report.coords]);
      }
    
      // Ensure that lat and lon are parsed as floats to avoid string-to-number mismatch
      const [lat, lon] = report.coords.split(", ").map(coord => parseFloat(coord));
    
      if (!isNaN(lat) && !isNaN(lon)) {
        const marker = L.marker([lat, lon], {
          icon: markerIcons.default,
        }).addTo(map);
    
        markersRef.current[report.coords] = marker;
    
        const renderPopupContent = () => `
          <strong>Report</strong><br>
          <div style="margin-top: 10px;">
            <button class="accept-button" data-id="${report.coords}">Accept</button>
            <button class="reject-button" data-id="${report.coords}">Reject</button>
          </div>
          ${report.desc_report}
        `;
    
        marker.bindPopup(renderPopupContent());
    
        marker.on("popupopen", () => {
          document.querySelector(`.accept-button[data-id="${report.coords}"]`)
            ?.addEventListener("click", () => {
              setSelectedIncident(report);
              map.closePopup();
            });
    
          document.querySelector(`.reject-button[data-id="${report.coords}"]`)
            ?.addEventListener("click", async () => {
              setIncidents((prev) => prev.filter((inc) => inc.coords !== report.coords));
              map.removeLayer(marker);
              //await fetch("https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/report/delete/" + report.usr_id + "/" + report.time_start + "/" + report.coords + "/" + report.type_dis_id , { method: "DELETE" });
              await fetch(`https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/report/delete/${report.usr_id}/${report.time_start}/${report.coords}/${report.type_dis_id}`, { method: "DELETE" });

            });
        });
      }
    });
    
  }

  return <div id="map" style={{ width: "100%", height: "500px" }}></div>;
};

export default MapH;
