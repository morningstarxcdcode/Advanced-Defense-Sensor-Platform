// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

import { useEffect, useState, useRef } from 'react';
import './App.css';
import { MapInterface } from './components/MapInterface';
import { AdvancedCharts } from './components/AdvancedCharts';
import { Login } from './components/Login';

// --- Types for unique sensor data ---
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

export interface User {
  id: number;
  username: string;
  role: string;
}

interface SystemStatus {
  status: string;
  sensors: Array<{ id: string; type: string; name: string }>;
  uptime: number;
  activeConnections: number;
  mlModel: string;
  database: string;
  mode: string;
}

function App() {
  const [data, setData] = useState<UniqueSensorData[][]>([]); // Array of arrays, each tick
  const [alerts, setAlerts] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [view, setView] = useState<'dashboard' | 'analytics' | 'map'>('dashboard');
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Check for existing token
    const savedToken = localStorage.getItem('defense_token');
    if (savedToken) {
      setToken(savedToken);
      // TODO: Verify token with backend
    }
  }, []);

  // --- WebSocket: handle new multi-sensor data format ---
  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:4000/api/status')
      .then(res => res.json())
      .then((data: SystemStatus) => setSystemStatus(data))
      .catch(console.error);
    const ws = new WebSocket('ws://localhost:4000');
    wsRef.current = ws;
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.sensors) {
        setData((prev) => [...prev.slice(-49), msg.sensors]);
        msg.sensors.forEach((sensor: UniqueSensorData) => {
          if (sensor.anomaly?.isAnomaly || sensor.event) {
            const alertMessage = `${sensor.name}: ${sensor.event ? sensor.event.desc : sensor.anomaly.reason} (ID: ${sensor.id})`;
            setAlerts((prev) => [alertMessage, ...prev.slice(0, 4)]);
            setTimeout(() => setAlerts((prev) => prev.slice(0, -1)), 8000);
          }
        });
      }
    };
    return () => ws.close();
  }, [token]);

  const handleLogin = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('defense_token');
    setToken(null);
    setUser(null);
    setData([]);
    setAlerts([]);
  };

  if (!token) {
    return <Login onLogin={handleLogin as (token: string, user: unknown) => void} />;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Advanced Defense & Sensor Platform</h1>
        <div className="header-controls">
          <div className="nav-tabs">
            <button 
              className={view === 'dashboard' ? 'active' : ''} 
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={view === 'analytics' ? 'active' : ''} 
              onClick={() => setView('analytics')}
            >
              Analytics
            </button>
            <button 
              className={view === 'map' ? 'active' : ''} 
              onClick={() => setView('map')}
            >
              Map
            </button>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.username}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        </div>
      </header>

      {alerts.length > 0 && (
        <div className="alert-banner">
          {alerts.map((alert, index) => (
            <div key={index} className="alert">
              🚨 {alert}
            </div>
          ))}
        </div>
      )}

      {systemStatus && (
        <div className="system-status">
          <span className="status-item">Status: {systemStatus.status}</span>
          <span className="status-item">Connections: {systemStatus.activeConnections}</span>
          <span className="status-item">ML: {systemStatus.mlModel}</span>
          <span className="status-item">Uptime: {Math.floor(systemStatus.uptime / 60)}min</span>
          <span className="status-item" style={{color:'#e15759',fontWeight:'bold'}}>Mode: Simulation (No Real Devices Connected)</span>
        </div>
      )}

      <main className="dashboard-content">
        {view === 'dashboard' && (
          <div className="charts">
            <SensorChart data={data} type="radar" color="#4e79a7" />
            <SensorChart data={data} type="seismic" color="#f28e2b" />
            <SensorChart data={data} type="infrared" color="#e15759" />
          </div>
        )}

        {view === 'analytics' && <AdvancedCharts data={data} />}
        
        {view === 'map' && <MapInterface sensorData={data.length > 0 ? data[data.length-1] : []} />}
      </main>
    </div>
  );
}

function SensorChart({ data, type, color }: { data: UniqueSensorData[][]; type: 'radar' | 'seismic' | 'infrared'; color: string }) {
  const values = data.map((d) => d.find(sensor => sensor.type === type)?.value || 0);
  const max = Math.max(50, ...values);
  const min = Math.min(0, ...values);
  const points = values.map((v, i) => `${i * 6},${100 - ((v - min) / (max - min)) * 80}`);
  
  return (
    <div className="sensor-chart">
      <h3>{type.charAt(0).toUpperCase() + type.slice(1)} Sensor</h3>
      <div className="chart-value">
        Current: {values[values.length - 1]?.toFixed(2) || '0.00'}
      </div>
      <svg width={300} height={120}>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={3}
          points={points.join(' ')}
        />
      </svg>
    </div>
  );
}

export default App;
