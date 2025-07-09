import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
const LikeOrCollectApi={

    getCurrentLikeCount:(bookId:number|undefined)=>
        apiBook.post<Response<number>>("LikeCollect/like", {bookId:bookId}),

    getCurrentCollectCount:(bookId:number|undefined)=>
        apiBook.post<Response<number>>("LikeCollect/collect", {bookId:bookId}),

    getCurrentCommentLike:(commentId:number|undefined)=>
        apiBook.post<Response<number>>("/LikeCollect/comment-like",commentId)
}

export default LikeOrCollectApi