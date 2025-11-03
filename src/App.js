import React, { useEffect, useMemo, useState } from 'react';
import MapPane from './MapPane';
import DeviceSidebar from './DeviceSidebar';

// shape we’ll use for devices
// id, name, status, lat, lon, lastSeen
const makeDefaultDevice = () => ({
  id: 'esp-1',
  name: 'Safety Net ESP',
  status: 'Waiting…',
  lat: 32.733094,
  lon: -97.112666,
  lastSeen: null,
});

export default function App() {
  const [devices, setDevices] = useState([makeDefaultDevice()]);
  const [selectedId, setSelectedId] = useState('esp-1');

  const selected = useMemo(
    () => devices.find(d => d.id === selectedId) ?? devices[0],
    [devices, selectedId]
  );

  // Poll your ESP’s /data every 2s (proxy in package.json should point to ESP IP)
  useEffect(() => {
    let cancel = false;

    const fetchData = async () => {
      try {
        const res = await fetch('/data', { cache: 'no-store' });
        const data = await res.json(); // {lat, lon, status}
        if (cancel) return;

        setDevices(prev => {
          const next = [...prev];
          const idx = next.findIndex(d => d.id === 'esp-1');
          if (idx !== -1) {
            next[idx] = {
              ...next[idx],
              lat: Number(data.lat ?? next[idx].lat),
              lon: Number(data.lon ?? next[idx].lon),
              status: String(data.status ?? 'UNKNOWN'),
              lastSeen: new Date().toISOString(),
            };
          }
          return next;
        });
      } catch (e) {
        // keep the UI responsive even if ESP is offline
        setDevices(prev => {
          const next = [...prev];
          const idx = next.findIndex(d => d.id === 'esp-1');
          if (idx !== -1) next[idx] = { ...next[idx], status: 'ESP offline?' };
          return next;
        });
      }
    };

    fetchData();
    const id = setInterval(fetchData, 2000);
    return () => { cancel = true; clearInterval(id); };
  }, []);

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      {/* 30% sidebar */}
      <DeviceSidebar
        devices={devices}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      {/* 70% map */}
      <div style={{ flex: 1, background: '#0b1220' }}>
        <MapPane device={selected} />
      </div>
    </div>
  );
}
