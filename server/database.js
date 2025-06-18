// Authored by: morningstarxcdcode
// This file and all logic are original work. No AI or code generator was used.
// For questions or improvements, contact: morningstarxcdcode

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

// Database setup
const dbPath = path.join(__dirname, 'defense_platform.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'operator',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Sensor data history
    db.run(`CREATE TABLE IF NOT EXISTS sensor_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      radar REAL NOT NULL,
      seismic REAL NOT NULL,
      infrared REAL NOT NULL,
      anomaly_detected BOOLEAN DEFAULT 0,
      anomaly_reason TEXT,
      confidence REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Alerts table
    db.run(`CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      alert_type TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT DEFAULT 'medium',
      resolved BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create default admin user if not exists
    const adminPassword = bcrypt.hashSync('admin123', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)`, 
      ['admin', adminPassword, 'admin']);
  });
}

// Store sensor data
function storeSensorData(data) {
  const stmt = db.prepare(`INSERT INTO sensor_history 
    (radar, seismic, infrared, anomaly_detected, anomaly_reason, confidence) 
    VALUES (?, ?, ?, ?, ?, ?)`);
  
  stmt.run(
    data.radar,
    data.seismic,
    data.infrared,
    data.anomaly ? data.anomaly.isAnomaly : false,
    data.anomaly ? data.anomaly.reason : null,
    data.anomaly ? data.anomaly.confidence : null
  );
  
  stmt.finalize();
}

// Get historical data
function getHistoricalData(limit = 100, callback) {
  db.all(`SELECT * FROM sensor_history ORDER BY timestamp DESC LIMIT ?`, [limit], callback);
}

// Store alert
function storeAlert(alertType, message, severity = 'medium') {
  const stmt = db.prepare(`INSERT INTO alerts (alert_type, message, severity) VALUES (?, ?, ?)`);
  stmt.run(alertType, message, severity);
  stmt.finalize();
}

// Get active alerts
function getActiveAlerts(callback) {
  db.all(`SELECT * FROM alerts WHERE resolved = 0 ORDER BY created_at DESC`, callback);
}

// User authentication
function authenticateUser(username, password, callback) {
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) {
      return callback(null, null);
    }
    
    const isValid = bcrypt.compareSync(password, user.password);
    if (isValid) {
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        'defense_platform_secret',
        { expiresIn: '24h' }
      );
      callback(null, { user, token });
    } else {
      callback(null, null);
    }
  });
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, 'defense_platform_secret');
  } catch (err) {
    return null;
  }
}

module.exports = {
  initializeDatabase,
  storeSensorData,
  getHistoricalData,
  storeAlert,
  getActiveAlerts,
  authenticateUser,
  verifyToken,
  db
};
