import React, { useEffect, useState } from "react";
import Map from "./components/Map";
import IncidentCreationForm from "./components/IncidentCreationForm";
import IncidentDetailsForm from "./components/IncidentDetailsForm";
import "./styles/IncidentReportG.css";

function IncidentReportG() {
  const [map, setMapInstance] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [formCoordinates, setFormCoordinates] = useState(null); // For adding new markers
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]); // State for reports

  const INCIDENTS_API_URL = "https://crisisguard-backend-server.azuremicroservices.io/api/incidents";
  const REPORTS_API_URL = "https://crisisguard-backend-server.azuremicroservices.io/api/reports";

  // Fetch incidents from the backend
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(INCIDENTS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch incidents");
        }
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error("Error fetching incidents:", error.message);
      }
    };

    fetchIncidents();
  }, []);

  // Fetch reports from the backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(REPORTS_API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);

  // Add a new incident and send it to the backend
  const handleAddIncident = async (newIncident) => {
    try {
      const response = await fetch(INCIDENTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIncident),
      });

      if (!response.ok) {
        throw new Error("Failed to add incident");
      }

      const createdIncident = await response.json();
      setIncidents((prevIncidents) => [...prevIncidents, createdIncident]);
      setFormCoordinates(null); // Clear coordinates after adding
    } catch (error) {
      console.error("Error adding incident:", error.message);
    }
  };

  // Save additional details for an incident (via /api/reports)
  const handleSaveDetails = async (incidentId, additionalInfo) => {
    try {
      const reportPayload = { incidentId, additionalInfo };

      const response = await fetch(REPORTS_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reportPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to save report details");
      }

      const createdReport = await response.json();
      setReports((prevReports) => [...prevReports, createdReport]);
      setSelectedIncident(null); // Clear the form after saving
    } catch (error) {
      console.error("Error saving report details:", error.message);
    }
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
