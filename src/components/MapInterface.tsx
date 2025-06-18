// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// New type for unique sensor data
export interface UniqueSensorData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'radar' | 'seismic' | 'infrared';
  value: number;
  event?: { type: string; desc: string; value: number } | null;
  meta: { battery: string; health: string; lastMaintenance: string };
  timestamp: number;
  anomaly: { isAnomaly: boolean; reason?: string };
}

export const MapInterface: React.FC<{ sensorData: UniqueSensorData[] }> = ({ sensorData }) => {
  const getMarkerColor = (type: string, hasAlert: boolean) => {
    if (hasAlert) return '#ff4444';
    switch (type) {
      case 'radar': return '#4e79a7';
      case 'seismic': return '#f28e2b';
      case 'infrared': return '#e15759';
      default: return '#59a14f';
    }
  };

  return (
    <div className="map-container">
      <h3>Sensor Network Map</h3>
      <MapContainer
        center={[40.7428, -73.9899]}
        zoom={12}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {sensorData.map((sensor) => {
          const hasAlert = !!(sensor.anomaly?.isAnomaly || sensor.event);
          const sensorValue = sensor.value;
          return (
            <React.Fragment key={sensor.id}>
              <Marker position={[sensor.lat, sensor.lng]}>
                <Popup>
                  <div>
                    <strong>{sensor.name}</strong><br/>
                    Type: {sensor.type.toUpperCase()}<br/>
                    Current Value: {sensorValue?.toFixed(2)}<br/>
                    Status: {hasAlert ? '🚨 ALERT' : '✅ Normal'}<br/>
                    {sensor.event && (<span style={{color:'#e15759'}}>Event: {sensor.event.desc}</span>)}<br/>
                    <span style={{color:'#888',fontSize:'0.9em'}}>Battery: {sensor.meta.battery}, Health: {sensor.meta.health}, Last Maint: {sensor.meta.lastMaintenance}</span><br/>
                    <span style={{color:'#888',fontSize:'0.9em'}}>Mode: Simulated (No Device Connected)</span>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={[sensor.lat, sensor.lng]}
                radius={hasAlert ? 800 : 500}
                fillColor={getMarkerColor(sensor.type, hasAlert)}
                fillOpacity={hasAlert ? 0.3 : 0.1}
                stroke={true}
                color={getMarkerColor(sensor.type, hasAlert)}
                weight={hasAlert ? 3 : 1}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
};
