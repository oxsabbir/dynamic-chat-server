import { Socket, Server } from "socket.io";
import {
  Conversation as ConversationType,
  Message as MessageType,
} from "../types";
import { verifyJwtSignature } from "../helpers/jwt-helper";
import Message from "../model/Message";
import Conversation from "../model/Conversation";
import { ObjectId } from "mongoose";

// handling in memory online offline status for now later it will be updated with redis
const userOnline: Map<string, string> = new Map();

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
  }

  async onConnection() {
    console.log("User connected :", this.socket.id);
    this.userId = this.socket.id;
    // decode user info
    const token = this.socket.handshake.query.token as string;
    // joining to the room for group chat
    const room = this.socket.handshake.query.room;
    if (room) {
      this.socket.join(room);
    }
    await this.getAuthUser(token);

    // sendMessage
    this.socket.on("send_message", this.sendMessage.bind(this));
    this.socket.on("send_message_group", (message) => {
      this.io.to(room as string).emit("user_message", message);
    });
    this.socket.emit("user_online", `${JSON.stringify(userOnline)}`);
  }

  onDisconnect() {
    console.log("User disconnected :", this.socket.id);
    userOnline.delete(this.userId);
    this.socket.emit("user_online", `${JSON.stringify(userOnline)}`);
  }

  async getAuthUser(token: string) {
    try {
      const decode = verifyJwtSignature(token);
      if (decode?.userId) {
        this.userId = decode.userId;
        userOnline.set(decode.userId, this.socket.id);
      }
    } catch (error: any) {
      console.log(error);
      throw new Error("Invalid token or expired");
    }
  }

  async sendGroupMessage(messageBody: MessageType, room: string) {
    // get the message send it to the
  }

  async getConversation(receiverId: ObjectId, lastMessage: string) {
    let conversation: ConversationType | null;
    conversation = await Conversation.findOne({
      participant: { $all: [this.userId, receiverId] },
    });

    // create conversation if doesn't exist
    if (!conversation) {
      conversation = await Conversation.create({
        participant: [this.userId, receiverId],
        lastMessage: lastMessage,
      });
    }
    return conversation;
  }

  async sendMessage(messageBody: MessageType) {
    if (!messageBody.receiver || !messageBody.message)
      throw new Error("Message needs a receiver and message content");

    const conversation = await this.getConversation(
      messageBody.receiver as ObjectId,
      messageBody.message
    );

    // find the socket id from receiverId from the userOnline list.
    const message: Partial<MessageType> = {
      sender: this.userId,
      receiver: messageBody.receiver,
      message: messageBody.message,
      conversation: conversation.id,
    };

    // if user online then send the message to the socket client
    const userSocket = userOnline.get(messageBody.receiver as string);
    try {
      const savedMessage = await Message.create(message);
      // update he converstation last message and timestamps
      if (conversation) {
        await conversation.updateOne({
          lastMessage: savedMessage.message,
          lastMessageTime: savedMessage.createdAt,
        });
      }

      // sending message through socket
      if (userSocket) this.io.to(userSocket).emit("user_message", savedMessage);
    } catch (error: any) {
      if (error) {
        console.log(error);
        throw new Error(error?.message || "Can't save message");
      }
    }
  }
}
