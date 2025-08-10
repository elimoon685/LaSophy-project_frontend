import { Params, ParamValue } from "next/dist/server/request/params";

export interface SignUpFormData{
    email:string;
    username: string;
    password: string;
    confirmpassword: string
}

export interface LoginFormData{
    email:string;
    password:string;
    role:"User"|"Admin"
}

export interface UpdateUserInfoFormData{

     bio:string|null,
     userName:string,
}

export interface UserIdDataForm{
    userId: ParamValue
}

export interface UpdateUserInfoFormData{

    bio:string|null,
    userName:string,
}
export interface ResetPasswordFormData{
    email:string|null
    newPassword:string,
    confirmNewPassword:string,
    token:string|null

}