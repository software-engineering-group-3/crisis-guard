/*import React, { useState } from "react";
import axios from "axios";

const IncidentCreationForm = ({ onAddIncident, formCoordinates, setFormCoordinates }) => {
  const [type, setType] = useState("Fire");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [manualAddress, setManualAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let coordinates = formCoordinates;
    if (!coordinates || typeof coordinates.lat !== "number" || typeof coordinates.lng !== "number") {
      alert("Invalid location. Please enter a valid address or place a marker.");
      return;
    }
    
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

    const incidentData = new FormData(); // Use FormData for handling file uploads
    incidentData.append("type", type);
    incidentData.append("description", description);
    incidentData.append("address", coordinates.address || "Unknown Location");
    incidentData.append("latitude", coordinates.lat);
    incidentData.append("longitude", coordinates.lng);
  
    // Only append the photo if it exists
    if (photo) {
      incidentData.append("photo", photo);
    }
  
    // Pass the FormData object to the parent function
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

export default IncidentCreationForm;*/

import React, { useState } from "react";
import axios from "axios";

const IncidentCreationForm = ({ onAddIncident, formCoordinates, setFormCoordinates }) => {
  const [type, setType] = useState("Fire");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please upload a smaller image.");
      setPhoto(null);
    } else {
      setPhoto(file);
    }
  };

  const resetForm = () => {
    setType("Fire");
    setDescription("");
    setPhoto(null);
    setManualAddress("");
    setFormCoordinates(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    let coordinates = formCoordinates;
  
    // Validate coordinates or manually entered address
    if (!coordinates || typeof coordinates.lat !== "number" || typeof coordinates.lng !== "number") {
      if (!manualAddress.trim()) {
        alert("Please place a marker on the map or enter an address.");
        setIsSubmitting(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            manualAddress
          )}&format=json&addressdetails=1&limit=1`
        );
        if (response.data.length === 0) {
          alert("No results found for the entered address. Please try again.");
          setIsSubmitting(false);
          return;
        }
        const location = response.data[0];
        coordinates = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
          address: location.display_name || "Unknown Location",
        };
        setFormCoordinates(coordinates);
      } catch (error) {
        console.error(error);
        alert("Error occurred while fetching location. Please check your address and try again.");
        setIsSubmitting(false);
        return;
      }
    }
  
    // Verify coordinates format before submitting
    if (typeof coordinates.lat !== "number" || typeof coordinates.lng !== "number") {
      alert("Invalid location data. Please re-enter or select a valid location.");
      setIsSubmitting(false);
      return;
    }
  
    // Create FormData for submission
    const incidentData = new FormData();
    incidentData.append("type", type);
    incidentData.append("description", description);
    incidentData.append("address", coordinates.address || "Unknown Location");
    incidentData.append("latitude", coordinates.lat);
    incidentData.append("longitude", coordinates.lng);
  
    if (photo) {
      incidentData.append("photo", photo);
    }
  
    // Submit data
    try {
      await onAddIncident(incidentData);
      alert("Incident reported successfully!");
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Failed to submit the incident. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <h2>Report an Incident</h2>
      <div className="form-group">
        <label htmlFor="incident-type">Type of Incident:</label>
        <select
          id="incident-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        >
          <option value="Fire">Fire</option>
          <option value="Flood">Flood</option>
          <option value="Earthquake">Earthquake</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="incident-description">Description:</label>
        <textarea
          id="incident-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter incident details"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="incident-address">Address:</label>
        <input
          id="incident-address"
          type="text"
          value={manualAddress}
          onChange={(e) => setManualAddress(e.target.value)}
          placeholder="Enter address or click on the map to set location"
        />
      </div>
      <div className="form-group">
        <label htmlFor="incident-photo">Attach Photo:</label>
        <input
          id="incident-photo"
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
        />
      </div>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default IncidentCreationForm;

