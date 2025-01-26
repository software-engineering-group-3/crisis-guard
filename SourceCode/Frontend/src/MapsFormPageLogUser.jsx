import React, { useEffect, useState, useRef } from 'react';
import Map from './components/Map';
import './styles/MapsForm.css';

const loadLeafletCSS = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  link.crossOrigin = '';
  document.head.appendChild(link);
};

const loadLeafletJS = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.async = true;

    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error('Failed to load Leaflet JS'));
    document.body.appendChild(script);
  });
};

const IncidentReportU = () => {
  const markerRef = useRef(null);
  const [map, setMapInstance] = useState(null);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [reports, setReports] = useState([]);
  const [manualLocation, setManualLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [manualLocationSet, setManualLocationSet] = useState(false);
  const [leaflet, setLeaflet] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const INCIDENTS_API_URL = "https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/disaster/";
  const REPORTS_API_URL = "https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/report/";

  useEffect(() => {
    loadLeafletCSS();
    loadLeafletJS()
      .then((L) => {
        setLeaflet(L);

        const map = L.map('map').setView([45.815399, 15.966568], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        return () => map.remove();
      })
      .catch((error) => console.error('Error loading Leaflet:', error));
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const type_dis_id = e.target.type.value;
    const desc_report = e.target.description.value;
    const address = e.target.address.value;
    const useCurrentLocation = e.target['use-current-location'].checked;

    let lat, lon;
    if (useCurrentLocation && currentLocation) {
      lat = currentLocation.lat;
      lon = currentLocation.lng;
    } else if (manualLocation) {
      lat = manualLocation.lat;
      lon = manualLocation.lng;
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

    const coords = `${lat}, ${lon}`;
    const report_severity = 3; // Replace with a dynamic severity mapping if needed
    const time_start = new Date().toISOString(); // Current timestamp
    const usr_id = 1; // Replace with the logged-in user ID if available

    var photo_validated = photo ? photo : "no photo";

    const newReport = {
      report_severity,
      desc_report,
      photo: photo_validated,
      usr_id,
      time_start,
      coords,
      type_dis_id,
    };

    try {
      const response = await fetch('https://crisis-guard-backend-a9cf5dc59b34.herokuapp.com/report/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReport),
        mode: "cors" // Ensures the request uses CORS
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }
      alert('Incident reported successfully!');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit the report. Please try again.');
    }

    e.target.reset();
    setPhoto(null);

    if (markerRef.current) {
      mapRef.current.removeLayer(markerRef.current);
      markerRef.current = null;
      setManualLocation(null);
      setManualLocationSet(false);
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
      map.on('click', handleMapClick);
    } else {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
      setManualLocation(null);
      setManualLocationSet(false);
      map.off('click', handleMapClick);
    }
  };

  const geocodeAddress = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.length) {
      throw new Error("Address not found");
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
    throw new Error("Unable to fetch address");
  };

  const handleCheckboxChange = async (e) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation([latitude, longitude]);
            try {
              const address = await reverseGeocode(latitude, longitude);
              document.getElementById('address').value = address || 'Unknown Location';
            } catch (error) {
              document.getElementById('address').value = 'Unable to fetch address';
            }
          },
          (error) => {
            alert('Geolocation failed: ' + error.message);
          }
        );
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    } else {
      document.getElementById('address').value = '';
    }
  };
  const handleMapClick = async (event) => {
    const { lat, lng } = event.latlng;

    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    const marker = leaflet.marker([lat, lng], { draggable: true }).addTo(map);

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      setManualLocation([lat, lng]);
    });

    markerRef.current = marker;
    setManualLocation([lat, lng]);
  };

  return (
    <div>
      <header>
        <h1>Crisis Guard</h1>
      </header>

      <div id="map-container">
        <Map
            setFormCoordinates={setManualLocation}
            setMapInstance={setMapInstance}
            incidents={incidents}
            setIncidents={setIncidents}
            setSelectedIncident={setSelectedIncident}
            reports={reports}
          />
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
              <input
                type="checkbox"
                id="use-current-location"
                onChange={handleCheckboxChange}
              />
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

export default IncidentReportU;
