import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

app.use(express.json());

app.get("/", () => {
  console.log("Server is running");
});

const serverApp = http.createServer(app);

const io = new Server(serverApp, {});

io.on("connection", (socket) => {
  // ...
  console.log("Connection established");
  console.log(socket);
});

export default serverApp;
