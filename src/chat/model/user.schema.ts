import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export type UserDocument = User & Document

@Schema()
export class User{
    @Prop({required: true, unique: true})
    @IsString()
    @IsNotEmpty()
    userId: string

    @Prop({required: true, unique: true})
    @IsString()
    @IsNotEmpty()
    userNick: string

    @Prop({required: true})
    @IsString()
    @IsNotEmpty()
    password: string

    @Prop({required: true, default: ""})
    @IsString()
    profileImage: string
}

export const UserSchema = SchemaFactory.createForClass(User)
