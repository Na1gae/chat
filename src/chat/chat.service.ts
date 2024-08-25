import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './model/chat.schema';
import { Model, Types } from 'mongoose';
import { Room, RoomDocument } from './model/room.schema';
import { UserService } from 'src/user/user.service';
import { UserDocument } from './model/user.schema';

@Injectable()
export class ChatService {
    constructor(
        @InjectModel("Chat") private readonly chatModel: Model<ChatDocument>,
        @InjectModel("Room") private readonly roomModel: Model<RoomDocument>,
        @InjectModel("User") private readonly userModel: Model<UserDocument>,
        private readonly userService: UserService
    ){}

    async saveMessage(senderId: Types.ObjectId, roomId: Types.ObjectId, message: string): Promise<Chat>{
        const chat = new this.chatModel({senderId, roomId, message})
        const savedChat = await chat.save()

        await this.roomModel.findByIdAndUpdate(roomId, {
            $push: {chatIds: savedChat._id}
        })
        return savedChat
    }

    async getPreviousMessage(userId: Types.ObjectId, roomId: Types.ObjectId, connectionTime: Date): Promise<Chat[]>{
        const room = await this.roomModel.findById(roomId).populate('chatIds').exec()
        //const user = await this.userModel.findById(userId).exec()
        const isUserInThatRoom = await (await this.userService.getUserChatrooms(userId)).includes(userId)
        
        if(!room || !isUserInThatRoom) throw new ForbiddenException()
        
        const connectionObjId = new Types.ObjectId(Math.floor(connectionTime.getTime()/1000).toString(16)+"0000000000000000")

        return this.chatModel
        .find({
            _id: {$lt: connectionObjId, $in: room.chatIds}
        })
        .sort({_id: 1})
        .exec()
    }

    async makeNewRoom(userId: Types.ObjectId, opponents: string[]): Promise<Room>{
    try{
        const opponentsObjIds = await Promise.all(
            opponents.map(async (e) => this.userService.getUserObjId(e))
        );
        const newRoom = new this.roomModel({
            userIds: [userId, ...opponentsObjIds]
        })
        return await newRoom.save()
    }catch(e){}
    
    }
}