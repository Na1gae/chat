import { ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";
import { WsException } from "@nestjs/websockets";

@Injectable()
export class WsJwtAuthGuard extends AuthGuard('jwt'){
    constructor(private readonly jwtService:JwtService){ super() }

    canActivate(context: ExecutionContext){
        const client = context.switchToWs().getClient()
        const authToken = client.handshake.headers.authorization

        if(!authToken) throw new WsException('인증 토큰 필요')

        try{
            const token = authToken.split(' ')[1]
            const payload = this.jwtService.verify(token)
            client.request.user = payload
            return true
        }catch(error){
            throw new WsException('잘못된 토큰')
        }
    }
}