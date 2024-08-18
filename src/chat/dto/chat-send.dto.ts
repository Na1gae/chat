import { IsNotEmpty, IsString } from "class-validator"

export class ChatSendDto{
    @IsNotEmpty()
    @IsString()
    content: string
}