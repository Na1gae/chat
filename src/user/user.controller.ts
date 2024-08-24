import { Body, Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ChatService } from 'src/chat/chat.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly chatService: ChatService
    ){}

    @Get('/idJungbok')
    async idjungbok(@Body('id') id: string){
        return this.userService.idJungbok(id)
    }

    @Get('/profileimg')
    @UseGuards(JwtAuthGuard)
    async getProfileimgByid(@Body('id') id: string){ //JWT Permission Check 추가
        return this.userService.profileimg(id)
    }

    @Get('/getChatrooms')
    @UseGuards(JwtAuthGuard)
    async getChatroomsByuserId(@Headers('authorization') authheader: string){ //userId -> JWT
        const token = authheader?.split(' ')[1];
        const userData = await this.authService.decodeToken(token);
        return this.userService.getUserChatrooms(userData._id)
    }

    @Get('/getChats')
    @UseGuards(JwtAuthGuard)
    async getChatByRoomId(@Headers('authorization') authheader: string, roomId: Types.ObjectId){ //userId -> JWT
        const token = authheader?.split(' ')[1];
        const userData = await this.authService.decodeToken(token);
        return this.userService.getChatsByRoomId(userData.userId, roomId)
    }

    @Get('/makeChatroom')
    @UseGuards(JwtAuthGuard)
    async makeChatroom(@Headers('authorization') authheader: string, @Body('opponents') opponentIds: string[]){
        const token = authheader?.split(' ')[1];
        const userData = await this.authService.decodeToken(token);
        return this.chatService.makeNewRoom(userData._id, opponentIds)
    }
}
