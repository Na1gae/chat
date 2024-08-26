import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageInterface } from './model/message.interface';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from 'src/auth/guard/ws-jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { Types } from 'mongoose';
import { ChatService } from './chat.service';
import { IncomingMessage } from 'http';

declare module 'http' {
  interface IncomingMessage {
    user?: any;
  }
}

@WebSocketGateway({
  namespace: '/chat',
  cors: {
  origin: '*'
}})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server : Server

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly chatSerivce: ChatService
  ){}

  handleConnection(client: Socket){
    console.log(`Connected: ${client}`)
  }
  handleDisconnect(client: Socket){
    console.log(`Disconnected: ${client}`)
  }

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: { roomId: string}
  ){
    console.log(`${socket.request.user._id} joined room ${payload.roomId}`)
    socket.join(payload.roomId)
    console.log(`User ${socket.request.user._id} joined room ${payload.roomId}`)
    const connectionTime = new Date(Date.now())
    const perviousMessages = await this.chatSerivce.getPreviousMessage(new Types.ObjectId(socket.request.user._id as string), new Types.ObjectId(payload.roomId), connectionTime)
    console.log(perviousMessages)
    this.server.emit('previousMessages', perviousMessages)
  }
  
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
      @ConnectedSocket() socket: Socket, 
      @MessageBody() payload: {roomId: string, content: string}
    ){
      const chat = await this.chatSerivce.saveMessage(socket.request.user._id, payload.roomId, payload.content)
      console.log(`User ${socket.request.user._id} sent message to room ${payload.roomId}`)
      console.log(`rooms joined: ${Array.from(socket.rooms)}`)
      this.server.to(payload.roomId).emit('receiveMessage', chat)
    }
}