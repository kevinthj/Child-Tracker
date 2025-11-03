import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix missing marker icon issue
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapComponent() {
  const [location, setLocation] = useState([32.733094, -97.112666]); // Default coordinates
  const [status, setStatus] = useState('Waiting for data...'); // Default status
  const [espIp] = useState('172.20.10.12'); // Replace with your ESP8266 IP

  // Fetch the data from ESP8266
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`http://${espIp}/data`);
        const data = await response.json();
        
        setLocation([data.lat, data.lon]); // Update the location
        setStatus(data.status); // Update the status (INSIDE/OUTSIDE)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch the data when the component mounts
    fetchLocation();

    // Set up polling every 5 seconds to keep the data updated
    const interval = setInterval(fetchLocation, 5000);
    
    // Cleanup interval when the component unmounts
    return () => clearInterval(interval);
  }, [espIp]); // Dependency on espIp so it only runs when espIp changes

  return (
    <div style={{ height: '100vh', padding: 20 }}>
      <div style={{ color: 'white', marginBottom: 8 }}>I should be above the map</div>

      <MapContainer
        center={location} // Set map center to current location
        zoom={16}
        style={{ height: '90%', width: '100%', border: '4px solid #444' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
        <Marker position={location}> {/* Dynamically update marker position */}
          <Popup>
            <strong>Status: </strong>{status}<br />
            <strong>Lat:</strong> {location[0]} <br />
            <strong>Lon:</strong> {location[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
