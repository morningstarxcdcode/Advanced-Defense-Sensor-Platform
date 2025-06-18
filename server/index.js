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

// Simple anomaly detection: flag if any sensor exceeds a threshold
function detectAnomaly(data) {
  if (data.radar > 25) return { isAnomaly: true, reason: 'Radar spike' };
  if (data.seismic > 12) return { isAnomaly: true, reason: 'Seismic spike' };
  if (data.infrared > 35) return { isAnomaly: true, reason: 'Infrared spike' };
  return { isAnomaly: false };
}

// Broadcast data to all connected clients
function broadcast(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Simulate and stream sensor data every second
setInterval(() => {
  const sensorData = simulateSensors();
  const anomaly = detectAnomaly(sensorData);
  broadcast({ ...sensorData, anomaly });
}, 1000);

app.get('/', (req, res) => {
  res.send('Defense & Sensor Platform Backend Running');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
