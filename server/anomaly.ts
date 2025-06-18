// Simple anomaly detection: flag if any sensor exceeds a threshold
function detectAnomaly(data: { radar: number; seismic: number; infrared: number }): { isAnomaly: boolean; reason?: string } {
  if (data.radar > 25) return { isAnomaly: true, reason: 'Radar spike' };
  if (data.seismic > 12) return { isAnomaly: true, reason: 'Seismic spike' };
  if (data.infrared > 35) return { isAnomaly: true, reason: 'Infrared spike' };
  return { isAnomaly: false };
}

export { detectAnomaly };
