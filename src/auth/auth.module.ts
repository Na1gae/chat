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
import { FileModule } from 'src/file/file.module';

@Module({
    imports: [
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: '3600s' }
            }),
        }),
        MongooseModule.forFeature([
            { name: Chat.name, schema: ChatSchema },
            { name: Room.name, schema: RoomSchema },
            { name: User.name, schema: UserSchema }
        ]),
        HttpModule, 
        UserModule,
        FileModule,
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
