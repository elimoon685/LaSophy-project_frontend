"use client"
import { useState,useEffect} from "react"
import Link from "next/link"
import { useDispatch } from 'react-redux';
import { setEmail } from "@/store/slices/resetPassword"; //
import Authapi from "@/api/login"
import { useRouter } from 'next/navigation';
import toast from "react-hot-toast";
import { NotificationApi } from "@/api/notification";
const ForgetPassword = () => {
  const router = useRouter();
  const [enterEmail, setEnterEmail] = useState('')
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        await NotificationApi.activateNotificationApi();
      } catch (e: any) {
      }
    })()
  }, [])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resposne = await Authapi.verifyEmail(enterEmail)
      dispatch(setEmail(enterEmail));
      router.replace("/check-email")
    } catch (err: any) {
      const error = err.response?.data;
      toast.error(error.ErrorMessage)
    }
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center space-y-8">
      <div className="flex flex-col px-10 py-4 space-y-8 border rounded-sm shadow-lg drop-shadow-md shadow-black/30">
        <div>
          <h1 className="text-2xl">Reset your password</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={enterEmail}
              onChange={(e) => setEnterEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <button className='w-full bg-black text-white text-center py-2 mt-4'
            type="submit"
          >
            Send reset link
          </button>
        </form>
        <Link href='/login' className="text-shadow-black hover:underline hover:font-bold text-center"> Back to login</Link>
      </div>
    </div>
  )

}
export default ForgetPassword