const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.use(express.static(path.join(__dirname, 'public')));
app.get('/healthz', (req, res) => res.sendStatus(200));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// rooms: Map<roomId, { players: Map<socketId, PlayerData>, revealed: bool, pack: string, moderatorId: string, lastActivity: number }>
const rooms = new Map();

const ROOM_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Sweep every hour; delete rooms with no activity for 24h
setInterval(() => {
  const now = Date.now();
  for (const [id, room] of rooms) {
    if (now - room.lastActivity > ROOM_TTL_MS) {
      io.to(id).emit('room-expired');
      io.socketsLeave(id);
      rooms.delete(id);
      console.log(`Room ${id} expired and removed`);
    }
  }
}, 60 * 60 * 1000);

function touch(room) {
  room.lastActivity = Date.now();
}

function createRoomId() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

function getRoomState(room) {
  return {
    players: Array.from(room.players.entries()).map(([id, p]) => ({
      id,
      name: p.name,
      hasVoted: p.vote !== null,
      vote: room.revealed ? p.vote : null,
      isVoter: p.isVoter,
      isModerator: id === room.moderatorId,
    })),
    revealed: room.revealed,
    pack: room.pack,
    moderatorId: room.moderatorId,
  };
}

function removePlayer(socket, roomId) {
  if (!roomId) return;
  socket.leave(roomId);
  const room = rooms.get(roomId);
  if (!room) return;
  room.players.delete(socket.id);
  if (room.players.size === 0) {
    rooms.delete(roomId);
    return;
  }
  if (room.moderatorId === socket.id) {
    room.moderatorId = room.players.keys().next().value;
  }
  io.to(roomId).emit('room-update', getRoomState(room));
}

io.on('connection', (socket) => {
  let currentRoomId = null;

  socket.on('create-room', ({ name }) => {
    const id = createRoomId();
    rooms.set(id, {
      players: new Map([[socket.id, { name: name || 'Anonymous', vote: null, isVoter: true }]]),
      revealed: false,
      pack: 'mountain-goat',
      moderatorId: socket.id,
      lastActivity: Date.now(),
    });
    currentRoomId = id;
    socket.join(id);
    socket.emit('room-created', { roomId: id });
    io.to(id).emit('room-update', getRoomState(rooms.get(id)));
  });

  socket.on('join-room', ({ name, roomId }) => {
    if (!rooms.has(roomId)) {
      socket.emit('room-error', { message: `Room "${roomId}" not found. Check the number and try again.` });
      return;
    }
    if (currentRoomId) removePlayer(socket, currentRoomId);
    const room = rooms.get(roomId);
    room.players.set(socket.id, { name: name || 'Anonymous', vote: null, isVoter: true });
    touch(room);
    currentRoomId = roomId;
    socket.join(roomId);
    socket.emit('room-joined', { roomId });
    io.to(roomId).emit('room-update', getRoomState(room));
  });

  socket.on('vote', ({ value }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.revealed) return;
    const player = room.players.get(socket.id);
    if (!player?.isVoter) return;
    // Toggle off if same card clicked
    player.vote = (value === player.vote) ? null : value;
    touch(room);
    io.to(currentRoomId).emit('room-update', getRoomState(room));
  });

  socket.on('reveal', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.moderatorId !== socket.id || room.revealed) return;
    room.revealed = true;
    touch(room);
    io.to(currentRoomId).emit('room-update', getRoomState(room));
  });

  socket.on('reset', () => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.moderatorId !== socket.id) return;
    room.revealed = false;
    room.players.forEach(p => { p.vote = null; });
    touch(room);
    io.to(currentRoomId).emit('room-update', getRoomState(room));
  });

  socket.on('change-pack', ({ pack }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room || room.moderatorId !== socket.id) return;
    room.pack = pack;
    room.revealed = false;
    room.players.forEach(p => { p.vote = null; });
    touch(room);
    io.to(currentRoomId).emit('room-update', getRoomState(room));
  });

  socket.on('toggle-voter', ({ isVoter }) => {
    if (!currentRoomId) return;
    const room = rooms.get(currentRoomId);
    if (!room) return;
    const player = room.players.get(socket.id);
    if (!player) return;
    player.isVoter = isVoter;
    if (!isVoter) player.vote = null;
    io.to(currentRoomId).emit('room-update', getRoomState(room));
  });

  socket.on('disconnect', () => removePlayer(socket, currentRoomId));
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Planning Poker running at http://localhost:${PORT}`);
});
