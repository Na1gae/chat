import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server : Server

  clients: {[socketId: string]: boolean} = {}
  clientNick: {[socketId: string]: string} = {}
  roomUsers: {[key:string]: string[]} = {}

  handleConnection(client: Socket): void{
    if(this.clients[client.id]){
      client.disconnect(true)
    }
    this.clients[client.id] = true
  }

  handleDisconnect(client: Socket) {
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
  handleChat(client: Socket, dat: {content: string, room: string}){
    const rdat = {
      userId: client.id,
      userNick: this.clientNick[client.id],
      msg: dat.content,
      room: dat.room,
      time: Date.now()
    }
    this.server.to(dat.room).emit('chat', )
  }

  @SubscribeMessage('setClientNick')
  handlesetClientNick(client: Socket, nick: string){
    this.clientNick[client.id] = nick
  }

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
  }
}
