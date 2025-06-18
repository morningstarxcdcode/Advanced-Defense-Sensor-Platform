# Multi-stage Dockerfile for Advanced Defense & Sensor Platform

# --- Build Stage ---
FROM node:22 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
COPY --from=build /app/package*.json ./
RUN npm install --omit=dev --prefix ./server && npm install --omit=dev
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "server/enhanced-index.js"]
