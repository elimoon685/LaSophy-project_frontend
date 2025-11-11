'use client';
import {useSearchParams, useRouter, useParams} from 'next/navigation';
import { RiCloseCircleLine } from "react-icons/ri";
import { useSelector} from 'react-redux';
import { RootState} from "@/store/store";
import { useState } from 'react';
import { UpdateUserInfoFormData } from '@/inference/UserRequestType';
import ProfileApi from '@/api/profile';
type UserInfo = {
  userId: string;
  userName: string;
  // version?: number; // 建议加版本字段便于将来迁移
};

export default function SettingsModal() {
  const sp = useSearchParams();
  const open = sp.get('modal') === 'settings';
  if (!open) return null;
  const router = useRouter();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const closeModal = () => router.back(); // go back to profile
  const [updateInfo, setUpdateInfo]=useState<UpdateUserInfoFormData>({
    userName:"",
    bio:"",
  })
  const raw = localStorage.getItem("userInfo")
 
  console.log("userinfo", raw)
  const handleUpdateInfo=async()=>{
       const response=await ProfileApi.userInfoUpdate(updateInfo)
       closeModal();
  }
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow flex-grow max-w-[400]">
        <div className="flex items-center mb-4 justify-between">
            <div className='flex items-center gap-4'>
        <RiCloseCircleLine className="w-8 h-8 cursor-pointer" onClick={closeModal}/>
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        </div>
        <button className='bg-black text-white px-3 py-1 rounded-2xl cursor-pointer' 
                onClick={handleUpdateInfo}
                 >Save</button>
        
        </div>
        <div className="mb-4">
        <label htmlFor="username" className="block mb-1 font-bold">Username:<span>{}</span></label>
        {/* <input className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
               placeholder={userInfo.userName?? undefined}
               value={updateInfo.userName}
               onChange={(e)=>setUpdateInfo({...updateInfo, userName:e.target.value})}
         ></input> */}

        </div>
        
        <div className='mb-4'>
            <label htmlFor="useremail" className="block mb-1 font-bold">Email:<span>{userInfo?.email}</span></label>
  
        </div>
        <div className='mb-4'>
            <label htmlFor="bio" className="block mb-1 font-bold">Bio:</label>
        <input className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
               placeholder={userInfo?.bio ?? ""}
               value={updateInfo.bio?? ""}
               onChange={(e)=>setUpdateInfo({...updateInfo, bio:e.target.value})}
               ></input>
        </div>
      </div>
    </div>
  );
}