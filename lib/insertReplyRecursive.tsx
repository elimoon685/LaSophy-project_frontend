import { GetCommentResponse } from "@/inference/BookCommentResponseType"

export function insertReplyRecursive(comments:GetCommentResponse[], parentId:number |null, reply:GetCommentResponse):GetCommentResponse[]{

    return comments.map(comment=>{
          if(comment.commentsId==parentId){

            return{...comment, replies:[reply, ...comment.replies]};
        }else if(comment.replies.length > 0){
            return {
                ...comment, 
                replies: insertReplyRecursive(comment.replies, parentId, reply)
            };
        }
        return comment;

    })
}

 function DeletetReply(comments:GetCommentResponse[], deleteId:number):GetCommentResponse[]{

       return comments
        .filter(comment=>comment.commentsId!==deleteId)
        .map(comment=>({
            ...comment,
            replies:DeletetReply(comment.replies, deleteId)
        })) 
    }
        


