import { apiNotification } from "@/lib/apiClient"
import { Response } from "@/inference/ApiResponse"
import { GetUserReplyHistoryResponse } from "@/inference/UserResponseType"

export const NotificationApi={

    userReplyHistory:()=>
        apiNotification.get<Response<GetUserReplyHistoryResponse[]>>('/Notification/reply'),

    activateNotificationApi:()=>
        apiNotification.get('/Notification/activate'),

    

}
