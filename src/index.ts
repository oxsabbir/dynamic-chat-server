import express from "express";
import http from "http";
import { Server } from "socket.io";

// handling upcaughtException
process.on("uncaughtException", (err) => {
  console.log(err.message, err.message);
  process.exit(1);
});

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
  // console.log(socket);
  socket.on("user_message", (message) => {
    if (message) {
      socket.emit("hello", "world");
    }
  });
});

export default serverApp;
