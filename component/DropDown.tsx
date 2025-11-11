
//import { SlArrowDown } from "react-icons/sl";
//import { SlArrowUp } from "react-icons/sl";
import {ChevronDown} from "lucide-react";
import {ChevronUp} from "lucide-react";
interface DropdownProps{
    defaultOption:React.ReactNode;
    children: React.ReactNode;
    toggleDown:()=>void;
    isOpen:boolean;
}
const DropDown=({defaultOption, children, toggleDown, isOpen}:DropdownProps)=>{
    return (
        <div className="relative">
            <button 
            className="flex flex-1 items-center justify-center gap-1 p-1 text-gray-300 cursor-pointer"
            onClick={toggleDown}
            >{defaultOption} {isOpen? <ChevronUp/> : <ChevronDown />}</button>
            {isOpen && <div className="absolute left-12 mt-1 bg-black rounded-md shadow-lg ring-1 ring-gray-400 ring-opacity-5 z-50">
            {children}
        </div>}
        </div>
    )
}
export default DropDown