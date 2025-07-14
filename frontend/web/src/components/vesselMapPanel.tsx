import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';

const VesselMapPanel = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <MapContainer center={[5.5, 5.0]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[6.5244, 3.3792]}>
          <Popup>Vessel A</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default VesselMapPanel;
