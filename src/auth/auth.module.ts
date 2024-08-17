import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigModule],
            useFactory: async(configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET_CODE'),
                signOptions: {expiresIn: '100000'}
            })
        })
    ],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
