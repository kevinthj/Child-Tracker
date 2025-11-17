import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase'; // ✅ make sure you have firebase.js configured

// Fix missing marker icon issue
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function MapComponent() {
  const [location, setLocation] = useState([32.733094, -97.112666]);
  const [status, setStatus] = useState('Waiting for data...');

  useEffect(() => {
    const espRef = ref(db, 'esp-1'); // ✅ listen to esp-1 in Firebase
    const unsubscribe = onValue(espRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLocation([data.latitude, data.longitude]); // ✅ read from Firebase
        setStatus(data.status);
        console.log("Firebase updated:", data);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ height: '100vh', padding: 20 }}>
      <div style={{ color: 'white', marginBottom: 8 }}>I should be above the map</div>

      <MapContainer
        center={location}
        zoom={16}
        style={{ height: '90%', width: '100%', border: '4px solid #444' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={location}>
          <Popup>
            <strong>Status:</strong> {status}<br />
            <strong>Lat:</strong> {location[0]}<br />
            <strong>Lon:</strong> {location[1]}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
