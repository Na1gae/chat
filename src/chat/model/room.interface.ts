import { UserInterface } from "./user.interface";

export interface RoomInterface{
    id: string,
    name: string,
    users: UserInterface[],
    createdDate: Date,
    updatedDate: Date
}