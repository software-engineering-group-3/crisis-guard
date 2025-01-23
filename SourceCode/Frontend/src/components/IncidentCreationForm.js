import React, { useState } from "react";
import axios from "axios";

const IncidentCreationForm = ({ onAddIncident, formCoordinates, setFormCoordinates }) => {
  const [type, setType] = useState("Fire");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [manualAddress, setManualAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coordinates = formCoordinates;

    if (!coordinates || !coordinates.lat || !coordinates.lng) {
      // Geocode the manually entered address if no marker is placed
      if (!manualAddress.trim()) {
        alert("Please place a marker on the map or enter an address.");
        return;
      }
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            manualAddress
          )}&format=json&addressdetails=1&limit=1`
        );
        if (response.data.length > 0) {
          const location = response.data[0];
          coordinates = {
            lat: parseFloat(location.lat),
            lng: parseFloat(location.lon),
            address: location.display_name || "Unknown Location",
          };
          setFormCoordinates(coordinates); // Update form coordinates
        } else {
          alert("Unable to find the entered address. Please try again.");
          return;
        }
      } catch (error) {
        alert("Failed to fetch location for the entered address.");
        return;
      }
    }

    const incidentData = {
      type,
      description,
      address: coordinates.address || "Unknown Location",
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      photo: photo ? URL.createObjectURL(photo) : null,
    };

    onAddIncident(incidentData);

    // Reset form
    setType("Fire");
    setDescription("");
    setPhoto(null);
    setManualAddress("");
    setFormCoordinates(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report an Incident</h2>
      <div className="form-group">
        <label>Type of Incident:</label>
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Fire">Fire</option>
          <option value="Flood">Flood</option>
          <option value="Earthquake">Earthquake</option>
        </select>
      </div>
      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter incident details"
          required
        />
      </div>
      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="Enter address or click on the map to set location"
        />
      </div>
      <div className="form-group">
        <label>Attach Photo:</label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      </div>
      <button type="submit">Submit Report</button>
    </form>
  );
};

export default IncidentCreationForm;
