import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Types } from "mongoose";
import { Chat } from "./chat.schema";

export type RoomDocument = Room & Document

@Schema()
export class Room{
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    userIds: Types.ObjectId[]
    
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Chat' }]})
    chatIds: Types.ObjectId[]

    /*@Prop({ required: true, default: "single"})
    roomtype: string*/
}

export const RoomSchema = SchemaFactory.createForClass(Room)