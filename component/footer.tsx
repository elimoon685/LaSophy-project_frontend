import { MdOutlineMail } from "react-icons/md";
const Footer=()=>{
return (
    <footer className="w-full mx-auto bg-black p-3">
    <div className="flex items-center justify-center space-x-4">
    <a className=" text-gray-300">© {new Date().getFullYear()} LaSophy</a>
    <a className="flex items-center space-x-2 text-gray-300"><MdOutlineMail /> <p>linsophymoon@gmail.com</p></a>
    </div>
    </footer>
)
}
export default Footer