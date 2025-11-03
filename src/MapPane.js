import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Leaflet marker icon fix for CRA
L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
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
  const center = [Number(device?.lat ?? 0), Number(device?.lon ?? 0)];
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative' }}>
      <header style={{
        position: 'absolute', zIndex: 1000, left: 16, top: 16,
        background: 'rgba(15,23,42,0.9)', border: '1px solid #1f2937',
        color: '#e5e7eb', padding: '8px 12px', borderRadius: 10
      }}>
        <div style={{ fontWeight: 800 }}>{device?.name ?? '—'}</div>
        <div style={{ fontSize: 12, opacity: 0.9 }}>
          {device?.status ?? '—'} · {center[0].toFixed(6)}, {center[1].toFixed(6)}
        </div>
      </header>

      <MapContainer
        center={center}
        zoom={17}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FollowSelected lat={center[0]} lon={center[1]} />
        <Marker position={center}>
          <Popup>
            <b>{device?.name}</b><br />
            Lat: {center[0]}<br />
            Lon: {center[1]}<br />
            Status: {device?.status}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
