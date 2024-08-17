import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ChatSendDto{
    @IsNotEmpty()
    content: string
}