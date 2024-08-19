import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { User } from "./user.schema"
import { v4 as uuidv4 } from "uuid" 
import { IsDate, IsNotEmpty } from "class-validator";

@Schema()
export class Chat extends Document{
  @Prop({default: () => uuidv4() })
  chatId: string

  @Prop({ type: Types.ObjectId, ref: 'User' , required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  @IsNotEmpty()
  message: string;

  @Prop({ type: Types.ObjectId, ref: 'Room', required: true })
  roomId: Types.ObjectId;

  @Prop({required: true, default: Date.now()})
  @IsDate()
  date: Date

  @Prop({ required: true, default: "string" })
  @IsNotEmpty()
  contentType: string
}

export const ChatSchema = SchemaFactory.createForClass(Chat)