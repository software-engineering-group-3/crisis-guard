// Initialize the map
const map = L.map('map');

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Retrieve reports from localStorage
let reports = JSON.parse(localStorage.getItem('reports')) || [];

// Display existing reports on the map
reports.forEach((report) => {
    addMarker(report);
});

// Create a layer for tracking the user's current location
let currentLocationMarker = null;
let currentLocationCircle = null;

// Manual marker logic
let manualMarker = null;
let manualLocationSet = false; // Track if manual location is set

// Add an event listener for the "Set Location Manually" button
const manualLocationButton = document.getElementById('manual-location-button');
manualLocationButton.addEventListener('click', () => {
    if (!manualLocationSet) {
        // Enable manual location setting
        manualLocationButton.textContent = 'Clear Location';
        alert('Click on the map to set a location, then drag the marker to fine-tune.');

        // Enable map click to place a draggable marker
        map.on('click', onMapClickForManualLocation);
    } else {
        // Clear the manual location
        clearManualLocation();
    }
});

// Function to handle map click for setting manual location
function onMapClickForManualLocation(event) {
    const { lat, lng } = event.latlng;

    // If a manual marker already exists, update its position
    if (manualMarker) {
        manualMarker.setLatLng([lat, lng]);
    } else {
        // Create a draggable pointy marker (blue for manual location)
        manualMarker = L.marker([lat, lng], {
            draggable: true,
            icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default blue marker icon
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                shadowSize: [41, 41],
            }),
        }).addTo(map);

        // Add a click listener to remove the marker
        manualMarker.on('click', clearManualLocation);
    }

    // Update the form inputs with the marker's position
    updateFormWithCoordinates(lat, lng);

    // Set the manual location flag
    manualLocationSet = true;
}

// Function to clear the manual location
function clearManualLocation() {
    if (manualMarker) {
        map.removeLayer(manualMarker); // Remove the marker from the map
        manualMarker = null;
    }

    // Reset the form field
    const addressField = document.getElementById('address');
    if (addressField) {
        addressField.value = '';
    }

    // Reset button text and manual location state
    manualLocationButton.textContent = 'Set Location Manually';
    manualLocationSet = false;

    // Disable further map clicks for manual location setting
    map.off('click', onMapClickForManualLocation);
}

// Function to update the form with the selected coordinates
async function updateFormWithCoordinates(lat, lng) {
    const addressField = document.getElementById('address');
    const address = await reverseGeocode(lat, lng);
    alert(`Location set manually:\nLatitude: ${lat}\nLongitude: ${lng}\nAddress: ${address}`);
    if (addressField) {
        addressField.value = address; // Update the address field with the reverse-geocoded address
    }
}

// Reverse Geocoding Function
async function reverseGeocode(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.display_name) {
        return data.display_name;
    }
    return 'Address not found';
}

// Function to calculate the distance between two coordinates (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Set to store IDs of incidents that have already triggered an alert
const alertedIncidents = new Set();

// Function to check for nearby incidents and display alerts
function checkNearbyIncidents(latitude, longitude) {
    reports.forEach((report, index) => {
        const distance = calculateDistance(latitude, longitude, report.latitude, report.longitude);

        // Check if the incident is within 3 km and has not been alerted yet
        if (distance <= 3 && !alertedIncidents.has(index)) {
            alertedIncidents.add(index); // Mark this incident as alerted
            alert(
                `ALERT: Incident nearby (${distance.toFixed(2)} km)\n` +
                `Type: ${report.type.toUpperCase()}\nDescription: ${report.description}`
            );
        }
    });
}

// Function to update user's location on the map
function updateLocation(position) {
    const { latitude, longitude, accuracy } = position.coords;

    // If a marker already exists, update its position
    if (currentLocationMarker) {
        currentLocationMarker.setLatLng([latitude, longitude]);
        currentLocationCircle.setLatLng([latitude, longitude]);
        currentLocationCircle.setRadius(accuracy); // Update the accuracy radius
    } else {
        // Create a marker for the user's current location
        currentLocationMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
                className: 'current-location-icon',
                html: `<div style="width: 20px; height: 20px; background-color: red; border-radius: 50%;"></div>`,
                iconSize: [20, 20],
            }),
        }).addTo(map).bindPopup('You are here');

        // Create a circle around the user's location
        currentLocationCircle = L.circle([latitude, longitude], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.3, // Make the circle semi-transparent
            radius: accuracy, // Radius in meters based on accuracy
        }).addTo(map);
    }

    // Center the map on the user's current location
    map.setView([latitude, longitude], 15);

    // Check for nearby incidents
    checkNearbyIncidents(latitude, longitude);
}

// Enable live tracking of the user's location with high accuracy
if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        updateLocation,
        (error) => console.error('Geolocation error:', error.message),
        {
            enableHighAccuracy: true, // Requests GPS-level accuracy
            timeout: 30000, // Allow up to 30 seconds to get the best accuracy
            maximumAge: 0, // Do not use cached positions
        }
    );
}
 else {
    alert('Geolocation is not supported by your browser.');
    map.setView([51.505, -0.09], 13); // Default center
}

// Helper function to add a marker to the map (blue pointy markers for incidents)
function addMarker(report) {
    const marker = L.marker([report.latitude, report.longitude], {
        icon: L.icon({
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png', // Default blue marker icon
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            shadowSize: [41, 41],
        }),
    }).addTo(map);
    const content = `
        <strong>${report.type.toUpperCase()}</strong><br>
        ${report.description || 'No description provided.'}<br>
        ${report.photo ? `<img src="${report.photo}" alt="Incident Photo" style="width:100%;max-width:200px;">` : ''}
    `;
    marker.bindPopup(content);
}

// Geocoding function to fetch latitude and longitude from an address
async function geocodeAddress(address) {
    console.log(" This is hte address:")
    console.log(address);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
        throw new Error('Address not found');
    }
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Handle form submission
document.getElementById('report-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent page refresh

    
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('report-form');
    if (!form) {
        console.error('Form element not found');
        return;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        console.log('Submit event triggered');
    // Get data from the form
    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const address = document.getElementById('address').value;
    const useCurrentLocation = document.getElementById('use-current-location').checked;
    const photoInput = document.getElementById('photo');

    let lat, lon;

    if (useCurrentLocation) {
        // Use the user's current location
        if (navigator.geolocation) {
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        lat = position.coords.latitude;
                        lon = position.coords.longitude;
                        resolve();
                    },
                    (error) => reject(new Error('Unable to fetch current location.'))
                );
            });
        } else {
            alert('Geolocation is not supported by your browser.');
            return;
        }
    } else {
        // Convert the address to latitude and longitude
        try {
            const location = await geocodeAddress(address);
            lat = location.lat;
            lon = location.lon;
        } catch (error) {
            alert('Error: ' + error.message);
            return;
        }
    }

    // Convert the uploaded image to Base64
    let photo = null;
    if (photoInput.files && photoInput.files[0]) {
        const file = photoInput.files[0];
        photo = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    }

    // Save the new report
    const newReport = { type, description, address, latitude: lat, longitude: lon, photo };
    reports.push(newReport);
    localStorage.setItem('reports', JSON.stringify(reports));

    // Add the marker to the map
    addMarker(newReport);

    // Alert the user
    alert('Incident reported successfully!');
    document.getElementById('report-form').reset(); // Clear the form
        alert('Incident reported successfully!');
    });

    console.log('Event listener attached');
});
