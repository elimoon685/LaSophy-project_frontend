
export interface GetBookInfoResponse{

    id:number;
    title:string;
    author:string;
    year:string;
    currentUserLike:boolean;
    currentUserCollect:boolean;
    likeCount:number;
    collectCount:number;
    commentCount:number;

}
export interface GetAllBooksInfoResponse{
    id:number;
    title:string;
    author:string;
    year:string;
    pdfPath:string;
    imgPath:string;
    likeCount:number;
    collectCount:number;
    commentCount:number;

}
export interface CreateCommentResponse{
    addedResult: GetCommentResponse
}

export interface GetCommentResponse{

    commentsId:number,
    content: string,
    createdBy:string,
    userId:string,
    createdAt:Date,
    bookId:number,
    parentCommentId:number|null,
    replies:Array<GetCommentResponse>
}