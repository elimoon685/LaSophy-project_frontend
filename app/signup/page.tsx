'use client'
import Link from 'next/link';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignUpFormData } from '@/inference/UserRequestType';
import Authapi from '@/api/login';
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import PasswordRequirements from '@/component/PasswordRequirements';
import { getPasswordChecks } from '@/lib/checkPassword';


const Singup = () => {
  const [showPassword, setShowPassword] = useState({ password: false, confirmpassword: false })
  const router = useRouter();
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false)
  const [show, setShow] = useState(false);
  const [formData, setformData] = useState<SignUpFormData>({
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  })
  const checks = useMemo(() => getPasswordChecks(formData.password), [formData.password]);
  const passwordValid = Object.values(checks).every(Boolean);

  useEffect(() => {
    if (passwordFocus) {
      const t = window.setTimeout(() => setShow(true), 1000);
      return () => {
        if (t !== undefined) {
          window.clearTimeout(t);

        }
      }
    } else {
      setShow(false);
    }
  }, [passwordFocus])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   if(!passwordValid) return toast.error("Check requirements of password")
    try {
      const response = await Authapi.userSignUp({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmpassword: formData.confirmpassword,
      })
      if (response.status === 200) {
        toast.success("Register Successful")
        setTimeout(() => {
          router.push("/login");
        }, 1000)
      }
    } catch (err: any) {
      if (err.response?.status === 400) {

        toast.error(err.response?.ErrorMessage)
      } else if (err.response?.status === 500) {
        toast.error("Something went wrong. Please try again.")
      }
    }
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-row  items-center space-x-40">
        <div className=" w-full hidden flex-col items-start space-y-2 md:flex">
          <h1 className="text-2xl"> Welcome to the Lasophy, starting following the moonlight!</h1>
          <p className="text-xl">Sign up an account to explore the world you never know</p>
        </div>
        <div className="w-full flex flex-col border px-10 py-4 space-y-2 rounded-sm shadow-lg drop-shadow-md shadow-black/30">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <h1 className='text-gray-600'>Enter details to sign up your account</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setformData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="userName" className="block mb-2 text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setformData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
                required />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <div className='relative'>
              <input
                id="password"
                type={showPassword.password ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setformData({ ...formData, password: e.target.value })}
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => !formData.password.trim() && setPasswordFocus(false)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
                required
              />
              <button type="button"
                className='absolute top-[30%] left-[93%]'
                onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}>
                {showPassword.password ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </button>
              </div>
              
              {passwordFocus && <PasswordRequirements password={formData.password} />}
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmpassword"
                type={showPassword.confirmpassword ? "text" : "password"}
                name="confirmpassword"
                placeholder="Enter your password again"
                value={formData.confirmpassword}
                onChange={(e) => setformData({ ...formData, confirmpassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
                required
              />
              <button type="button"
                className='absolute top-[60%] left-[93%]'
                onClick={() => setShowPassword(prev => ({ ...prev, confirmpassword: !prev.confirmpassword }))}>
                {showPassword.confirmpassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </button>
            </div>
            <button className='w-full bg-black text-white text-center py-2'
              type="submit"
            >
              Sign up
            </button>
          </form>

          <p className='text-center'>Already have account? <Link href="/login" className="text-shadow-black hover:underline hover:font-bold">Log in</Link></p>
        </div>
      </div>
    </div>
  )


}
export default Singup