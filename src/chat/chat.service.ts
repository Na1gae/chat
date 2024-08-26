import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
        const room = await this.roomModel.findById(roomId).populate('chatIds').exec();
        if (!room) throw new ForbiddenException('Room not found');

        const userChatrooms = await this.userService.getUserChatrooms(userId);
        const isUserInThatRoom = userChatrooms.includes(roomId);
        
        if(!isUserInThatRoom) throw new ForbiddenException('User is not in this room');
        
        const connectionObjId = new Types.ObjectId(Math.floor(connectionTime.getTime()/1000).toString(16).padEnd(24, '0'))

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
            opponents.map(async (e) => {
                try {
                    const userObjId = await this.userService.getUserObjId(e);
                    return userObjId;
                } catch (error) {
                    console.error(`Error getting ObjectId for user ${e}:`, error);
                    throw error;
                }
            })
        );
        const newRoom = new this.roomModel({
            userIds: [userId, ...opponentsObjIds]
        })
        await newRoom.save()
        return newRoom
    }catch(e){
        if (e instanceof NotFoundException) {
            console.error(`방 생성 실패: ${e.message}`);
            throw e;
        } else {
            console.error('방 만드는데 에러:', e);
            throw new Error('방 만드는데 에러');
        }
    }
    }
}