'use client'
import { RxAvatar } from "react-icons/rx";
import { BsCalendarDate } from "react-icons/bs";
import { TfiThought } from "react-icons/tfi";
import { GoGear } from "react-icons/go";
import { useRouter } from "next/navigation";
import { ParamValue } from "next/dist/server/request/params";
import { useSelector} from 'react-redux';
import { RootState} from "@/store/store";
interface ProfileCardPros{
  userId:ParamValue
}
const ProfileCard = ({userId}:ProfileCardPros) => {
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const router=useRouter()

  
  const openProfile=()=>{
    router.push(`/profile/${userId}/settings`);; // Only change URL
  }

  
  return (
    <>
    <div className="flex mt-6 gap-6 border-b border-black">
      <div className="flex gap-6 my-6 ml-6">
      <div>
     <RxAvatar className="w-25 h-25"/>
      </div>
      <div className="flex flex-col gap-4 ml-6">
       <h1 className="text-4xl font-bold">{userInfo?.userName}</h1>
       <h1 className="flex items-center gap-2"><span className="flex items-center gap-0.5"><BsCalendarDate/>:</span><p className="flex gap-2"><span className="text-gray-500">Joined</span><span className="font-bold">{new Date(userInfo?.createdAt?? "").toDateString()}</span></p></h1>
       <h1 className="flex items-center"><span className="flex items-center gap-0.5"><TfiThought />:</span><span>{userInfo?.bio}</span></h1>
      </div>
      <div>
      <button className="flex items-center border border-gray-400 rounded-3xl px-2 py-1 gap-2 ml-6 cursor-pointer"
              onClick={openProfile}
      ><GoGear className="w-5 h-5" /> <span> Edit profile</span></button>
      </div>
      </div>
    </div>
    
    
    </>
  )

}
export default ProfileCard