'use client'
import { useRouter } from "next/navigation";
import { RiLoginCircleLine } from "react-icons/ri";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { MdFileUpload } from "react-icons/md";
// import { CircleUserRound, Upload } from "lucide-react";
// import { LogIn } from "lucide-react";
// import { LogOut } from "lucide-react";
// import { ArrowUpToLine } from "lucide-react";
import { WSContext } from "@/provider/WebsocketProvider";
import { FcOk } from "react-icons/fc";
import DropDown from "./DropDown";
import { useState, useEffect, useContext } from "react";
import React, { memo } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/inference/UserResponseType";
import Image from "next/image";
import { Cookie } from "next/font/google";
const Navbar = ({ auth }: { auth: boolean }) => {
  type UserInfo = { userId: string; userName: string };
  const [isOpen, SetIsOpen] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<UserInfo>()
  const router = useRouter()
  const ctx = useContext(WSContext)
  console.log("test render or not")
  if (!ctx) throw new Error("Wrap this tree with <ServerEventsProvider url=...>");
  const { connected,close} = ctx;
  const toggleDropdown = () => {
    SetIsOpen(prev => !prev);
  }

  const handleLogOut = () => {
    Cookies.remove("token");
    setIsAuthenticated(prev=>prev=false);
    setUser(undefined)
    localStorage.removeItem("userInfo")
    close(1000, "logout")
    router.push("/");
  }

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      const { exp } = jwtDecode<JwtPayload>(token);
      const isAuth = exp * 1000 > Date.now();
      if (!isAuth) { Cookies.remove("token"); return; }
      setIsAuthenticated(prev => prev = true)
      const raw = localStorage.getItem("userInfo")
      if (raw) {
        try {
          setUser(JSON.parse(raw) as UserInfo)
        } catch {
          localStorage.removeItem("userInfo")
        }
      } else {
        Cookies.remove("token")
        localStorage.removeItem("userInfo");
      }
    } else {
      Cookies.remove("token")
      localStorage.removeItem("userInfo");
    }
    setLoading(false)
  }, [auth])

  return (
    <header className="w-full mx-auto flex justify-between items-center bg-black px-5 py-3">
      {/* instead of using w, h directly, using p, */}
      <div className="flex items-center justify-between gap-3">
        <Image src='/logo.png' alt="logo" width={40} height={40} />
        <div className="hidden text-gray-300 font-libre text-xl tracking-wide md:inline-block">
          LaSophy
        </div>
      </div>
      <div className="flex items-center max-w-[350px] flex-grow">
        {!loading && 
        <>
          {!isAuthenticated ? (
            <>
              <DropDown
                defaultOption={
                  <div className="flex items-center font-libre flex-grow">
                    <RxAvatar className="mr-1.5 h-7 w-7" />
                    Signup
                  </div>}
                isOpen={isOpen}
                toggleDown={toggleDropdown}
              >
                <div className="text-gray-300">
                  <Link href="/admin_signup" className="hover:bg-gray-500 block py-2 px-3 rounded-md"> Admin</Link>
                  <Link href="/signup" className="hover:bg-gray-500 block py-2 px-3 rounded-md">User</Link>
                </div>
              </DropDown>
              <button
                className="flex items-center justify-center p-1 text-gray-300 cursor-pointer font-libre flex-grow"
                onClick={() => router.push("/login")}
              >
                <RiLoginCircleLine className="mr-1.5 h-6 w-6" />
                Login
                {connected &&
                  <FcOk className="w-4 h-4 ml-1" />
                }
              </button>
              <button
                className="flex items-center justify-center  p-1 text-gray-300 cursor-pointer font-libre"
                onClick={() => router.push("/upload")}
              >
                <MdFileUpload className="mr-1.5 h-6 w-6" />
                Upload
              </button>
            </>
          ) : (
            <>
              <button
                className=" flex items-center justify-center p-1 text-gray-300 cursor-pointer flex-grow"
                onClick={() => router.push(`/profile/${user?.userId}?username=${user?.userName}`)}
              >
                <div className="relative inline-block">
                  <RxAvatar className="mr-1.5 h-8 w-8" />
                  <span className="absolute h-3 w-3 bg-red-600 rounded-full top-[0] left-[56%]"></span>
                </div>
                <span className="font-libre">{user?.userName}</span>
                {connected &&
                  <FcOk className="w-4 h-4 ml-1" />
                }
              </button>

              <button
                className="flex items-center justify-center  p-1 text-gray-300 cursor-pointer font-libre flex-grow"
                onClick={handleLogOut}
              >
                <RiLogoutCircleRLine className="mr-1.5 h-6 w-6" />
                Logout
              </button>
              <button
                className="flex items-center justify-center  p-1 text-gray-300 cursor-pointer font-libre"
                onClick={() => router.push("/upload")}
              >
                <MdFileUpload className="mr-1.5 h-6 w-6" />
                Upload
              </button>
            </>
          )}
        </>
        }

      </div>
    </header>
  )
}
export default memo(Navbar)