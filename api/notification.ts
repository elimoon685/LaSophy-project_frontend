import { apiNotification } from "@/lib/apiClient"
import { Response } from "@/inference/ApiResponse"
import { GetUserReplyHistoryResponse, GetUserCommentLikeHistoryResponse} from "@/inference/UserResponseType"

export const NotificationApi={

    userReplyHistory:()=>
        apiNotification.get<Response<GetUserReplyHistoryResponse[]>>('/Notification/reply'),

    activateNotificationApi:()=>
        apiNotification.get('/Notification/activate'),

    userCommlikeHistory:()=>
        apiNotification.get<Response<GetUserCommentLikeHistoryResponse[]>>('/Notification/comment-like'),

    userNotificationCount:()=>
        apiNotification.get<Response<number>>('/Notification/unread-account'),

    

}
