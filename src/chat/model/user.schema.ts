import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

@Schema()
export class User extends Document{
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

    @Prop({required: true, default: Date.now()})
    @IsDate()
    date: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
