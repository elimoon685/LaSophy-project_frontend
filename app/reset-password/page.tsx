'use client'
import { useState } from "react"
import { ResetPasswordFormData } from "@/inference/UserRequestType"
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState} from "@/store/store";
import Authapi from "@/api/login";
const ResetPassword = () => {
  const email = useSelector((state: RootState) => state.email.email);
  const searchParams = useSearchParams();
  const token=searchParams.get('token');
  const [newPassword, setNewPassword] = useState<ResetPasswordFormData>({
    email:email,
    newPassword: "",
    confirmNewPassword: "",
    token:token,
  })

  const handleSubmit = async () => {
    try{
    const resposne=await Authapi.resetPassword(newPassword)
    }catch(err:any){

    }
  
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      <div className="flex flex-col px-10 py-4 space-y-8 border rounded-sm shadow-lg drop-shadow-md shadow-black/30">
        <div className="flex justify-center">
          <h1 className="text-2xl">Reset your password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block"> New password</label>
            <input
              id="newPassword"
              type="password"
              name="newPassword"
              value={newPassword.newPassword}
              onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            ></input>
          </div>
          <div className="mb-4">
            <label htmlFor="confirmNewPassword">Confirm new password</label>
            <input
              id="confirmNewPassword"
              type="password"
              name="comfirmNewPassword"
              value={newPassword.confirmNewPassword}
              onChange={(e) => setNewPassword({ ...newPassword, confirmNewPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            ></input>
          </div>
          <button className='w-full bg-black text-white text-center py-2 mt-4'
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )

}
export default ResetPassword