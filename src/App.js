import React, { useEffect, useMemo, useState } from 'react';
import MapPane from './MapPane';
import DeviceSidebar from './DeviceSidebar';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from './firebase';  // Importing the Firebase config from firebase.js
import './App.css';

// shape we’ll use for devices
const makeDefaultDevice = () => ({
  id: 'esp-1',
  name: 'Safety Net ESP',
  status: 'Waiting…',
  lat: 32.733094,
  lon: -97.112666,
});

export default function App() {
  const [devices, setDevices] = useState([makeDefaultDevice()]);
  const [selectedId, setSelectedId] = useState('esp-1');

  // Memoize the selected device based on selectedId
  const selected = useMemo(
    () => devices.find(d => d.id === selectedId) ?? devices[0],
    [devices, selectedId]
  );

  console.log("Selected Device in App:", selected); 

  // Fetch real-time data from Firebase Realtime Database
useEffect(() => {
  const espRefLocation = ref(db, 'device1/location'); // Reference to 'device1/location' in Firebase
  const espRefGeofence = ref(db, 'device1/geofence'); // Reference to 'device1/geofence' in Firebase
  
  // Fetch location data
  const unsubscribeLocation = onValue(espRefLocation, (snapshot) => {
    const data = snapshot.val();
    console.log("Fetched location data: ", data);
    if (data) {
      setDevices(prev => {
        const next = [...prev];
        const idx = next.findIndex(d => d.id === 'esp-1');
        if (idx !== -1) {
          next[idx] = {
            ...next[idx],
            lat: data.lat || 32.733094, // Update latitude
            lon: data.lon || -97.112666, // Update longitude
            status: data.status || 'Waiting…',
            lastSeen: new Date().toISOString(),
          };
        }
        return next;
      });
    }
  });

  // Fetch geofence data
  const unsubscribeGeofence = onValue(espRefGeofence, (snapshot) => {
    const data = snapshot.val();
    console.log("Fetched geofence data: ", data);
    if (data) {
      setDevices(prev => {
        const next = [...prev];
        const idx = next.findIndex(d => d.id === 'esp-1');
        if (idx !== -1) {
          next[idx] = {
            ...next[idx],
            geofenceLat: data.lat || 32.734100, // Update geofence latitude
            geofenceLon: data.lon || -97.114000, // Update geofence longitude
          };
        }
        return next;
      });
    }
  });

  // Clean up listeners
  return () => {
    unsubscribeLocation();
    unsubscribeGeofence();
  };
}, []);


  // App.js (simplified structure)
  return (
    <div className="app-container">
      <div className="map-container">
        <MapPane device={selected} />
      </div>

      <div className="sidebar-container">
        <DeviceSidebar
          devices={devices}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </div>
  );
}
