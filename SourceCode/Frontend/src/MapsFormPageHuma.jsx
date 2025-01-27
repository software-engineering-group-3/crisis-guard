import React, { useEffect, useState } from "react";
import Map from "./components/MapH";
import ShelterForm from "./components/ShelterForm";
import IncidentDetailsForm from "./components/IncidentDetailsFormH";
import "./styles/IncidentReportH.css";

function IncidentReportH() {
  const [map, setMapInstance] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [reports, setReports] = useState([]); 

  const INCIDENTS_API_URL = "https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/disaster/";
  const REPORTS_API_URL = "https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/report/";

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
      setSelectedIncident(null); 
    } catch (error) {
      console.error("Error saving report details:", error.message);
    }
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
            reports={reports}
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
