import { apiClient } from "@/lib/apiClient";
import { SignUpFormData,LoginFormData, ResetPasswordFormData} from "@/inference/UserRequestType";
import { Response } from "@/inference/ApiResponse";
type AuthResponse={username:string, token:string}
const Authapi={

userLogIn:(credentials:LoginFormData)=>
    apiClient.post<Response<AuthResponse>>("/Auth/login",credentials),

userSignUp:(credentials:SignUpFormData)=>
    apiClient.post("/User/register", credentials),

adminLogIn:(credentials:LoginFormData)=>
    apiClient.post("/Auth/login", credentials),

adminSignUp:(credentials:SignUpFormData)=>
    apiClient.post("/Admin/signup", credentials),

verifyEmail:(email:string)=>
    apiClient.post("/Auth/forget-password", {email}),

resetPassword:(credentials:ResetPasswordFormData)=>
    apiClient.post("Auth/reset-password", credentials)
}
export default Authapi