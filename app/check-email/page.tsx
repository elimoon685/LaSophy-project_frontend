'use client'
import { useSelector } from 'react-redux';
import { RootState} from "@/store/store";
import { MdOutlineMarkEmailUnread } from "react-icons/md";

const CheckEmail=()=>{
    const email = useSelector((state: RootState) => state.email.email);
    return (
        <div className='min-h-screen w-full flex justify-center items-center '>
         <div className='flex flex-col px-10 py-4 space-y-4 border rounded-sm shadow-lg drop-shadow-md shadow-black/30'>
        <div className="flex justify-center">
        <MdOutlineMarkEmailUnread className='w-25 h-25'/>
        </div>
        <div>
            <h1 className='text-3xl font-bold text-center'>Check your email</h1>
        </div>
        <p className='text-xl'>To create a new password, follow the link we sent to <span className='font-bold'>{email}</span>.</p>
         </div>

        </div>
    )
}
export default CheckEmail