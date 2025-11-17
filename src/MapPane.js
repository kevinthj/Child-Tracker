import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
//change radius from firebase
// Custom circle icon
const circleIcon = new L.divIcon({
  className: 'custom-circle-icon',
  html: '<div style="width: 12px; height: 12px; border-radius: 50%; background-color: #007bff; border: 2px solid #fff;"></div>',
  iconSize: [12, 12], // Size of the circle
  iconAnchor: [6, 6], // Anchor position (centered on the circle)
});

function FollowSelected({ lat, lon }) {
  const map = useMap();
  const last = useRef([lat, lon]);
  useEffect(() => {
    const next = [lat, lon];
    if (next[0] !== last.current[0] || next[1] !== last.current[1]) {
      map.flyTo(next, map.getZoom(), { duration: 0.6 });
      last.current = next;
    }
  }, [lat, lon, map]);
  return null;
}

export default function MapPane({ device }) {
  const lat = Number(device?.lat) || 32.733094;
  const lon = Number(device?.lon) || -97.112666;
  const geofenceLat = Number(device?.geofenceLat) || 32.734100; // Geofence lat
  const geofenceLon = Number(device?.geofenceLon) || -97.114000; // Geofence lon

  console.log("Device data in MapPane:", device);

  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <header style={{
        position: 'absolute', zIndex: 1000, left: 16, top: 16,
        background: 'rgba(15,23,42,0.9)', border: '1px solid #1f2937',
        color: '#e5e7eb', padding: '8px 12px', borderRadius: 10
      }}>
        <div style={{ fontWeight: 800 }}>{device?.name ?? '—'}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          {device?.status ?? '—'} · {lat.toFixed(6)}, {lon.toFixed(6)}
        </div>
      </header>

      <MapContainer
        center={[lat, lon]}  // Dynamically set the center using device lat/lon
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Dynamically follow the marker position */}
        <FollowSelected lat={lat} lon={lon} />

        {/* Marker for the device */}
        <Marker position={[lat, lon]} icon={circleIcon}>
          <Popup>
            <b>{device?.name}</b><br />
            Lat: {lat}<br />
            Lon: {lon}<br />
            Status: {device?.status}
          </Popup>
        </Marker>

        {/* Geofence Circle from Firebase */}
        <Circle
          center={[geofenceLat, geofenceLon]}  // Geofence circle dynamically centered on geofence location
          radius={70}  // Radius in meters
          pathOptions={{ color: 'green', fillColor: '#7F9653', fillOpacity: 0.2 }}
        />
      </MapContainer>
    </div>
  );
}

