import { PartialType } from "@nestjs/mapped-types";
import { ChatSendDto } from "./chat-send.dto";

export class UpdateChatDto extends PartialType(ChatSendDto){}