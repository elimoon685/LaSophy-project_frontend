import { MdOutlineMail } from "react-icons/md";
const Footer=()=>{
return (
    <footer className="w-full mx-auto bg-black p-3">
    <div className="flex items-center justify-center space-x-4">
    <a className=" text-gray-300 font-libre">© {new Date().getFullYear()} LaSophy</a>
    <a className="items-center space-x-2 text-gray-300 font-libre hidden sm:flex"><MdOutlineMail /> <p>linsophymoon@gmail.com</p></a>
    </div>
    </footer>
)
}
export default Footer