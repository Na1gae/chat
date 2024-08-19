import { Body, Controller, Get, Headers } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){}

    @Get('/idJungbok')
    async idjungbok(@Body('id') id: string){ //횟수 카운트 추가
        return this.userService.idJungbok(id)
    }

    @Get('/profileimg')
    async getProfileimgByid(@Body('id') id: string){ //JWT Permission Check 추가
        return this.userService.profileimg(id)
    }

    @Get('/getChatrooms')
    async getChatroomsByuserId(userId: string){ //userId -> JWT
        return this.userService.getUserChatrooms(userId)
    }

    @Get('/getChats')
    async getChatByRoomId(@Body('id') roomId: string, userId :string ){ //userId -> JWT
        return this.userService.getChatsByRoomId(userId, roomId)
    }
}
