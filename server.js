// server.js

const path = require('path');
const express = require('express');
const WebSocket = require('ws');

// Create an Express application
const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

// Broadcast message to all connected clients
function broadcast(message) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

wss.on('connection', ws => {
  console.log('Client connected');

  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    broadcast(message); // Forward message to all connected clients
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`WebSocket server started on ws://localhost:${PORT}`);
});
