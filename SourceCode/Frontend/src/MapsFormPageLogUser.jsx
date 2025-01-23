import React, { useEffect, useState, useRef } from 'react';
import './styles/MapsForm.css';

// Function to dynamically load Leaflet CSS
const loadLeafletCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);
};

// Function to dynamically load Leaflet JS
const loadLeafletJS = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;

    script.onload = () => resolve(window.L); // Leaflet attaches itself to window.L
    script.onerror = () => reject(new Error('Failed to load Leaflet JS'));
    document.body.appendChild(script);
  });
};

const IncidentReport = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('reports')) || []);
  const [manualLocation, setManualLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [manualLocationSet, setManualLocationSet] = useState(false);
  const [leaflet, setLeaflet] = useState(null);

  useEffect(() => {
    loadLeafletCSS();
    loadLeafletJS()
      .then((L) => {
        setLeaflet(L);
  
        // Initialize the map
        const map = L.map('map').setView([45.815399, 15.966568], 13);
  
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);
  
        // Display existing reports
        reports.forEach((report) => {
          addMarker(map, report, L);
        });
  
        // Track user's current location and add a red marker
        if (navigator.geolocation) {
          navigator.geolocation.watchPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setCurrentLocation([latitude, longitude]);
  
              // Set map view to user's current location
              map.setView([latitude, longitude], 15);
  
              // Add a red marker at the current location
              const redMarker = L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: 'https://cdn-icons-png.flaticon.com/512/252/252025.png', // Example red marker icon
                  iconSize: [30, 30],
                }),
              }).addTo(map);
              redMarker.bindPopup('You are here').openPopup();
            },
            (error) => console.error('Geolocation error:', error.message),
            { enableHighAccuracy: true }
          );
        }
  
        mapRef.current = map;
  
        return () => map.remove();
      })
      .catch((error) => console.error('Error loading Leaflet:', error));
  }, [reports]);
  const addMarker = (map, report, L) => {
    L.marker([report.latitude, report.longitude])
      .addTo(map)
      .bindPopup(`
        <strong>${report.type.toUpperCase()}</strong><br>
        ${report.description || 'No description provided.'}<br>
        ${
          report.photo
            ? `<img src="${report.photo}" alt="Incident" style="width:100%;max-width:200px;">`
            : ''
        }
      `);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const type = e.target.type.value;
    const description = e.target.description.value;
    const address = e.target.address.value;
    const useCurrentLocation = e.target['use-current-location'].checked;
  
    let lat, lon;
  
    if (useCurrentLocation && currentLocation) {
      [lat, lon] = currentLocation;
    } else if (manualLocation) {
      [lat, lon] = manualLocation;
    } else {
      try {
        const location = await geocodeAddress(address);
        lat = location.lat;
        lon = location.lon;
      } catch (error) {
        alert('Error: ' + error.message);
        return;
      }
    }
  
    const newReport = { type, description, address, latitude: lat, longitude: lon, photo };
    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
  
    if (mapRef.current) {
      addMarker(mapRef.current, newReport, leaflet);
    }
  
    alert('Incident reported successfully!');
    e.target.reset();
    setPhoto(null);
  
    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      setManualLocation(null);
      setManualLocationSet(false);
    }
  };

  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.length) {
      throw new Error('Address not found');
    }
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  };

  const reverseGeocode = async (lat, lon) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    throw new Error('Unable to fetch address');
  };
  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;
  
    if (isChecked && currentLocation) {
      const [lat, lon] = currentLocation;
  
      try {
        const address = await reverseGeocode(lat, lon);
        document.getElementById('address').value = address || 'Unknown Location';
      } catch (error) {
        document.getElementById('address').value = 'Unable to fetch address';
        console.error('Reverse geocoding error:', error.message);
      }
    } else {
      document.getElementById('address').value = '';
    }
  };
  

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleManualLocation = () => {
    if (!manualLocationSet) {
      alert('Click on the map to set a location, then drag the marker to fine-tune.');
      setManualLocationSet(true);
  
      mapRef.current.on('click', handleMapClick);
    } else {
      if (markerRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      setManualLocation(null);
      setManualLocationSet(false);
  
      // Clear the address textbox
      document.getElementById('address').value = '';
  
      mapRef.current.off('click', handleMapClick);
    }
  };

  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
    }

    const marker = leaflet.marker([lat, lng], { draggable: true }).addTo(mapRef.current);

    marker.on('dragend', async (e) => {
      const { lat, lng } = e.target.getLatLng();
      setManualLocation([lat, lng]);
      try {
        const address = await reverseGeocode(lat, lng);
        document.getElementById('address').value = address || 'Unknown Location';
      } catch {
        document.getElementById('address').value = 'Unknown Location';
      }
    });

    markerRef.current = marker;
    setManualLocation([lat, lng]);

    try {
      const address = await reverseGeocode(lat, lng);
      document.getElementById('address').value = address || 'Unknown Location';
    } catch {
      document.getElementById('address').value = 'Unknown Location';
    }
  };

  return (
    <div>
      <header>
        <h1>Crisis Guard</h1>
      </header>

      <div id="map-container">
        <div id="map"></div>
      </div>

      <section id="controls">
        <h2>Report an Incident</h2>
        <form id="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Type of Incident:</label>
            <select id="type" name="type">
              <option value="fire">Fire</option>
              <option value="flood">Flood</option>
              <option value="earthquake">Earthquake</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter incident details"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <div className="address-group">
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter address"
              />
              <button
                type="button"
                id="manual-location-button"
                onClick={handleManualLocation}
              >
                {manualLocationSet ? 'Clear Location' : 'Set Location Manually'}
              </button>
            </div>
            <div className="checkbox-group">
              <input type="checkbox" id="use-current-location" onChange={handleCheckboxChange}/>
              <label htmlFor="use-current-location">Use Current Location</label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="photo">Attach Photo:</label>
            <input type="file" id="photo" name="photo" onChange={handlePhotoChange} />
          </div>

          <button type="submit">Submit Report</button>
        </form>
      </section>

      <footer>
        <p>&copy; 2024 Crisis Guard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default IncidentReport;












