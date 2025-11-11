export interface JwtPayload{
    aud:string,
    exp:number,
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":string,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string,
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":string,
    iss:string,
    jti:string,


}
export interface GetUserInfoResponse{
    bio:string|null,
    createdAt: string,
    email: string,
    userName:string,
}
export interface GetUserReplyHistoryResponse{
    id:number,
    bookId:number;
    receiverUserId:string,
    actorUserId:string,
    actorUserName:string,
    type:string,
    commentId:number,
    parentCommentContent:string,
    content:string,
    createdAt:Date,
    readAt?:Date,
    pdfPath:string

}
export interface GetUserCommentLikeHistoryResponse{
    id:number,
    bookId:number,
    receiverUserId:string,
    actorUserId:string,
    actorUserName:string,
    content:string,
    type:string,
    commentId:number,
    createdAt:Date,
    readAt?:Date,
    pdfPath:string,

}