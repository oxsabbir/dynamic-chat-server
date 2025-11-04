import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import express, { NextFunction, Response, Request } from "express";
import cookieParser from "cookie-parser";
import { routeProtect } from "./controller/auth-controller";

import authRouther from "./routes/auth-router";
import friendshipRouter from "./routes/friendship-router";
import userRouter from "./routes/user-router";
import groupRouter from "./routes/group-routes";
import { SocketManager } from "./socket/socket-manager";
import messageRouter from "./routes/message-router";

const app = express();

app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res), // GET / POST
      tokens.url(req, res), // /friends
      tokens.status(req, res), // 200
      tokens["response-time"](req, res),
      "ms",
    ].join(" | ");
  })
);

// handling upcaughtException
process.on("uncaughtException", (err) => {
  console.log("💥 Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

app.use(cookieParser());

app.use(express.json());

app.get("/", (_, res: Response) => {
  console.log("Server is running");
  res.send({
    status: "success",
    messsage: "server is up and running",
  });
});

// defining routes
app.use("/api/v1", authRouther);
app.use("/api/v1/users", routeProtect, userRouter);
app.use("/api/v1/groups", routeProtect, groupRouter);
app.use("/api/v1/messages", routeProtect, messageRouter);
app.use("/api/v1/friendships", routeProtect, friendshipRouter);

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

const io = new Server(serverApp);

io.on("connection", (socket) => {
  new SocketManager(io, socket).init();
});

export default serverApp;
