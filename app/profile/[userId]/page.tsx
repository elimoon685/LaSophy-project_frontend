'use client'
export const dynamic = "force-dynamic";
import ProfileCard from "@/component/ProfileCard"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react";
import ProfileApi from "@/api/profile";
import { NotificationApi } from "@/api/notification";
import NotificationCard from "@/component/NotificationCard";
import { GetUserInfoResponse } from "@/inference/UserResponseType";
import { GetUserReplyHistoryResponse } from "@/inference/UserResponseType";
import UserLikeOrCollects from "@/component/UserLibrary";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUserInfo } from "@/store/slices/userInfo";
const Profile = () => {
  type RouteParams = { userId: string };
  const { userId } = useParams<RouteParams>();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [replyHistory, setReplyHistory]=useState<GetUserReplyHistoryResponse[]>([])
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await ProfileApi.getUserInfo(userId)
        dispatch(setUserInfo(response.data.data))//that is action function created by createSlice, setuserInfo=function (payload){return {type: ....., payload:.....}}
        const replyResponse=await NotificationApi.userReplyHistory()
        setReplyHistory(replyResponse.data.data)
        console.log("reply", replyResponse.data)
      } catch (err: any) {
      }
    }
    fetchUserInfo();
  }, [])
  return (
    <div className="flex flex-grow">
      <NotificationCard replyHistory={replyHistory}/>
      <div className="flex flex-col flex-grow">
        <ProfileCard userId={userId} />
        <UserLikeOrCollects />
      </div>
    </div>

  )
}
export default Profile