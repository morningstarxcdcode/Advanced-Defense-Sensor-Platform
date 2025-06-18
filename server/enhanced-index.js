// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const { detectAnomalyML } = require('./ml-detection');
const { 
  initializeDatabase, 
  storeSensorData, 
  getHistoricalData, 
  storeAlert, 
  getActiveAlerts,
  authenticateUser,
  verifyToken 
} = require('./database');

// Initialize database
initializeDatabase();

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store historical data for ML analysis
let historicalData = [];

// Simulate radar, seismic, and infrared sensor data
function simulateSensors() {
  const base = {
    radar: Math.random() * 10,
    seismic: Math.random() * 5,
    infrared: Math.random() * 20,
  };
  if (Math.random() < 0.1) {
    base.radar += 30 + Math.random() * 10;
    base.seismic += 15 + Math.random() * 5;
    base.infrared += 40 + Math.random() * 10;
  }
  return { ...base, timestamp: Date.now() };
}

// Broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// --- Simulation/Real Mode Switch ---
// Set mode via environment variable or config
const MODE = process.env.PLATFORM_MODE || 'simulation'; // 'simulation' or 'real'

// --- Unique, Realistic Multi-Sensor Simulation ---
const SENSOR_LOCATIONS = [
  { id: 'radar-1', name: 'Radar Station Alpha', lat: 40.7128, lng: -74.0060, type: 'radar' },
  { id: 'seismic-1', name: 'Seismic Monitor Beta', lat: 40.7589, lng: -73.9851, type: 'seismic' },
  { id: 'infrared-1', name: 'IR Sensor Gamma', lat: 40.7282, lng: -73.9942, type: 'infrared' },
  { id: 'radar-2', name: 'Radar Station Delta', lat: 40.7505, lng: -73.9934, type: 'radar' },
];

// --- Real Device Integration Placeholder ---
function getRealSensorData(sensor) {
  // Placeholder: In real mode, fetch from hardware here
  // Example: return { ...sensor, value: readFromDevice(sensor.id), ... }
  return null; // Not implemented
}

function randomMeta() {
  return {
    battery: (80 + Math.random() * 20).toFixed(1) + '%',
    health: Math.random() > 0.1 ? 'Good' : 'Needs Maintenance',
    lastMaintenance: new Date(Date.now() - Math.random() * 1000*60*60*24*30).toLocaleDateString(),
  };
}

function simulateSensorEvent(sensor) {
  if (MODE === 'real') {
    const realData = getRealSensorData(sensor);
    if (realData) return realData;
    // If no real data, fallback to simulation for demo
  }
  // Simulate realistic sensor values and events
  let value = 0, event = null;
  switch(sensor.type) {
    case 'radar':
      value = 5 + Math.random() * 10;
      if (Math.random() < 0.07) event = { type: 'vehicle', desc: 'Vehicle detected', value: 30 + Math.random() * 20 };
      break;
    case 'seismic':
      value = 2 + Math.random() * 3;
      if (Math.random() < 0.05) event = { type: 'footstep', desc: 'Intruder detected', value: 15 + Math.random() * 10 };
      break;
    case 'infrared':
      value = 10 + Math.random() * 10;
      if (Math.random() < 0.06) event = { type: 'heat', desc: 'Heat source detected', value: 35 + Math.random() * 15 };
      break;
  }
  if (event) value = event.value;
  return {
    ...sensor,
    value,
    event,
    meta: randomMeta(),
    timestamp: Date.now(),
  };
}

// --- Broadcast all sensors' data as an array ---
setInterval(() => {
  const sensorsData = SENSOR_LOCATIONS.map(simulateSensorEvent);
  const enriched = sensorsData.map(sensorData => {
    const anomaly = detectAnomalyML({
      radar: sensorData.type === 'radar' ? sensorData.value : 0,
      seismic: sensorData.type === 'seismic' ? sensorData.value : 0,
      infrared: sensorData.type === 'infrared' ? sensorData.value : 0,
      timestamp: sensorData.timestamp
    }, historicalData);
    // Store in DB
    storeSensorData({
      radar: sensorData.type === 'radar' ? sensorData.value : 0,
      seismic: sensorData.type === 'seismic' ? sensorData.value : 0,
      infrared: sensorData.type === 'infrared' ? sensorData.value : 0,
      anomaly
    });
    return { ...sensorData, anomaly };
  });
  // Broadcast all sensors at once
  broadcast({ sensors: enriched, scenario: 'Border Security', simulation: MODE === 'simulation' });
}, 1000);

// API Routes

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  authenticateUser(username, password, (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json(result);
  });
});

// Get historical sensor data
app.get('/api/historical', (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  getHistoricalData(limit, (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(data);
  });
});

// Get active alerts
app.get('/api/alerts', (req, res) => {
  getActiveAlerts((err, alerts) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(alerts);
  });
});

// --- Robust Uptime Logic ---
const startTime = Date.now();

app.get('/api/status', (req, res) => {
  res.json({
    status: 'operational',
    sensors: SENSOR_LOCATIONS.map(s => ({ id: s.id, type: s.type, name: s.name })),
    uptime: Math.floor((Date.now() - startTime) / 1000), // seconds
    activeConnections: wss.clients.size,
    mlModel: 'Enhanced ML Detection v2.0',
    database: 'connected',
    mode: MODE
  });
});

app.get('/', (req, res) => {
  res.send('Advanced Defense & Sensor Platform Backend - Enhanced Version');
});

// --- Real Device Integration ---
// Accept sensor data from real hardware via HTTP POST
app.post('/api/sensor', (req, res) => {
  if (MODE !== 'real') {
    return res.status(400).json({ error: 'Not in real device mode' });
  }
  const { id, type, value, event, meta, timestamp } = req.body;
  if (!id || !type || typeof value !== 'number' || !timestamp) {
    return res.status(400).json({ error: 'Missing or invalid sensor data' });
  }
  // Enrich and store
  const anomaly = detectAnomalyML({
    radar: type === 'radar' ? value : 0,
    seismic: type === 'seismic' ? value : 0,
    infrared: type === 'infrared' ? value : 0,
    timestamp
  }, historicalData);
  storeSensorData({
    radar: type === 'radar' ? value : 0,
    seismic: type === 'seismic' ? value : 0,
    infrared: type === 'infrared' ? value : 0,
    anomaly
  });
  // Broadcast to clients
  const sensorPayload = {
    id, name: req.body.name || id, lat: req.body.lat, lng: req.body.lng, type, value, event, meta, timestamp, anomaly
  };
  broadcast({ sensors: [sensorPayload], scenario: 'Real Device', simulation: false });
  res.json({ success: true, anomaly });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Advanced Backend server running on port ${PORT}`);
  console.log('Features: ML Detection, Database Storage, Authentication, Real-time Streaming');
});
