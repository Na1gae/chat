import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageInterface } from './model/message.interface';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from 'src/auth/guard/ws-jwt-auth.guard';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { Types } from 'mongoose';
import { ChatService } from './chat.service';

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
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: Types.ObjectId, roomId: Types.ObjectId}
  ){
    client.join(`${payload.userId} -> ${payload.roomId}`)
    const connectionTime = new Date(Date.now())
    const perviousMessages = await this.chatSerivce.getPreviousMessage(payload.userId, payload.roomId, connectionTime)
    client.emit('previousMessages', perviousMessages)
  }
  
  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
      @ConnectedSocket() socket: Socket, 
      @MessageBody() payload: {senderId: Types.ObjectId, roomId: Types.ObjectId, content: string}
    ){
      const chat = await this.chatSerivce.saveMessage(payload.senderId, payload.roomId, payload.content)
      socket.to(payload.roomId.toString()).emit('newMsg', chat)
    }
}