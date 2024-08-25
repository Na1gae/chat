import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/chat/model/chat.schema';
import { Room, RoomSchema } from 'src/chat/model/room.schema';
import { User, UserSchema } from 'src/chat/model/user.schema';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ChatService } from 'src/chat/chat.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
      HttpModule,
      MongooseModule.forFeature([
          { name: Chat.name, schema: ChatSchema },
          { name: Room.name, schema: RoomSchema },
          { name: User.name, schema: UserSchema },
      ]),
      JwtModule,
      PassportModule
  ],
  providers: [UserService, AuthService, ChatService],
  controllers: [UserController],
  exports: [UserService, PassportModule, JwtModule]
})
export class UserModule {}