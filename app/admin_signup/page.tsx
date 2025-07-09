'use client'
import { useState } from "react"
import { SignUpFormData } from "@/inference/UserRequestType"
import Link from "next/link"
import Authapi from "@/api/login"
import { useRouter } from 'next/navigation';
const AdminSignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null)
  const [formData, setformData] = useState<SignUpFormData>({
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  })
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await Authapi.adminSignUp({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        confirmpassword: formData.confirmpassword
      })
      console.log("response", response.data)
      if (response.status === 200) {
        router.push("/login")
      }
    }
    catch (err: any) {
      console.log(err)
      const error = err.response?.data;
      alert(error.Message);
    }
  }
  return (
    <div className="min-h-screen w-screen flex justify-center items-center">
      <div className="w-full flex flex-col max-w-[500px] justify-center border px-10 py-4 space-y-2 rounded-sm shadow-lg drop-shadow-md shadow-black/30">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold">Sign up for admin</h1>
          <h1 className='text-gray-600'>Enter details to sign up your account</h1>
        </div>
        {error && <div className='text-red-700 p-3 mb-4 text-sm  bg-red-100 rounded-md'> {error}</div>}
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
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setformData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium">
              Confirm Password
            </label>
            <input
              id="confirmpassword"
              type="password"
              name="confirmpassword"
              placeholder="Enter your password again"
              value={formData.confirmpassword}
              onChange={(e) => setformData({ ...formData, confirmpassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm"
              required
            />
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
  )
}
export default AdminSignUp