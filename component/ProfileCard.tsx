'use client'
import { RxAvatar } from "react-icons/rx";
import { BsCalendarDate } from "react-icons/bs";
import { TfiThought } from "react-icons/tfi";
import { GoGear } from "react-icons/go";
import { useRouter } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { useSelector} from 'react-redux';
import { RootState} from "@/store/store";
import { GetUserInfoResponse } from "@/inference/UserResponseType";
import Login from "@/app/login/page";
interface ProfileCardPros{
  userId:ParamValue,
  showEditButton:boolean,
  userStateInfo:GetUserInfoResponse
}
type UserInfo = { userId: string; userName: string };
const ProfileCard = ({userId, showEditButton, userStateInfo}:ProfileCardPros) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router=useRouter()
  // const raw = localStorage.getItem("userInfo");
  // let loginUserId: string | null = null;
  // if (raw) {
  //   const userInfo = JSON.parse(raw) as UserInfo;
  //   loginUserId=userInfo.userId
  // }
  const openProfile=()=>{
    router.push(`/profile/${userId}/?modal=settings`);; // Only change URL
  }
  // const showOrNot = loginUserId!==null && loginUserId===userId

  
  return (
    <>
    <div className="flex items-center border-b border-black min-h-[200px] w-full">
      <div className="flex flex-col px-6 py-6 w-full gap-4">
      <div className="flex flex-grow gap-10">
      <div className="hidden md:inline-block">
     <RxAvatar className="w-20 h-20"/>
      </div>
      <div className="flex flex-col gap-2 flex-grow max-w-[400px]">
        <div className="flex flex-grow items-center">
       <h1 className="text-4xl font-bold flex-grow">{userStateInfo.userName}</h1>
       {showEditButton && 
       <button className="ml-2 flex items-center border border-gray-400 rounded-3xl px-2 py-1 gap-2 cursor-pointer"
              onClick={openProfile}
      ><GoGear className="w-5 h-5"/> <span className="whitespace-nowrap">Edit profile</span></button>
       }
       
       </div>
       <h1 className="flex items-center gap-2"><span className="flex items-center gap-0.5"><BsCalendarDate/></span><p className="flex gap-2"><span className="text-gray-500">Joined</span><span className="font-bold">{new Date(userStateInfo.createdAt??"").toDateString()}</span></p></h1>
       
      </div>
      </div>
      <h1 className="flex items-center pl-4"><span className="flex items-center gap-0.5 text-xl"></span><span>{showEditButton ? userInfo?.bio : userStateInfo.bio}</span></h1>
      </div>
    </div>
    
    
    </>
  )

}
export default ProfileCard