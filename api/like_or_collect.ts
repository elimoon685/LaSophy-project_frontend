import { apiBook } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { ToggleBookCollect,ToggleBookLike, ToggleCommentLike} from "@/inference/BookCommentRequestType";

const LikeOrCollectApi={

    getCurrentLikeCount:(toggleLike:ToggleBookLike)=>
        apiBook.post<Response<number>>("/Interactive/book-like", toggleLike),

    getCurrentCollectCount:(toggleCollect:ToggleBookCollect)=>
        apiBook.post<Response<number>>("/Interactive/book-collect", toggleCollect),

    getCurrentCommentLike:(toggleCommentFormFata:ToggleCommentLike)=>
        apiBook.post<Response<number>>("/Interactive/like-comment",toggleCommentFormFata)
}

export default LikeOrCollectApi