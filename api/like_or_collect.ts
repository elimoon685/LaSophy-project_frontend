import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { ToggleBookCollect,ToggleBookLike } from "@/inference/BookCommentRequestType";
const LikeOrCollectApi={

    getCurrentLikeCount:(toggleLike:ToggleBookLike)=>
        apiBook.post<Response<number>>("/Interactive/book-like", toggleLike),

    getCurrentCollectCount:(toggleCollect:ToggleBookCollect)=>
        apiBook.post<Response<number>>("/Interactive/book-collect", toggleCollect),

    getCurrentCommentLike:(commentId:number|undefined)=>
        apiBook.post<Response<number>>("/Interactive/like-comment",{commentId: commentId})
}

export default LikeOrCollectApi