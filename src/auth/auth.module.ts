import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { UserService } from 'src/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from 'src/chat/model/chat.schema';
import { Room, RoomSchema } from 'src/chat/model/room.schema';
import { User, UserSchema } from 'src/chat/model/user.schema';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigModule],
            useFactory: async(configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_CODE'),
                signOptions: {expiresIn: '10000'}
            })
        }),
        MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
        MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UserModule, HttpModule],
    providers: [AuthService, JwtStrategy, ConfigService, UserService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
