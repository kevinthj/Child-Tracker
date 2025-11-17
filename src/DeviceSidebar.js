import React from 'react';

const chip = (color, text) => (
  <span style={{
    background: color, color: '#0b1220',
    borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 700
  }}>{text}</span>
);

export default function DeviceSidebar({ devices, selectedId, onSelect }) {
  return (
      <aside style={{
        width: '100%', // use full available width
        background: '#111827',
        padding: 16,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%', // fill its container height
      }}>
      <h2 className="sidebar-title" style={{ margin: 0, marginBottom: 12, fontSize: 'clamp(18px, 2vw, 28px)', fontWeight: 700, color: '#93c5fd' }}>
        Safety Net — Devices
      </h2>

      {devices.map(d => (
        <button 
          key={d.id}
          onClick={() => onSelect(d.id)}
          style={{
            width: '100%',
            textAlign: 'left',
            marginBottom: 10,
            padding: 12,
            borderRadius: 12,
            border: d.id === selectedId ? '1px solid #60a5fa' : '1px solid #1f2937',
            background: d.id === selectedId ? '#0b1220' : '#0f172a',
            color: '#e5e7eb',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: d.status === 'OUTSIDE' ? '#fca5a5'
                       : d.status === 'INSIDE' ? '#86efac'
                       : '#fde68a'
            }} />
            <div style={{
                fontWeight: 700,
                fontSize: 'clamp(12px, 2vw, 20px)',  // Resize on bigger screens
              }}>{d.name}</div>
          </div>
          <div style={{ fontSize: 12, marginTop: 6, opacity: 0.9 }}>
            {d.status === 'ESP offline?' ? chip('#fca5a5', 'offline')
             : d.status === 'OUTSIDE'   ? chip('#fca5a5', 'outside')
             : d.status === 'INSIDE'    ? chip('#86efac', 'inside')
             : chip('#fde68a', 'waiting')}
            <span style={{ marginLeft: 8, color: '#9ca3af' }}>
              {d.lastSeen ? `Last seen ${new Date(d.lastSeen).toLocaleTimeString()}` : '—'}
            </span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#a5b4fc' }}>
            Lat: {Number(d.lat).toFixed(6)} • Lon: {Number(d.lon).toFixed(6)}
          </div>
        </button>
      ))}
      <div style={{ fontSize: 12, color: '#9ca3af',marginTop: 8 }}>
        Tip: add more devices later by reading from a cloud API or a list endpoint.
      </div>
    </aside>
  );
}
