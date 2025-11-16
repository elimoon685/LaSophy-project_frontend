'use client'
import { useRouter } from "next/navigation";
import { IoIosHeart } from "react-icons/io";
import {memo} from "react";
const SubNavbar=()=>{
  const router = useRouter()
return (
  <header className="w-full mx-auto flex justify-center bg-gray-400 py-2">
  <div className="flex gap-4">
  <button className="font-libre cursor-pointer" onClick={()=>router.push("/about/introduction")}>About</button>
  <button className="flex items-center gap-1 font-libre cursor-pointer" onClick={()=>router.push("/donate")}>Donate <IoIosHeart className="bg-red-400"/></button>
  <button className="font-libre cursor-pointer" onClick={()=>router.push("/join-us")}>Join us</button>
  </div>
  </header>
)

}
export default memo(SubNavbar)