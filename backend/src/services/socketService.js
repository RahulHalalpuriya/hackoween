let ioInstance = null;

export function initializeSocket(io) {
  ioInstance = io;
  
  io.on('connection', (socket) => {
    console.log(`[Socket.io] 🟢 Client connected: ${socket.id}`);
    
    socket.on('join:farmer', (farmerId) => {
      socket.join(`farmer:${farmerId}`);
      console.log(`[Socket.io] Socket ${socket.id} joined farmer room: farmer:${farmerId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] 🔴 Client disconnected: ${socket.id}`);
    });
  });
}

export function emitToAll(event, data) {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
}

export function emitToFarmer(farmerId, event, data) {
  if (ioInstance) {
    if (farmerId) {
      ioInstance.to(`farmer:${farmerId}`).emit(event, data);
    }
    // Also broadcast to all for instant live demo experience
    ioInstance.emit(event, data);
  }
}

export function getIO() {
  return ioInstance;
}
