import React, { useState, useEffect } from "react";

const IncidentDetailsForm = ({ selectedIncident, onSaveDetails }) => {
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (selectedIncident) {
      setAdditionalInfo(selectedIncident.additionalInfo || ""); // Load existing details
    }
  }, [selectedIncident]);

  if (!selectedIncident) return null; // Hide the form if no incident is selected

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveDetails(selectedIncident.id, additionalInfo); // Save details
    setAdditionalInfo(""); // Clear input
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Details for Incident</h2>
      <div className="form-group">
        <label>Type:</label>
        <p>{selectedIncident.type}</p>
      </div>
      <div className="form-group">
        <label>Description:</label>
        <p>{selectedIncident.description}</p>
      </div>
      <div className="form-group">
        <label>Additional Information:</label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Enter additional details"
          required
        />
      </div>
      <button type="submit">Save Details</button>
    </form>
  );
};

export default IncidentDetailsForm;
