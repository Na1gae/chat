import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

    async generateJWT(user: string): Promise<string>{ //추후 user는 UserInterface 적용
        return this.jwtService.signAsync({user})
    }

    async passwordHash(password: string): Promise<string>{
        return 
        //bcrypt or SHA
    }

    async comparePassword(password: string, hashedPassword: string): Promise<any>{
    
    }

    verifyJwt(jwt: string): Promise<any>{
        return this.jwtService.verifyAsync(jwt)
    }
}
