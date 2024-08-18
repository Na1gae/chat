import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('captcha')
    async captcha(@Body() body: any){
        const { recaptchaToken } = body
        
        const isValid = await this.authService.validateRecaptcha(recaptchaToken)

        if(isValid) return true
        else return false
    }

    @Post('login')
    async login(){}

    @Post('signup')
    async signup(){}

}
