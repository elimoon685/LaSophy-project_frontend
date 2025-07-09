'use client'
import { IoIosHeart } from "react-icons/io";
const SubNavbar=()=>{

return (
  <header className="w-full mx-auto flex justify-center bg-gray-400 py-2">
  <div className="flex gap-4">
  <button>About</button>
  <button className="flex items-center gap-1">Donate <IoIosHeart className="bg-red-400"/></button>
  <button>Join us</button>
  </div>
  </header>
)


}
export default SubNavbar