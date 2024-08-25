import { Body, Controller, Get, Headers, NotFoundException, UseGuards } from '@nestjs/common';
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
    async getProfileimgByid(@Body('id') id: string){
        return this.userService.profileimg(id)
    }

    @Get('/getChatrooms')
    async getChatroomsByuserId(@Headers('authorization') authheader: string){
        const token = authheader?.split(' ')[1];
        const userData = await this.authService.decodeToken(token);
        const objUserId = new Types.ObjectId(userData._id)
        return this.userService.getUserChatrooms(objUserId)
    }

    @Get('/getChats')
    async getChatByRoomId(@Headers('authorization') authheader: string, roomId: string){
        const token = authheader?.split(' ')[1];
        const userId = new Types.ObjectId((await this.authService.decodeToken(token))._id)
        const objroomId = new Types.ObjectId(roomId)
        return this.userService.getChatsByRoomId(userId, objroomId)
    }

    @Get('/makeChatroom')
    async makeChatroom(@Headers('authorization') authheader: string, @Body('opponents') opponentIds: string[]){
        const token = authheader?.split(' ')[1];
        const userId = new Types.ObjectId((await this.authService.decodeToken(token))._id)
        if(opponentIds.length<1)
        return this.chatService.makeNewRoom(userId, opponentIds)
    }

    @Get('/getUsersByRoomId')
    async getUsersByRoomId(@Headers('authorization') authheader: string, @Body('roomId') roomId: string){
        const token = authheader?.split(' ')[1]
        const userId = new Types.ObjectId((await this.authService.decodeToken(token))._id)
        const roomObjId = new Types.ObjectId(roomId)
        return this.userService.getUsersByRoomId(userId, roomObjId)
    }

    @Get('/getUserInfo')
    async getUserInfo(@Body('userId') userId: string){
        const user = await this.userService.getUserInfoByUserId(userId)
        if(!user) throw new NotFoundException
        const res = {
            userId: user.userId,
            userNick: user.userNick,
            profileImage: user.profileImage
        }
        return res
    }
}
