import { GetCommentResponse } from "@/inference/BookCommentResponseType";

export function UpdateCommentLikesCount(comments:GetCommentResponse[], commentId:number, updatedCommentLikesCount:number):GetCommentResponse[]{

    return comments.map(comment => {
        if (comment.commentsId === commentId) {
          return {
            ...comment,
            commentLikesCount: updatedCommentLikesCount 
          };
        } else if(comment.replies.length>0){
        return {
          ...comment,
          replies: UpdateCommentLikesCount(comment.replies, commentId, updatedCommentLikesCount)
        }}
        return comment;
      });

}

