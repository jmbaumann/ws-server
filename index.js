const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.DEV_ENV
      ? 'http://localhost:3000'
      : 'https://letterboxd-fantasy.vercel.app',
    methods: ['GET', 'POST'],
  },
});

app.use(bodyParser.json());
app.use(cors());

io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle your WebSocket events here

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// HTTP endpoint to trigger WebSocket events
app.post('/trigger-event', (req, res) => {
  const { eventName, eventData } = req.body;

  if (eventName && eventData) {
    io.emit(eventName, eventData);
    res.status(200).json({ success: true });
  } else res.status(400).json({ success: false });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
