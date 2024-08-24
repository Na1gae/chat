import { ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from 'src/chat/model/chat.schema';
import { Room } from 'src/chat/model/room.schema';
import { User } from 'src/chat/model/user.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @InjectModel(Room.name) private roomModel: Model<Room>,
        @InjectModel(User.name) private userModel: Model<User>
    ){} 

    async idJungbok(id: string): Promise<boolean>{ //TRUE : 가능, FALSE: 불가능
        const user = await this.userModel.findOne({userId: id}).exec()
        if(user) return false
        else return true
    }
    async profileimg(id: string): Promise<string>{
        const user = await this.userModel.findOne({userId: id}).exec()
        //const user = await this.userModel.findOne({_id: id}).exec()
        return user.profileImage
    }
    async getUserChatrooms(userId: Types.ObjectId){
        const rooms = await this.roomModel.find({userIds: userId}).exec()
        const roomIds = rooms.map(room => room._id)
        return roomIds
    }
    async getChatsByRoomId(userId: string, roomId: string){
        const roomObjId = new Types.ObjectId(roomId)
        const room = await this.roomModel.findById(roomObjId).exec()
        if(!room) throw new NotFoundException("Room Not found")
        const user = await this.userModel.findOne({userId}).exec()
        if(!user) throw new ForbiddenException("")

        const chats = await this.chatModel.find({roomId: roomObjId}).exec()
        const res = chats.map(chat => ({
            content: chat.message,
            time: chat.date.toString(),
            contentType: chat.contentType
        }))
        return res
    }
    async getUsersByRoomId(userId: string, roomId: string){
        const roomObjId = new Types.ObjectId(roomId)
        const room = await this.roomModel.findById(roomObjId).exec()
        if(!room) throw new NotFoundException("Room Not found")
        const user = await this.userModel.findOne({userId}).exec()
        if(!user) throw new ForbiddenException("")
        const users = await this.userModel.find({
            userId: { $in: room.userIds }
        }).exec()
        const res = users.map(user => {
            _id: user.userId;
            profileImage: user.profileImage;
            userNick: user.userNick;
        })
        return res
    }
    async gethashedPasswordByUserId(userId: string){
        const user = await this.userModel.findOne({userId}).exec()
        if(!user) throw new NotFoundException("")
        const res = user.password
        return res
    }
}
