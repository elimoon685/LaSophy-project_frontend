import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { ToggleBookCollect,ToggleBookLike, ToggleCommentLike} from "@/inference/BookCommentRequestType";
import { GetUserBookLikeResponse, GetUserBookCollectResponse} from "@/inference/UserResponseType";
const LikeOrCollectApi={

    getCurrentLikeCount:(toggleLike:ToggleBookLike)=>
        apiBook.post<Response<number>>("/Interactive/book-like", toggleLike),

    getCurrentCollectCount:(toggleCollect:ToggleBookCollect)=>
        apiBook.post<Response<number>>("/Interactive/book-collect", toggleCollect),

    getCurrentCommentLike:(toggleCommentFormFata:ToggleCommentLike)=>
        apiBook.post<Response<number>>("/Interactive/like-comment",toggleCommentFormFata),

    getAllBookLikeByUserId:(userId:string)=>
        apiBook.get<Response<GetUserBookLikeResponse[]>>(`/Interactive/book-like/${userId}`,),

    getAllBookCollectByUserId:(userId:string)=>
        apiBook.get<Response<GetUserBookCollectResponse[]>>(`/Interactive/book-collect/${userId}`),

    deleteUserBookCollectById:(id:number)=>
        apiBook.delete<Response<boolean>>(`/Interactive/delete/book-collect/${id}`),

    deleteUserBookLikeById:(id:number)=>
        apiBook.delete<Response<boolean>>(`/Interactive/delete/book-like/${id}`),
    
}

export default LikeOrCollectApi