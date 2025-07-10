import { GetCommentResponse } from "@/inference/BookCommentResponseType"
const Comments=[
    {
      "commentsId": 2,
      "content": "this book show the real history of tai-ping rebellion",
      "createdBy": "Eli",
      "createdAt": "2025-05-12T01:27:09.324",
      "bookId": 1,
      "parentCommentId": null,
      "replies": [
        {
          "commentsId": 3,
          "content": "i totally agree with you",
          "createdBy": "Elinor",
          "createdAt": "2025-05-12T01:29:54.97",
          "bookId": 1,
          "parentCommentId": 2,
          "replies": [
            {
              "commentsId": 4,
              "content": "yeah me too",
              "createdBy": "Elimacos",
              "createdAt": "2025-05-12T01:29:54.97",
              "bookId": 1,
              "parentCommentId": 3,
              "replies": [
                {
              "commentsId": 5,
              "content": "hahahaah",
              "createdBy": "Elimoon",
              "createdAt": "2025-05-13T01:29:54.97",
              "bookId": 1,
              "parentCommentId": 4,
              "replies": []
            }
              ]
            }
          ]
        },{
            "commentsId": 6,
              "content": "yeah better than offical words",
              "createdBy": "Eli36",
              "createdAt": "2025-05-15T01:29:54.97",
              "bookId": 1,
              "parentCommentId": 2,
              "replies": []

        }
      ]
    },
    {
      "commentsId": 8,
      "content": "Tartary is disgusting dynasty",
      "createdBy": "MoMo",
      "createdAt": "2025-05-12T09:44:08.844",
      "bookId": 1,
      "parentCommentId": null,
      "replies": []
    }
  ]

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