import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { GetBookInfoResponse, GetAllBooksInfoResponse, GetCommentResponse} from "@/inference/BookCommentResponseType";
import { CommentDataForm, PdfPathDataForm} from "@/inference/BookCommentRequestType";

const BookApi={

    getAllBooks:()=>
        apiBook.get<Response<GetAllBooksInfoResponse[]>>("/Comments/book"),

    getBooksInfoByBookId:(bookId:number|null)=>
        apiBook.get<Response<GetBookInfoResponse>>(`/Comments/book/${bookId}`),                                                                                                                                                                              

    getBookCommentsByBookId:(bookId:number|null)=>
        apiBook.get<Response<GetCommentResponse[]>>(`/Comments/get-comments/${bookId}`),

    createComments:(comment:CommentDataForm)=>
        apiBook.post<Response<GetCommentResponse>>("/Comments/comments", comment),
    
    createReply:(reply:CommentDataForm)=>
        apiBook.post<Response<GetCommentResponse>>("/Comments/comments",reply),

    DeleteComment:(commentId:number)=>
        apiBook.delete<Response<boolean>>(`/Comments/delete-comment/${commentId}`)

    
}
export default BookApi