import React, { useState } from "react";
import L from "leaflet"; // Import Leaflet for map-related functionality

const ShelterForm = ({ map }) => {
  const [shelterName, setShelterName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [resources, setResources] = useState([
    { type: "Food", availability: "Available", selected: false },
    { type: "Water", availability: "Available", selected: false },
    { type: "Clothes", availability: "Available", selected: false },
    { type: "Other", availability: "Available", selected: false, custom: "" },
  ]);

  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...resources];
    if (field === "selected") {
      updatedResources[index].selected = value;
    } else if (field === "availability") {
      updatedResources[index].availability = value;
    } else if (field === "custom") {
      updatedResources[index].custom = value;
    }
    setResources(updatedResources);
  };

  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      address
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("Address not found");
    }
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedResources = resources
      .filter((resource) => resource.selected)
      .map((resource) => ({
        type: resource.type === "Other" ? resource.custom : resource.type,
        availability: resource.availability,
      }));

    if (!shelterName || !capacity || !location || selectedResources.length === 0) {
      alert("Please fill out all fields and select at least one resource.");
      return;
    }

    try {
      // Get latitude and longitude for the entered location
      const { lat, lon } = await geocodeAddress(location);

      // Add shelter marker to the map
      if (map) {
        const shelterIcon = L.icon({
          iconUrl: "/images/shelter-marker.png", // Custom marker image in the public folder
          iconSize: [30, 40], // Adjust the size of the icon
          iconAnchor: [15, 40], // Anchor point of the icon
          popupAnchor: [0, -40], // Position of the popup relative to the icon
        });

        const marker = L.marker([lat, lon], { icon: shelterIcon }).addTo(map);
        const popupContent = `
          <strong>${shelterName}</strong><br>
          Capacity: ${capacity}<br>
          Location: ${location}<br>
          Resources:<br>
          <ul>
            ${selectedResources
              .map((res) => `<li>${res.type} - ${res.availability}</li>`)
              .join("")}
          </ul>
        `;
        marker.bindPopup(popupContent).openPopup();
      }

      // Clear form
      setShelterName("");
      setCapacity("");
      setLocation("");
      setPhoto(null);
      setResources(
        resources.map((res) => ({
          ...res,
          selected: false,
          availability: "Available",
          custom: res.type === "Other" ? "" : res.custom,
        }))
      );

      alert("Shelter added successfully!");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Shelter Information</h2>
      <div className="form-group">
        <label>Shelter Name:</label>
        <input
          type="text"
          value={shelterName}
          onChange={(e) => setShelterName(e.target.value)}
          placeholder="Enter shelter name"
        />
      </div>
      <div className="form-group">
        <label>Capacity:</label>
        <input
          type="number"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          placeholder="Enter capacity"
        />
      </div>
      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <div className="form-group">
        <label>Attach Photo:</label>
        <input
          type="file"
          onChange={(e) => setPhoto(e.target.files[0])}
        />
      </div>
      <div className="form-group">
        <h3>Resources</h3>
        {resources.map((resource, index) => (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                checked={resource.selected}
                onChange={(e) =>
                  handleResourceChange(index, "selected", e.target.checked)
                }
              />
              {resource.type}
            </label>
            {resource.type === "Other" && resource.selected && (
              <input
                type="text"
                placeholder="Enter resource name"
                value={resource.custom}
                onChange={(e) =>
                  handleResourceChange(index, "custom", e.target.value)
                }
              />
            )}
            {resource.selected && (
              <select
                value={resource.availability}
                onChange={(e) =>
                  handleResourceChange(index, "availability", e.target.value)
                }
              >
                <option value="Available">Available</option>
                <option value="Full">Full</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            )}
          </div>
        ))}
      </div>
      <button type="submit">Add Shelter</button>
    </form>
  );
};

export default ShelterForm;
