import { Types } from "mongoose";

export interface JwtPayload{
    _id: Types.ObjectId,
    userNick: string,
    profileImage: string
}