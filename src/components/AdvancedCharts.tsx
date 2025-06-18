// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import type { UniqueSensorData } from '../App';

interface AdvancedChartsProps {
  data: UniqueSensorData[][];
}

export const AdvancedCharts: React.FC<AdvancedChartsProps> = ({ data }) => {
  // Flatten to per-sensor time series
  const flat: UniqueSensorData[] = data.flat().filter(Boolean);
  // Group by sensor id
  const byId: { [id: string]: UniqueSensorData[] } = {};
  flat.forEach(d => {
    if (!byId[d.id]) byId[d.id] = [];
    byId[d.id].push(d);
  });
  // For demo, show first sensor's time series (could add selector)
  const firstSensor = Object.values(byId)[0] || [];
  const chartData = firstSensor.slice(-50).map((d, index) => ({
    time: new Date(d.timestamp).toLocaleTimeString(),
    value: d.value,
    anomaly: d.anomaly.isAnomaly ? 1 : 0,
    index
  }));
  const anomalyData = firstSensor.slice(-20).filter(d => d.anomaly.isAnomaly);

  return (
    <div className="advanced-charts">
      <div className="chart-grid">
        {/* Real-time sensor data */}
        <div className="chart-panel">
          <h3>Live Sensor Readings (First Sensor)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#4e79a7" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threat level area chart */}
        <div className="chart-panel">
          <h3>Threat Detection Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="value" 
                stackId="1" 
                stroke="#4e79a7" 
                fill="#4e79a7" 
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Anomaly summary */}
      <div className="anomaly-summary">
        <h3>Recent Anomalies</h3>
        <div className="anomaly-list">
          {anomalyData.length === 0 ? (
            <p>No recent anomalies detected</p>
          ) : (
            anomalyData.map((item, index) => (
              <div key={index} className="anomaly-item">
                <span className="anomaly-time">
                  {new Date(item.timestamp).toLocaleTimeString()}
                </span>
                <span className="anomaly-reason">{item.anomaly.reason}</span>
                <span className="anomaly-values">
                  Value: {item.value.toFixed(1)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
