import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
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
        JwtModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET_CODE'),
                signOptions: { expiresIn: '10000' }
            }),
            inject: [ConfigService]
        }),
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Room.name, schema: RoomSchema },
            { name: User.name, schema: UserSchema }
        ]),
        HttpModule, 
        UserModule
    ],
    providers: [AuthService, JwtStrategy, JwtService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
