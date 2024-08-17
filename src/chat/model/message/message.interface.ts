export interface MessageInterface{
    id: string,
    content: string,
    user: string, //UserInterface
    room: string, //RoomInterface
    timestamp: number
}