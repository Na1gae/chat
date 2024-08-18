import { RoomInterface } from "./room.interface";
import { UserInterface } from "./user.interface";

export interface MessageInterface{
    id: string,
    content: string,
    user: UserInterface,
    room: RoomInterface,
    timestamp: number
}