import React, { useState } from "react";
import Map from "./components/MapH";
import ShelterForm from "./components/ShelterForm";
import IncidentDetailsForm from "./components/IncidentDetailsFormH";
import "./styles/IncidentReportH.css";

function IncidentReportH() {
  const [map, setMapInstance] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      latitude: 51.505,
      longitude: -0.09,
      type: "Flood",
      description: "Severe flooding reported.",
      additionalInfo: "",
      priority: "red",
    },
    {
      id: 2,
      latitude: 51.515,
      longitude: -0.1,
      type: "Fire",
      description: "Major wildfire reported.",
      additionalInfo: "Evacuation in progress.",
      priority: "orange",
    },
    {
      id: 3,
      latitude: 51.525,
      longitude: -0.11,
      type: "Earthquake",
      description: "Tremors felt in the area.",
      additionalInfo: "",
      priority: "green",
    },
  ]);

  const handleSaveDetails = (incidentId, additionalInfo) => {
    setIncidents((prevIncidents) =>
      prevIncidents.map((incident) =>
        incident.id === incidentId ? { ...incident, additionalInfo } : incident
      )
    );
    setSelectedIncident(null); // Clear the form after saving
  };

  return (
    <div className="App">
      <header>
        <h1>Crisis Guard - Humanitarian Organization Dashboard</h1>
      </header>
      <main>
        <div id="map-container">
          <Map
            setMapInstance={setMapInstance}
            incidents={incidents}
            setIncidents={setIncidents}
            setSelectedIncident={setSelectedIncident}
          />
        </div>
        <div className="forms-container">
          <ShelterForm map={map} />
          <IncidentDetailsForm
            selectedIncident={selectedIncident}
            onSaveDetails={handleSaveDetails}
          />
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Crisis Guard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default IncidentReportH;
