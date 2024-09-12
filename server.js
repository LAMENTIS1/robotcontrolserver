const WebSocket = require('ws');
const http = require('http');

// Use the PORT environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Create an HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('WebSocket server is running');
});

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
server.listen(PORT, () => {
  console.log(`WebSocket server started on ws://localhost:${PORT}`);
});
