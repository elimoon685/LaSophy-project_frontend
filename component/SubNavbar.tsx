'use client'
import { IoIosHeart } from "react-icons/io";
import {memo} from "react";
const SubNavbar=()=>{
console.log("subNavbar")
return (
  <header className="w-full mx-auto flex justify-center bg-gray-400 py-2">
  <div className="flex gap-4">
  <button className="font-libre">About</button>
  <button className="flex items-center gap-1 font-libre">Donate <IoIosHeart className="bg-red-400"/></button>
  <button className="font-libre">Join us</button>
  </div>
  </header>
)


}
export default memo(SubNavbar)