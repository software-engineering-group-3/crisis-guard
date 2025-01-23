import React, { useState } from "react";

const ResourceForm = () => {
    const [resourceType, setResourceType] = useState("Food");
    const [quantity, setQuantity] = useState("");
    const [location, setLocation] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (quantity < 0) {
            alert("Quantity cannot be negative!");
            return;
        }
        alert(`Resource Added:\nType: ${resourceType}\nQuantity: ${quantity}\nLocation: ${location}`);
        // Clear the form after submission
        setResourceType("Food");
        setQuantity("");
        setLocation("");
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Manage Resources</h2>
            <div className="form-group">
                <label>Resource Type:</label>
                <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
                    <option value="Food">Food</option>
                    <option value="Water">Water</option>
                    <option value="Shelter">Shelter</option>
                    <option value="Medical Supplies">Medical Supplies</option>
                </select>
            </div>
            <div className="form-group">
                <label>Quantity:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
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
            <button type="submit">Add Resource</button>
        </form>
    );
};

export default ResourceForm;
