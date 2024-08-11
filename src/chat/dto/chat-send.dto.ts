import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class ChatSendDto{
    @IsNotEmpty()
    id: string
    
    @IsNotEmpty()
    sendersId: string

    @IsNotEmpty()
    content: string

    @IsNotEmpty()
    @IsNumber()
    timestamp: number
}