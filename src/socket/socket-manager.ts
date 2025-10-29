import { Socket, Server } from "socket.io";

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
        this.io.emit("from_server", `From server : ${message}`);
      }
    });
  }
}
