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

---

