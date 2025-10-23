import express, { NextFunction, Response, Request } from "express";
import http from "http";
import { Server } from "socket.io";

// handling upcaughtException
process.on("uncaughtException", (err) => {
  console.log("💥 Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  console.log("Server is running");
  res.send({
    status: "success",
    messsage: "server is up and running",
  });
});

// sending response for undefined route
app.all("/{*splat}", (req, res, next) => {
  res.status(404).json({
    status: "not-found",
    message: `Cannot find ${req.originalUrl} on the server`,
  });
});

// global error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(err.statusCode || 403).json({
    status: "error",
    message: err.message,
  });
});

const serverApp = http.createServer(app);
// const io = new Server(serverApp, {});

// io.on("connection", (socket) => {
//   // ...
//   console.log("Connection established");
//   // console.log(socket);
//   socket.on("user_message", (message) => {
//     if (message) {
//       socket.emit("hello", "world");
//     }
//   });
// });

export default serverApp;
