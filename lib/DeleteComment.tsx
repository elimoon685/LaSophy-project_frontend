import { GetCommentResponse } from "@/inference/BookCommentResponseType";


export function DeleteComment(comments:GetCommentResponse[], commentId:number):GetCommentResponse[]{
return comments
       .filter(comment=>comment.commentsId!==commentId)
       .map(comment=>({
        ...comment,
        replies: DeleteComment(comment.replies, commentId)
       }))
}