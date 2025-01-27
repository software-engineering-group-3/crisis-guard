import React, { useState, useEffect } from "react";

const IncidentDetailsFormH = ({ selectedIncident, onSaveDetails }) => {
  const [additionalInfo, setAdditionalInfo] = useState("");

  useEffect(() => {
    if (selectedIncident) {
      setAdditionalInfo(selectedIncident.description || "");
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
        <strong>Type:</strong> {selectedIncident.type_dis_id}
      </div>
      <div className="form-group">
        <label>Description:</label>
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
