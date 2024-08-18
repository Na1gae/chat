import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageInterface } from './model/message.interface';
import { UseGuards } from '@nestjs/common';
import { WsJwtAuthGuard } from 'src/auth/guard/ws-jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  cors: {
  origin: '*'
}})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server : Server

  constructor(
    private authService: UserService
  ){}

  handleConnection(client: Socket){}
  handleDisconnect(client: Socket){}

  @UseGuards(WsJwtAuthGuard)
  @SubscribeMessage('chat')
    async addMessage(socket: Socket, message: MessageInterface){
      //const createdMessage: MessageInterface = await this.messageService.create({...message, user: })
      //const joinedUsers: JoinedRoomInterface[] = await this.joinedRoomService.findByRoom(room)
      /*for(const user of joinedUsers){
        await this.server.to(user.socketId).emit('', createdMessage)
      }*/
    }
}