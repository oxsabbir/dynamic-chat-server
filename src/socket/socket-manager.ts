import { Socket, Server } from "socket.io";
import { Message } from "../types";

export class SocketManager {
  io: Server;
  socket: Socket;
  userId: string;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
    this.userId = "";
  }

  init() {
    // handling connection
    this.onConnection();

    // handling disconnection
    this.socket.on("disconnect", () => {
      this.onDisconnect();
    });

    this.socket.on("user_message", (message) => {
      if (message) {
        console.log(message);
        console.log(this.socket.id, "socket-id");
        this.io.emit("from_server", `From server : ${JSON.stringify(message)}`);
      }
    });
  }

  onConnection() {
    console.log("User connected :", this.socket.id);
  }

  onDisconnect() {
    console.log("User disconnected :", this.socket.id);
  }

  sendMessage(receiverId: string, message: Partial<Message>) {}
}
