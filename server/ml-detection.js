// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

// Enhanced ML anomaly detection with multiple algorithms
function generateAnomalyScore(data) {
  let score = 0;
  let reasons = [];

  // Statistical outlier detection
  if (data.radar > 25) {
    score += 0.4;
    reasons.push('Radar spike');
  }
  if (data.seismic > 12) {
    score += 0.3;
    reasons.push('Seismic activity');
  }
  if (data.infrared > 35) {
    score += 0.3;
    reasons.push('Heat signature');
  }

  // Pattern analysis (multiple sensors triggering)
  const activeSensors = [
    data.radar > 15,
    data.seismic > 8,
    data.infrared > 25
  ].filter(Boolean).length;

  if (activeSensors >= 2) {
    score += 0.5;
    reasons.push('Multi-sensor correlation');
  }

  // Time-based analysis (rapid changes)
  if (global.lastReading) {
    const radarChange = Math.abs(data.radar - global.lastReading.radar);
    const seismicChange = Math.abs(data.seismic - global.lastReading.seismic);
    const infraredChange = Math.abs(data.infrared - global.lastReading.infrared);
    
    if (radarChange > 10 || seismicChange > 5 || infraredChange > 15) {
      score += 0.2;
      reasons.push('Rapid sensor change');
    }
  }

  global.lastReading = data;

  return {
    score: Math.min(score, 1.0), // Cap at 1.0
    isAnomaly: score > 0.4,
    confidence: score,
    reasons: reasons.join(', '),
    algorithm: 'Enhanced ML Detection v2.0'
  };
}

// Simple clustering for pattern detection
function detectPatterns(historicalData) {
  if (historicalData.length < 10) return null;
  
  const recent = historicalData.slice(-10);
  const avgRadar = recent.reduce((sum, d) => sum + d.radar, 0) / recent.length;
  const avgSeismic = recent.reduce((sum, d) => sum + d.seismic, 0) / recent.length;
  const avgInfrared = recent.reduce((sum, d) => sum + d.infrared, 0) / recent.length;
  
  return {
    avgRadar,
    avgSeismic,
    avgInfrared,
    trend: recent[recent.length - 1].radar > avgRadar ? 'increasing' : 'decreasing'
  };
}

// Enhanced anomaly detection
function detectAnomalyML(data, historicalData = []) {
  const anomalyResult = generateAnomalyScore(data);
  const patterns = detectPatterns(historicalData);
  
  let finalReason = anomalyResult.reasons;
  if (patterns && patterns.trend === 'increasing') {
    finalReason += ' (escalating pattern detected)';
  }

  return {
    isAnomaly: anomalyResult.isAnomaly,
    reason: finalReason || 'Normal operation',
    confidence: anomalyResult.confidence,
    algorithm: anomalyResult.algorithm,
    patterns: patterns
  };
}

module.exports = { detectAnomalyML, detectPatterns };
