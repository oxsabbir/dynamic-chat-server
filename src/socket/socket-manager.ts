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

    // socket event binding

    this.socket.on("send_message", this.sendMessage.bind(this));
    this.socket.on("send_group_message", (message) => {
      this.sendGroupMessage.call(this, message, room);
    });

    this.io.emit("user_online", Object.fromEntries(userOnline));
  }

  onDisconnect() {
    console.log("User disconnected :", this.socket.id);
    userOnline.delete(this.userId);
    this.io.emit("user_online", Object.fromEntries(userOnline));
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

  async sendGroupMessage(
    messageBody: MessageType,
    roomId: string | string[] | undefined
  ) {
    // get the message send it to the
    console.log(roomId);
    await this.sendMessage(messageBody, "group", roomId);
    // check if conversation exist with the group id
    // if not create one and add it to the message
  }

  async getConversation(
    receiverId: ObjectId,
    lastMessage: string,
    sentTo: "dm" | "group" = "dm"
  ) {
    // if sentTo dm the receive will be the user to send, else it will be the group id
    let conversation: ConversationType | null;

    const matchCondition =
      sentTo === "group"
        ? {
            group: receiverId,
            isGroup: true,
          }
        : {
            participant: { $all: [this.userId, receiverId] },
          };

    // assigning the conversation
    conversation = await Conversation.findOne(matchCondition);

    // create conversation if doesn't exist
    // checking the sent type
    const newConversation: any =
      sentTo === "group"
        ? { isGroup: true, group: receiverId, lastMessage: lastMessage }
        : {
            participant: [this.userId, receiverId],
            lastMessage: lastMessage,
          };
    if (!conversation) {
      conversation = await Conversation.create(newConversation);
    }
    return conversation;
  }

  async sendMessage(
    messageBody: MessageType,
    sentTo: "dm" | "group" = "dm",
    roomId?: string | string[]
  ) {
    if (!messageBody.receiver || !messageBody.message)
      throw new Error("Message needs a receiver and message content");

    const conversation = await this.getConversation(
      messageBody.receiver as ObjectId,
      messageBody.message,
      sentTo
    );

    // find the socket id from receiverId from the userOnline lispt.
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
      if (sentTo === "group" && roomId) {
        this.io
          .to(message.receiver as string)
          .emit("user_message", savedMessage);
      } else if (userSocket) {
        this.io.to(userSocket).emit("user_message", savedMessage);
      }
    } catch (error: any) {
      if (error) {
        console.log(error);
        throw new Error(error?.message || "Can't save message");
      }
    }
  }
}
