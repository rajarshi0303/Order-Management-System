import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { registerSocketServer } from "./sockets/socketRegistry.js";
import { setupOrderSocketHandlers } from "./sockets/orderSocket.js";

const port = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173"
  }
});

registerSocketServer(io);
setupOrderSocketHandlers(io);

server.listen(port, () => {
  console.log(`Order API server listening on port ${port}`);
});
