import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { GetBookInfoResponse, GetAllBooksInfoResponse, GetCommentResponse} from "@/inference/BookCommentResponseType";
import { CommentDataForm, PdfPathDataForm} from "@/inference/BookCommentRequestType";

const BookApi={

    getAllBooks:()=>
        apiBook.get<Response<GetAllBooksInfoResponse[]>>("/Comments/book"),

    getBooksInfoByPdfpath:({pdfPath}:PdfPathDataForm)=>
        apiBook.get<Response<GetBookInfoResponse>>(`/Comments/book/${pdfPath}`),                                                                                                                                                                                

    getBookCommentsByBookId:(bookId:number|null)=>
        apiBook.get<Response<GetCommentResponse[]>>(`/Comments/get-comments/${bookId}`),

    createComments:(comment:CommentDataForm)=>
        apiBook.post<Response<GetCommentResponse>>("/Comments/comments", comment),
    
    createReply:(reply:CommentDataForm)=>
        apiBook.post<Response<GetCommentResponse>>("/Comments/comments",reply)

    
}
export default BookApi