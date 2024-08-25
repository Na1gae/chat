export interface JwtPayload{
    sub: string,
    _id: string, //-> Types.ObjectId
    userNick: string,
    profileImage: string,
}