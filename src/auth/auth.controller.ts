import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { NaverLoginResultDto } from './dto/auth_Naver_OutputDto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Get('/naver/')
    @UseGuards(AuthGuard('naver'))
    async naverAuth(@Req() req: Request){}

    @Get('/naver/callback')
    @UseGuards(AuthGuard('naver'))
    async naverAuthCallback(@Req() req: Request, @Res() res: Response): Promise<NaverLoginResultDto>{
        return;
    }
}
