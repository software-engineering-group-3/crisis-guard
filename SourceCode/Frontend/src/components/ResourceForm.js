import React, { useState } from "react";

function ResourceForm() {
  const [resourceType, setResourceType] = useState("food");
  const [quantity, setQuantity] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Resource: ${resourceType}, Quantity: ${quantity}, Location: ${location}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="resource-type">Resource Type:</label>
        <select
          id="resource-type"
          value={resourceType}
          onChange={(e) => setResourceType(e.target.value)}
        >
          <option value="food">Food</option>
          <option value="water">Water</option>
          <option value="shelter">Shelter</option>
          <option value="medical">Medical Supplies</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter quantity"
        />
      </div>
      <div className="form-group">
        <label htmlFor="location">Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
        />
      </div>
      <button type="submit">Add Resource</button>
    </form>
  );
}

export default ResourceForm;
