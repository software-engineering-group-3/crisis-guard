import React, { useState } from "react";
import Map from "./components/Map";
import IncidentCreationForm from "./components/IncidentCreationForm";
import IncidentDetailsForm from "./components/IncidentDetailsForm";
import "./styles/IncidentReportG.css";

function IncidentReportG() {
  const [map, setMapInstance] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [formCoordinates, setFormCoordinates] = useState(null); // For adding new markers
  const [incidents, setIncidents] = useState([
    {
      id: 1,
      latitude: 51.505,
      longitude: -0.09,
      type: "Flood",
      description: "Severe flooding in the area.",
      additionalInfo: "",
    },
    {
      id: 2,
      latitude: 51.515,
      longitude: -0.1,
      type: "Fire",
      description: "Large wildfire reported.",
      additionalInfo: "",
    },
  ]);

  const handleAddIncident = (newIncident) => {
    setIncidents((prevIncidents) => [
      ...prevIncidents,
      { ...newIncident, id: prevIncidents.length + 1 }, // Auto-generate an ID
    ]);
    setFormCoordinates(null); // Clear coordinates after adding
  };

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
        <h1>Crisis Guard - Government Dashboard</h1>
      </header>
      <main>
        <div id="map-container">
          <Map
            setMapInstance={setMapInstance}
            incidents={incidents}
            setIncidents={setIncidents}
            setSelectedIncident={setSelectedIncident}
            setFormCoordinates={setFormCoordinates} // For adding new markers
          />
        </div>
        <div className="forms-container">
          <IncidentDetailsForm
            selectedIncident={selectedIncident}
            onSaveDetails={handleSaveDetails}
          />
          <IncidentCreationForm
            onAddIncident={handleAddIncident}
            formCoordinates={formCoordinates}
            setFormCoordinates={setFormCoordinates}
          />
        </div>
      </main>
      <footer>
        <p>&copy; 2024 Crisis Guard. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default IncidentReportG;