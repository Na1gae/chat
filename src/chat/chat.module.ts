import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './model/chat.schema';
import { Room, RoomSchema } from './model/room.schema';
import { User, UserSchema } from './model/user.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [ChatService, ChatGateway, ChatService],
      exports:[ChatService]
})
export class ChatModule {}
