import { Params, ParamValue } from "next/dist/server/request/params";
export interface UploadFormData{
        
    BookName:string;
    Author:string;
    Year:string;
    PDF:File | null;
    IMG:File | null;
}

export interface BookInfo{

    Title:string;
    Author:string;
    Year:string;
    PdfPath:string;
    ImgPath:string;
}
export interface InterativeFormData{
    bookid:number
}

export interface CommentDataForm{
    bookId:number|null,
    content: string,
    parentCommentId?:number|undefined
}
export interface PdfPathDataForm{
    pdfPath:ParamValue
}
export interface ToggleBookLike{
    bookId: number|undefined,
    isLiked:boolean
}
export interface ToggleBookCollect{
    bookId: number|undefined,
    isCollected:boolean
}

export interface ToggleCommentLike{
    commentId:number,
    isLiked:boolean
}
