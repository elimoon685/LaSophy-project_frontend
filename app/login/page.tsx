'use client'
import Link from 'next/link';
import { LoginFormData } from '@/inference/UserRequestType';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Cookies from 'js-cookie';
import SwitchBox from '@/component/switchBox';
import Authapi from '@/api/login';
import toast from "react-hot-toast";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/inference/UserResponseType";
const Login = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [show, setShowPassword] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
    role: "User"
  })
  const changeRole = () => {
    const newStatus = !isAdmin;
    setIsAdmin(newStatus);
    const newRole = newStatus ? "Admin" : "User"
    setLoginData({ ...loginData, role: newRole })
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await Authapi.userLogIn({
        email: loginData.email,
        password: loginData.password,
        role: loginData.role
      })
      if (response.status === 200) {
        const token=response.data.data.token;
        const userName=response.data.data.username
        const res=await fetch(`https://lasophynotificationapi-adc7atgxdsbmc9ff.australiasoutheast-01.azurewebsites.net/api/Websocket/auth/ws-cookie`,
          {method:"POST",
           headers:{Authorization:`Bearer ${token}`},
           credentials:"include",
          })
          //
        Cookies.set('token', token, { expires: 1 });
        const decoded:JwtPayload = jwtDecode(token);
        const userInfo={"userId":decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], userName:userName}
          if (typeof window !== "undefined") {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
          }
        router.push("/")
      }
    }
    catch (err: any) {
      const error = err.response?.data;
      toast.error(error.ErrorMessage)
    }
  }
  return (
    <div className="min-h-screen w-screen flex flex-col items-center justify-center">
      <div className="flex flex-row  items-center space-x-40">
        <div className=" w-full flex flex-col items-start space-y-2">
          <h1 className="text-2xl"> As moonlight follower, spreading the moonlight to the world</h1>
          <p className="text-xl">Login your account to explore the world you never know</p>
        </div>
        <div className="w-full flex flex-col border px-10 py-4 space-y-8 rounded-sm shadow-lg shadow-black/60">
          <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl">Login in</h1>
            <h1 className='text-gray-600'>Enter details to log in your account</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="flex mb-2 justify-between items-center">
                <label htmlFor="email" className=" text-sm font-medium">
                  Email
                </label>
                <div className="flex gap-2 items-center">
                  {isAdmin ?
                    <span className='text-sm'>Admin</span> :
                    <span className='text-sm'>User</span>
                  }
                  <SwitchBox isCheck={isAdmin} check={changeRole} />
                </div>
              </div>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={(e) => { setLoginData({ ...loginData, email: e.target.value }) }}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div className="mb-4">
              <div className='flex justify-between'>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <Link href="/forget-password" className='text-sm text-shadow-black hover:underline hover:font-bold'>Forget your password</Link>
              </div>
              <div className='relative'>
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                  className="w-full relative px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
                  required
                />
                <button type="button"
                  className='absolute top-[30%] left-[93%]'
                  onClick={() => { setShowPassword(prev => !prev) }}
                //onMouseDown={(e) => e.preventDefault()} 
                >
                  {show ? <IoEyeOutline /> : <IoEyeOffOutline />}
                </button>
              </div>
            </div>

            <button className='w-full bg-black text-white text-center py-2'
              type="submit"
            >
              Log in
            </button>
          </form>
          <p className='text-center'>Don't have an account? <Link href="/signup" className="text-shadow-black hover:underline hover:font-bold">Sign up</Link></p>
        </div>
      </div>
    </div>
  )

}
export default Login
//for the websocket, seems like i have to use global context, 
//after login i need to open websocket, and when i refresh i need to reopen the websocket
//for the websocket cookie, i get this cookie from backend, 