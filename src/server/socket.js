import { Server } from 'socket.io';
export const initSocket = (server) => {
  const io = new Server(server, { cors: { origin: (process.env.CLIENT_ORIGIN||'').split(',').filter(Boolean), credentials: true } });
  io.on('connection', (socket) => {
    socket.on('join:project', (projectId) => socket.join('project:'+projectId));
  });
  global.io = io;
};
