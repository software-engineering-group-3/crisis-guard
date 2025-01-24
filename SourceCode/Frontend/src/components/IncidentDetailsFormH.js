import React, { useState, useEffect } from "react";

const IncidentDetailsFormH = ({ selectedIncident, onSaveDetails }) => {
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (selectedIncident) {
      setAdditionalInfo(selectedIncident.additionalInfo || "");
    }
  }, [selectedIncident]);

  if (!selectedIncident) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveDetails(selectedIncident.id, additionalInfo);
    setAdditionalInfo("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Incident Details</h2>
      <div>
        <strong>Type:</strong> {selectedIncident.type}
      </div>
      <div>
        <strong>Description:</strong> {selectedIncident.description}
      </div>
      <div className="form-group">
        <label>Additional Info:</label>
        <textarea
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add more details"
          required
        />
      </div>
      <button type="submit">Save Details</button>
    </form>
  );
};

export default IncidentDetailsFormH;
