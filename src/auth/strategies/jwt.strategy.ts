import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from 'passport-jwt'
import { UserService } from "src/user/user.service";
import { JwtPayload } from "./jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
        const secret = configService.get<string>('JWT_SECRET')
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "H1k$8f2n0!z7jG5Q@Kx&V9pLqD3mN6uT^X8wR0yE7oB2sF1cI4rA"
        })
    }

    async validate(payload: JwtPayload){
        const user = await this.userService.getUserObjId(payload.userId)
        if(!user) throw new UnauthorizedException()
        return user
    }
}