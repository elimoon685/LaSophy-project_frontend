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
    parentCommentId:number| null
}

export interface PdfPathDataForm{
    pdfPath:ParamValue
}