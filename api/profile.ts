import { apiClient } from "@/lib/apiClient";
import { Response } from "@/inference/ApiResponse";
import { UserIdDataForm } from "@/inference/UserRequestType";
import { GetUserInfoResponse } from "@/inference/UserResponseType";
import { UpdateUserInfoFormData } from "@/inference/UserRequestType";
const ProfileApi={
     
    getUserInfo:({userId}:UserIdDataForm)=>
        apiClient.get<Response<GetUserInfoResponse>>(`/User/get-user/${userId}`),

    userInfoUpdate:(userInfo:UpdateUserInfoFormData)=>
        apiClient.patch<Response<GetUserInfoResponse>>("/User/userInfo-update", userInfo)
    
}
export default ProfileApi