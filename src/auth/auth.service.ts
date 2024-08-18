import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from 'src/chat/model/user.interface';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly httpService: HttpService, private readonly configService: ConfigService){}

    async generateJWT(user: UserInterface): Promise<string>{ //추후 user는 UserInterface 적용
        return this.jwtService.signAsync({user})
    }

    async passwordHash(password: string): Promise<string>{
        return 
        //bcrypt
    }

    async comparePassword(password: string, hashedPassword: string): Promise<any>{
    
    }

    async validateRecaptcha(token: string): Promise<boolean>{
        const url = 'https://google.com/recaptcha/api/siteverify'
        try{
            const res = await this.httpService.axiosRef.post(url, null, {
                params:{
                    secret: this.configService.get('RECAPTCHA_SECRET_KEY'),
                    response: token
                }
            })
            const {success} = res.data

            if(!success) throw new BadRequestException('reCAPTCHA failed')
            
            return true
        }catch(error){
            throw new BadRequestException('reCAPTCHA failed')
        }
    }

    verifyJwt(jwt: string): Promise<any>{
        return this.jwtService.verifyAsync(jwt)
    }
}
