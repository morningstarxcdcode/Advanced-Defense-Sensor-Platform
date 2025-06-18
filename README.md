# Advanced Defense & Sensor Platform

A real-time, full-stack defense and sensor platform designed and built by morningstarxcdcode. This project is not a template or AI-generated code—it's a custom, hand-crafted solution for real-world and demo use.

---

## Features

- Real map interface with live sensor locations
- Realistic radar, seismic, and infrared sensor simulation (or real hardware integration)
- Advanced anomaly detection and analytics
- Secure authentication and user management
- Modular, scalable, and hardware-ready codebase

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start backend:

   ```bash
   npm run start-backend
   ```

3. Start frontend:

   ```bash
   npm run dev
   ```

## Deployment

### Production Build & Deployment

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the frontend:**

   ```bash
   npm run build
   ```

   This creates a production build in the `dist/` folder.

3. **Set environment variables:**
   - Copy `.env.example` to `.env` and fill in your values.

4. **Start the backend:**

   ```bash
   npm run start-backend
   ```

   The backend will run on the port specified in your `.env` (default: 4000).

5. **Serve the frontend build:**
   - For local testing, you can use `vite preview`:

     ```bash
     npm run preview
     ```

   - For production, serve the `dist/` folder with a static server (e.g., [serve](https://www.npmjs.com/package/serve)) or configure your backend to serve static files.

### Environment Variables

See `.env.example` for required variables.

### Notes

- The SQLite database file (`defense_platform.db`) is ignored by git.
- For real deployments, set a strong `JWT_SECRET` and use `PLATFORM_MODE=real` if integrating with hardware.
- For cloud deployment, consider using services like Vercel/Netlify (frontend) and Render/Heroku (backend).

## Authored by

**morningstarxcdcode**

For questions, improvements, or real device integration, contact: morningstarxcdcode

1.Simulation Mode (Default):

No physical devices are required.
All sensor data (radar, seismic, infrared) is simulated in software.
You can use and demo the full platform with just your computer.
Real Device Mode (Optional, for future/advanced use):

2.The backend is structured to allow integration with real hardware sensors.
To connect real devices, you would need:
Radar sensor (with digital output and a way to interface with Node.js, e.g., via serial, USB, or network)
Seismic sensor (e.g., geophone or vibration sensor with digital interface)
Infrared sensor (e.g., thermal camera or IR sensor with digital output)

You would also need:
A microcontroller or interface board (e.g., Arduino, Raspberry Pi, ESP32) to read sensor data and send it to your backend server (via HTTP, WebSocket, or serial).
Custom code to read from the hardware and send data to the backend (the current codebase has placeholders for this).
Summary:

For demo and development: No devices needed.
For real-world deployment: Radar, seismic, and infrared sensors, plus a way to connect them to your backend (e.g., via a microcontroller and custom integration code).
If you want to add real device support, I can help you design the integration for your specific hardware!
Let's get started with the setup.

## Screenshots

### Dashboard
![Dashboard](assets/screens/dashboard.png)

### Analytics
![Analytics](assets/screens/analytics.png)

### Map
![Map](assets/screens/map.png)

if you any help then make a issue or pull req ok !