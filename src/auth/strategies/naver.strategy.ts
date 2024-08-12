import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver";


@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver'){
    constructor(private readonly configService: ConfigService){
        super({
        clientID: configService.get('NAVER_PUBLIC'),
        clientSecret: configService.get('NAVER_SECRET'),
        callbackURL: configService.get('NAVER_CALLBACK')
        })
    }

    async validate(
        accessToken: string, refreshToken: string, profile: Profile, done: (error: string, user?: string, info?: any) => void
    ){
        try{
            const {_json} = profile
            const res = {
                id: _json.id,
                name: _json.nickname,
                photo: _json.profile_image,
                accessToken
            }
            done(null, `${res}`)
        }catch(e){
            done(e)
        }
    }
}