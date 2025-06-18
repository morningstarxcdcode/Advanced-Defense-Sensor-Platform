import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { Server as WebSocketServer } from 'ws';
import { simulateSensors } from './sensors.js';
import { detectAnomaly } from './anomaly.js';
import type { SensorData } from './sensors.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Broadcast data to all connected clients
function broadcast(data: SensorData & { anomaly: { isAnomaly: boolean; reason?: string } }): void {
  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Simulate and stream sensor data
setInterval(() => {
  const sensorData: SensorData = simulateSensors();
  const anomaly = detectAnomaly(sensorData);
  broadcast({ ...sensorData, anomaly });
}, 1000);

app.get('/', (req: Request, res: Response) => {
  res.send('Defense & Sensor Platform Backend Running');
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
