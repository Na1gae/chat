import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "./user.schema";
import { Types } from "mongoose";
import { Chat } from "./chat.schema";

@Schema()
export class Room extends Document{
    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
    userIds: Types.ObjectId[]
    
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Chat' }]})
    chatIds: Types.ObjectId[]

    /*@Prop({ required: true, default: "single"})
    roomtype: string*/
}