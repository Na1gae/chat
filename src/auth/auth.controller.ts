import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FileService } from 'src/file/file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly fileService: FileService
    ){}

    @Post('captcha')
    async captcha(@Body() body: any){
        const { recaptchaToken } = body
        
        const isValid = await this.authService.validateRecaptcha(recaptchaToken)

        return isValid
    }

    @Post('login')
    async login(@Body('userId') userId: string, @Body('password') password:string){
        const res = await this.authService.signIn(userId, password)
        return res
    }

    @Post('signup')
    @UseInterceptors(FileInterceptor('profileImage'))
    async signup(
        @Body('userId') userId: string,
        @Body('password') password: string,
        @Body('userNick') userNick: string,
        @UploadedFile() profileImage?: Express.Multer.File
    ){
        try{
            const profileImgUrl = profileImage ? profileImage.filename: ''
            const user = await this.authService.signUp(userId, password, userNick, profileImgUrl)
            return { message: "Success", user}
        }catch(err){
            return { message: err.message}
    }
    }
}
