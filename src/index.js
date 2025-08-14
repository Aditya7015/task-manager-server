import http from 'http';
import dotenv from 'dotenv';
import app from './server/app.js';
import { initDb } from './server/db.js';
import { initSocket } from './server/socket.js';
dotenv.config();

const PORT = process.env.PORT || 4010;
(async () => {
  await initDb();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => console.log('API on http://localhost:' + PORT));
})();
