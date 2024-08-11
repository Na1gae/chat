import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatSendDto } from './dto/chat-send.dto';

@Injectable()
@WebSocketGateway(3000, {transports: ['websocket']})
export class ChatService {
    @WebSocketServer()
    server: Server

    @SubscribeMessage('ClientToServer')
    handleClient_Server(@MessageBody() {}: ""){//로그
        }

    @SubscribeMessage('A')
    handle_All_R(@MessageBody() chatDat : ChatSendDto): WsResponse{
        const chatdat = chatDat
        this.server.emit(`${chatdat}`)
        return ;
    }
}
