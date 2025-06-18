// Simulate radar, seismic, and infrared sensor data
function simulateSensors() {
  const base = {
    radar: Math.random() * 10,
    seismic: Math.random() * 5,
    infrared: Math.random() * 20,
  };
  // Randomly inject an intrusion event
  if (Math.random() < 0.1) {
    base.radar += 30 + Math.random() * 10;
    base.seismic += 15 + Math.random() * 5;
    base.infrared += 40 + Math.random() * 10;
  }
  return {
    ...base,
    timestamp: Date.now(),
  };
}

module.exports = { simulateSensors };
