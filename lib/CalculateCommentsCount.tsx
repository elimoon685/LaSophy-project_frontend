import { GetCommentResponse } from "@/inference/BookCommentResponseType"

  export function RepliesCount(comment:GetCommentResponse):number{
    
     if(comment.replies.length===0){
        return 0
     }
     let count=comment.replies.length
     for (let i=0; i<comment.replies.length; i++){
     count+=RepliesCount(comment.replies[i])
     }
     return count
  }   