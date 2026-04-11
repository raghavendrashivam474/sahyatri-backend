// sahyatri-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

connectDB();

app.use(cors());
app.use(express.json());

// ✅ Make io accessible in routes
app.set('io', io);

// ✅ API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/location', require('./routes/location'));
app.use('/api/alert', require('./routes/alert'));

// ══════════════════════════════════════════
// ✅ TEST ROUTES — For debugging/demo
// ══════════════════════════════════════════

// Test Route 1: Trigger fake SOS alert
app.get('/api/test/sos', (req, res) => {
  const testAlert = {
    user: { name: 'Test Tourist', email: 'test@test.com' },
    alert: { message: '🚨 TEST SOS — Emergency help needed!' },
    location: { lat: 28.6320, lng: 77.4440 },
    timestamp: new Date().toISOString(),
  };

  io.emit('newAlert', testAlert);
  io.emit('sos:new', testAlert);

  console.log('🧪 Test SOS emitted to all clients');
  console.log('📡 Connected sockets:', io.engine.clientsCount);

  res.json({
    success: true,
    message: 'Test SOS broadcast to all connected clients',
    connectedClients: io.engine.clientsCount,
    data: testAlert,
  });
});

// Test Route 2: Check how many clients connected
app.get('/api/test/status', (req, res) => {
  res.json({
    success: true,
    connectedClients: io.engine.clientsCount,
    serverTime: new Date().toISOString(),
    message: `${io.engine.clientsCount} client(s) connected via socket`,
  });
});

// Test Route 3: Trigger multiple alerts (stress test)
app.get('/api/test/sos-multiple', (req, res) => {
  const tourists = [
    { name: 'Rahul Sharma', email: 'rahul@test.com', lat: 28.6325, lng: 77.4445 },
    { name: 'Priya Singh', email: 'priya@test.com', lat: 28.6310, lng: 77.4435 },
    { name: 'Amit Kumar', email: 'amit@test.com', lat: 28.6335, lng: 77.4450 },
  ];

  tourists.forEach((tourist, i) => {
    setTimeout(() => {
      const alert = {
        user: { name: tourist.name, email: tourist.email },
        alert: { message: `SOS from ${tourist.name}!` },
        location: { lat: tourist.lat, lng: tourist.lng },
        timestamp: new Date().toISOString(),
      };

      io.emit('newAlert', alert);
      io.emit('sos:new', alert);

      console.log(`🧪 Test SOS #${i + 1} emitted: ${tourist.name}`);
    }, i * 2000); // 2 seconds apart
  });

  res.json({
    success: true,
    message: '3 test SOS alerts will be sent 2 seconds apart',
    connectedClients: io.engine.clientsCount,
  });
});

// ══════════════════════════════════════════
// ✅ Socket.IO — Handle real-time events
// ══════════════════════════════════════════
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);
  console.log('📡 Total connected:', io.engine.clientsCount);

  // ✅ When tourist sends SOS via socket
  socket.on('sos:trigger', (data) => {
    console.log('🚨 SOS received from socket:', data);
    io.emit('newAlert', data);
    io.emit('sos:new', data);
  });

  // ✅ When tourist updates location via socket
  socket.on('location:update', (data) => {
    console.log('📍 Location update:', data);
    socket.broadcast.emit('locationUpdate', data);
  });

  // ✅ Join room based on role
  socket.on('join:role', (role) => {
    socket.join(role);
    console.log(`👤 Socket ${socket.id} joined room: ${role}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
    console.log('📡 Total connected:', io.engine.clientsCount);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('');
  console.log('══════════════════════════════════════');
  console.log(`✅ Server running on port ${PORT}`);
  console.log('══════════════════════════════════════');
  console.log('');
  console.log('📋 Test URLs:');
  console.log(`   http://localhost:${PORT}/api/test/status     → Check connections`);
  console.log(`   http://localhost:${PORT}/api/test/sos         → Send test SOS`);
  console.log(`   http://localhost:${PORT}/api/test/sos-multiple → Send 3 test SOS`);
  console.log('');
});