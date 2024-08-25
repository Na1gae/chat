export interface JwtPayload{
    _id: string, //-> Types.ObjectId
    userNick: string,
    profileImage: string,
    userId: string
}