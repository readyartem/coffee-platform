import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation } from 'lucide-react';

const customMarkerIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      background: var(--accent);
      width: 44px; height: 44px;
      border-radius: 50%;
      display: flex; justify-content: center; align-items: center;
      box-shadow: 0 8px 16px rgba(0,0,0,0.4);
      border: 3px solid #fff;
      transform: translateY(-20px);
      transition: transform 0.3s ease;
    " class="marker-pulse">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 9.56H6M18 9.56L16.5 23.06H8.25L6 9.56M18 9.56C18 7.9687 17.3679 6.44258 16.2426 5.31736C15.1174 4.19214 13.5913 3.56 12 3.56C10.4087 3.56 8.88258 4.19214 7.75736 5.31736C6.63214 6.44258 6 7.9687 6 9.56M3.75 9.56H20.25" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M11.276 15.56L13.905 2.115C13.9496 1.91557 14.0345 1.72735 14.1544 1.5619C14.2743 1.39644 14.4268 1.25724 14.6025 1.15283C14.7782 1.04842 14.9733 0.981006 15.176 0.954726C15.3786 0.928445 15.5845 0.943852 15.781 1L19.5 2.06M7 15.56H17.333" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44]
});

const locations = [
  { id: 1, name: 'Кав\'ярня Русанівка', coords: [50.4390, 30.5950], address: 'Русанівська набережна, Київ', status: 'Відкрито до 22:00' },
  { id: 2, name: 'Кав\'ярня Березняки', coords: [50.4284, 30.6010], address: 'вул. Березняківська 6, Київ', status: 'Відкрито до 21:00' },
  { id: 3, name: 'Кав\'ярня Печерськ', coords: [50.4300, 30.5360], address: 'біля КНУТД, Київ', status: 'Відкрито до 23:00' },
];

export default function MapSection() {
  useEffect(() => {
    const styleId = 'map-custom-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(0, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); }
        }
        .marker-pulse { animation: pulse 2s infinite; }
        .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); padding: 4px; }
        .leaflet-popup-content { margin: 12px 16px; }
        .leaflet-container { font-family: inherit; z-index: 1; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={{
      height: '65vh',
      width: '100%',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.04)',
      position: 'relative',
      zIndex: 1
    }}>
      <MapContainer 
        center={[50.4330, 30.5600]} 
        zoom={13} 
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; OSM contributors'
        />
        {locations.map(loc => (
          <Marker key={loc.id} position={loc.coords} icon={customMarkerIcon}>
            <Popup closeButton={false}>
              <div style={{ minWidth: '180px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--text-main)', fontWeight: 600 }}>
                  {loc.name}
                </h3>
                <p style={{ margin: '0 0 4px 0', color: 'rgba(0,0,0,0.6)', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Navigation size={14} />
                  {loc.address}
                </p>
                <p style={{ margin: '0 0 16px 0', color: 'var(--accent)', fontSize: '13px', fontWeight: 500 }}>
                  {loc.status}
                </p>
                <button style={{
                    width: '100%',
                    padding: '10px 0',
                    background: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'background 0.3s'
                }}
                onMouseOver={(e) => e.target.style.background = 'var(--accent)'}
                onMouseOut={(e) => e.target.style.background = '#000'}
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${loc.coords[0]},${loc.coords[1]}`, '_blank')}
                >
                    Прокласти маршрут
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
