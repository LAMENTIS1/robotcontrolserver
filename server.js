// server.js

const WebSocket = require('ws');
const http = require('http');

// Create an HTTP server
const server = http.createServer();
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
  console.log('ESP32 connected');

  ws.on('message', message => {
    console.log(`Received message => ${message}`);
    broadcast(message); // Forward message to all connected ESP32s
  });

  ws.on('close', () => {
    console.log('ESP32 disconnected');
  });
});

// Start server
server.listen(8080, () => {
  console.log('WebSocket server started on ws://localhost:8080');
});
