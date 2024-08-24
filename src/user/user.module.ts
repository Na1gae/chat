import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/chat/model/chat.schema';
import { Room, RoomSchema } from 'src/chat/model/room.schema';
import { User, UserSchema } from 'src/chat/model/user.schema';
import { UserService } from './user.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
      ],
      providers: [UserService,UserController],
      exports: [UserService]
})
export class UserModule {}
