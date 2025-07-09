import { apiClient } from "@/lib/apiClient";
import { SignUpFormData,LoginFormData} from "@/inference/UserRequestType";
const Authapi={

userLogIn:(credentials:LoginFormData)=>
    apiClient.post("/Auth/login",credentials),

userSignUp:(credentials:LoginFormData)=>
    apiClient.post("/User/register", credentials),

adminLogIn:(credentials:SignUpFormData)=>
    apiClient.post("/Auth/login", credentials),

adminSignUp:(credentials:SignUpFormData)=>
    apiClient.post("/Admin/signup", credentials),

}
export default Authapi