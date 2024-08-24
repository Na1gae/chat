import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './model/chat.schema';
import { Room, RoomSchema } from './model/room.schema';
import { User, UserSchema } from './model/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
      HttpModule,
      JwtModule,
      AuthModule,
      UserModule,
      MongooseModule.forFeature([
          { name: Chat.name, schema: ChatSchema },
          { name: Room.name, schema: RoomSchema },
          { name: User.name, schema: UserSchema }
      ])
  ],
  providers: [ChatService, ChatGateway, UserService, AuthService],
  exports: [ChatService]
})
export class ChatModule {}
