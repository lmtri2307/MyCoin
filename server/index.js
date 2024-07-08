import express from "express";
import http from "http";
import { Server } from "socket.io";
import bodyParser from "body-parser";
import cors from "cors";
import { signalingHandler } from "./signaling.js";

const app = express();
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
io.on("connection", socket => {
  socket.emit("me", socket.id);

  signalingHandler(socket);
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));