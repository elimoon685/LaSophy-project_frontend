'use client'
import { useRouter } from "next/navigation";
import { RiLoginCircleLine } from "react-icons/ri";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { MdFileUpload } from "react-icons/md";
import DropDown from "./DropDown";
import { useState,useEffect} from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/inference/UserResponseType";
import Image from "next/image";
const Navbar=()=>{
  const [isOpen, SetIsOpen]=useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId]=useState<string|null>(null)
  const [userName, setUserName] = useState<string|null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const toggleDropdown=()=>{
    SetIsOpen(prev=>!prev);
  }
    const router=useRouter()
  const handleLogOut=()=>{
    Cookies.remove("token");
    setIsAuthenticated(false); 
    setUserName("");                // Clear username
    router.push("/");
  }
    useEffect(()=>{
      const token=Cookies.get("token")

      if (token) {
        try{
        const decoded= jwtDecode<JwtPayload>(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if(!isTokenExpired){
          setIsAuthenticated(true)
          setUserName(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"])
          setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
          console.log("token", decoded)
        }else{
          Cookies.remove("token")
        }
        }catch(error)
        {
         Cookies.remove("token")
        }
      }
      setLoading(false)
    },[])


return (
    <header className="w-full mx-auto flex justify-between items-center bg-black px-5 py-3">
      {/* instead of using w, h directly, using p, */}
      <div className="flex items-center justify-between gap-3">
      <Image src='/logo.png' alt="logo" width={40} height={40}/>
      <div className=" text-gray-300 [font-family:'Times_New_Roman',serif] text-xl tracking-wide">
        Welcome to LaSophy
      </div>
      </div>
      <div className=" flex space-x-5 items-center">
        {!loading && (
          <>
        {!isAuthenticated ? (
          <>
        <DropDown 
        defaultOption={
          <div className="flex items-center">
        <RxAvatar className="mr-1.5 h-5 w-5"/>
          Signup
          </div>}
          isOpen={isOpen}
          toggleDown={toggleDropdown}
          >
         <div className="text-gray-300">
         <Link href="/admin_signup" className="block  hover:bg-gray-500  py-2 px-3 rounded-md"> Admin</Link>
         <Link href="/signup" className="hover:bg-gray-500 block py-2 px-3 rounded-md">User</Link>
         </div>
        </DropDown>
        <button 
        className=" flex items-center justify-center  p-1 text-gray-300 cursor-pointer "
        onClick={()=>router.push("/login")}
        >
        <RiLoginCircleLine className="mr-1.5 h-5 w-5"/>
          Login
        </button>
        </>
        ):(
          <>
        <button 
        className=" flex items-center justify-center  p-1 text-gray-300 cursor-pointer "
        onClick={()=>router.push(`/profile/${userId}?username=${userName}`)}
        >
        <RxAvatar className="mr-1.5 h-5 w-5"/>
        {userName}
        </button>

        <button 
        className=" flex items-center justify-center  p-1 text-gray-300 cursor-pointer "
        onClick={handleLogOut}
        >
        <RiLogoutCircleRLine className="mr-1.5 h-5 w-5"/>
          Logout
        </button>
        </>
        )}
        </>
        )}
        <button
        className="flex items-center justify-center  p-1 text-gray-300 cursor-pointer"
        onClick={()=>router.push("/upload")}
        >
        <MdFileUpload className="mr-1.5 h-5 w-5"/>
        Upload
        </button>
      </div>
    </header>
)
}
export default Navbar