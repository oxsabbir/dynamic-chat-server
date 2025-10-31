import { Socket, Server } from "socket.io";
import { Message } from "../types";

export class SocketManager {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  init() {
    this.socket.on("user_message", (message) => {
      if (message) {
        console.log(message);
        console.log(this.socket.id, "socket-id");
        this.io.emit("from_server", `From server : ${message}`);
      }
    });
  }

  sendMessage(receiverId: string, message: Partial<Message>) {}
}
