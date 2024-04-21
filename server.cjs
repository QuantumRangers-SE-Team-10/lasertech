/* eslint-disable no-undef */
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST']
  }
});

const dgram = require('dgram');
const BROADCAST_PORT = 7500;
const LISTEN_PORT = 7501;
const HOST = '0.0.0.0';
// const ADDRESS = '192.168.1.255'
const ADDRESS = '127.0.0.1'
const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP Server listening on ${address.address}:${address.port}`);
});

server.on('message', (message, remote) => {
  console.log(`Received message from ${remote.address}:${remote.port}: ${message}`);

  if (message.indexOf(':') !== -1) {
    const parts = message.toString().split(':');
    io.emit('hit', { sender: parts[0], recipient: parts[1]} );
    sendUDPMessage(parts[0]);
  }

  // Broadcast the message to all connected clients
  io.emit('udp-message', message.toString());
});

server.bind(LISTEN_PORT, HOST);

function sendUDPMessage(message) {
  const buffer = Buffer.from(message);
  server.send(buffer, 0, buffer.length, BROADCAST_PORT, ADDRESS, (err) => {
    if (err) {
      console.error('Failed to send message:', err);
    } else {
      console.log('Message sent');
    }
  });
}

function sendKeyUDPMessage(message) {
  const buffer = Buffer.from(message);
  Array.from({ length: 3 }, () => {
    server.send(buffer, 0, buffer.length, BROADCAST_PORT, ADDRESS, (err) => {
      if (err) {
        console.error('Failed to send message:', err);
      } else {
        console.log('Message sent');
      }
    });
  });
}

io.on('connection', (socket) => {
  console.log('A client connected');

  socket.on('udp-send', (message) => {
    sendUDPMessage(message);
  });

  socket.on('equipment-init', (message) => {
    sendKeyUDPMessage(message);
  });

  socket.on('game-start', () => {
    sendUDPMessage('202');
  });

  socket.on('game-end', () => {
    sendKeyUDPMessage('221');
  });

  socket.on('red-base-scored', () => {
    sendUDPMessage('53');
  });

  socket.on('green-base-scored', () => {
    sendUDPMessage('43');
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});


const PORT_HTTP = 3000;
http.listen(PORT_HTTP, () => {
  console.log(`HTTP Server listening on port ${PORT_HTTP}`);
});