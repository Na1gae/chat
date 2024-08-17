import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { MessageInterface } from './model/message/message.interface';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() //CORS
  server : Server

  constructor(
    private authService: AuthService
  ){}

  clients: {[socketId: string]: boolean} = {}
  clientNick: {[socketId: string]: string} = {}
  roomUsers: {[key:string]: string[]} = {}

  handleConnection(client: Socket): void{
    //JWT 검증 추가
    if(this.clients[client.id]){
      client.disconnect(true)
    }
    this.clients[client.id] = true
  }

  handleDisconnect(client: Socket) {
    //다른 서비스로 뺄 예정
    delete this.clients[client.id]

    Object.keys(this.roomUsers).forEach((r) =>{{
      const idx = this.roomUsers[r]?.indexOf(this.clientNick[client.id])
      if (idx !== -1){
        this.roomUsers[r].splice(idx, 1)
        this.server.to(r).emit('disconnect', {userNick: this.clientNick[client.id],userId: client.id, r})
      }
    }})
  }
  
  @SubscribeMessage('chat')
    async addMessage(socket: Socket, message: MessageInterface){
      //const createdMessage: MessageInterface = await this.messageService.create({...message, user: })
      //const joinedUsers: JoinedRoomInterface[] = await this.joinedRoomService.findByRoom(room)
      /*for(const user of joinedUsers){
        await this.server.to(user.socketId).emit('', createdMessage)
      }*/
    }
}

/*
  @SubscribeMessage('join')
  handleJoin(client: Socket, room: string){
    if(client.rooms.has(room)) return

    client.join(room)
    if(!this.roomUsers[room]){
      this.roomUsers[room] = []
    }

    this.roomUsers[room].push(this.clientNick[client.id])
    this.server.to(room).emit('join', {userNick: this.clientNick[client.id],userId: client.id, room})
    this.server.to(room).emit('userList', {room, userList: this.roomUsers[room]})
  }

  @SubscribeMessage('exit')
  handleExit(client: Socket, room: string){
    if(client.rooms.has(room)) return
    
    client.leave(room)

    const idx = this.roomUsers[room]?.indexOf(this.clientNick[client.id])
      if (idx !== -1){
        this.roomUsers[room].splice(idx, 1)
        this.server.to(room).emit('left', {userNick: this.clientNick[client.id], userId: client.id, room})
        this.server.to(room).emit('userList', {room, userList: this.roomUsers[room]})
      }
  } */
