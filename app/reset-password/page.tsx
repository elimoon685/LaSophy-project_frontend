'use client'
import { useState, useEffect, useMemo} from "react"
import { ResetPasswordFormData } from "@/inference/UserRequestType"
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Authapi from "@/api/login";
import toast from "react-hot-toast";
import PasswordRequirements from "@/component/PasswordRequirements";
import { NotificationApi } from "@/api/notification";
import { getPasswordChecks } from "@/lib/checkPassword";
const ResetPassword = () => {
  //const email = useSelector((state: RootState) => state.email.email);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const router = useRouter();
  const [countDown, setShowCountDown] = useState<boolean>(false);
  const [countDownNumber, setCountDownNumber] = useState<number>(5);
  const [showPassword, setShowPassword] = useState({ newpassword: false, confirmpassword: false })
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)
  const [newPassword, setNewPassword] = useState<ResetPasswordFormData>({
    email: email,
    newPassword: "",
    confirmNewPassword: "",
    token: token,
  })
  const checks = useMemo(() => getPasswordChecks(newPassword.newPassword), [newPassword.newPassword]);
  const passwordValid = Object.values(checks).every(Boolean);
  useEffect(() => {
    if (!countDown) return;
    const timeTick = window.setInterval(() => {
      setCountDownNumber(s => {
        if (s <= 1) {
          window.clearInterval(timeTick);
          router.replace('/login');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timeTick);
  }, [countDown])

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!passwordValid) return toast.error("Check requirements of password")
    try {
      const resposne = await Authapi.resetPassword(newPassword)
      setShowCountDown(true)
    } catch (err: any) {
      const error = err.response?.data;
      toast.error(error.ErrorMessage)
    }

  }
  return (

    <div className="min-h-screen w-full flex flex-col justify-center items-center relative">
      {countDown &&
        <div className="flex flex-col justify-center bg-gray-200 py-2 px-4 rounded-sm shadow-lg drop-shadow-md shadow-black/30 absolute top-[10%]">
          <h1 className="text-3xl font-bold text-center">Update password successful</h1>
          <p className="text-xl text-center">Redirecting to login page in <span className="font-bold">{countDownNumber}</span> second{countDownNumber !== 1 ? 's' : ''}…</p>
        </div>}
      <div className="flex flex-col px-10 py-4 space-y-8 border rounded-sm shadow-lg drop-shadow-md shadow-black/30">
        <div className="flex justify-center">
          <h1 className="text-2xl">Reset your password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="newPassword" className="mb-2"> New password</label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword.newpassword ? "text" : "password"}
                name="newPassword"
                value={newPassword.newPassword}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => !newPassword.newPassword.trim() && setPasswordFocus(false)}
                onChange={(e) => setNewPassword({ ...newPassword, newPassword: e.target.value })}
                placeholder="Enter new password"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              ></input>
              <button className="absolute top-[30%] left-[93%]"
                type="button"
                onClick={() => setShowPassword(prev => ({ ...prev, newpassword: !prev.newpassword }))}
              >{showPassword.newpassword ? <IoEyeOutline /> : <IoEyeOffOutline />}</button>
            </div>
            {passwordFocus && <PasswordRequirements password={newPassword.newPassword} />}
          </div>
          <div className="mb-4 relative">
            <label htmlFor="confirmNewPassword" >Confirm new password</label>
            <input
              id="confirmNewPassword"
              type={showPassword.confirmpassword ? "text" : "password"}
              name="comfirmNewPassword"
              value={newPassword.confirmNewPassword}
              onChange={(e) => setNewPassword({ ...newPassword, confirmNewPassword: e.target.value })}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            ></input>
            <button className="absolute top-[58%] left-[93%]"
              type="button"
              onClick={() => setShowPassword(prev => ({ ...prev, confirmpassword: !prev.confirmpassword }))}
            >{showPassword.confirmpassword ? <IoEyeOutline /> : <IoEyeOffOutline />}</button>
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