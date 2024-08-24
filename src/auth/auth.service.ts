import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { UserInterface } from 'src/chat/model/user.interface';
import * as bcrypt from 'bcrypt'
import { UserService } from 'src/user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/chat/model/user.schema';
import { Model } from 'mongoose';
import { JwtPayload } from './strategies/jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService, private readonly httpService: HttpService, private readonly configService: ConfigService, private readonly userService: UserService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async generateJWT(user: UserInterface): Promise<string>{
        return this.jwtService.signAsync({user})
    }

    async passwordHash(password: string): Promise<string>{
        const saltRounds = this.configService.get<number>('PASSWORD_SALT')
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        return hashedPassword
    }

    async comparePassword(password: string, hashedPassword: string): Promise<boolean>{
        if(await bcrypt.compare(password, hashedPassword)) return true
        else return false
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
        }catch(err){
            throw new BadRequestException('reCAPTCHA failed')
        }
    }

    verifyJwt(jwt: string): Promise<any>{
        return this.jwtService.verifyAsync(jwt)
    }

    //Sign in
    async signIn(userId: string, typedpassword: string): Promise<any>{
        const hashedPassword = await this.userService.gethashedPasswordByUserId(userId)
        const res = await this.comparePassword(typedpassword, hashedPassword)
        
        if(!res) throw new UnauthorizedException()
        
        const user = await this.userModel.findOne({ userId }).exec()
        const jwtreturn: JwtPayload = {
            _id: user._id,
            userNick: user.userNick,
            profileImage: user.profileImage,
        }

        const accessToken = this.jwtService.sign(jwtreturn)
        return { messsage:"success", accessToken: accessToken }
    }
    
    //Sign up
    async signUp(userId: string, typedpassword: string, userNick: string, profileImage: string): Promise<any>{
        const hashedPassword = await this.passwordHash(typedpassword)
        const newUser = new this.userModel({
            userId: userId,
            userNick: userNick,
            password: hashedPassword,
            profileImage: profileImage,
            date: Date.now()
        })
        return newUser.save()
    }

    async decodeToken(token: string): Promise<JwtPayload>{
        try{
            const decoded = this.jwtService.verify<JwtPayload>(token)
            return decoded
        }catch(err){
            throw new ForbiddenException()
        }
    }
}
