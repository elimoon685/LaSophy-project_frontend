'use client'
export const dynamic = "force-dynamic";
import ProfileCard from "@/component/ProfileCard"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react";
import ProfileApi from "@/api/profile";
import NotificationCard from "@/component/NotificationCard";
import { GetUserInfoResponse } from "@/inference/UserResponseType";
import UserLikeOrCollects from "@/component/UserLibrary";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUserInfo } from "@/store/slices/userInfo";
const Profile = () => {
  const params = useParams();
  const userId = params.userId;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await ProfileApi.getUserInfo({ userId: userId })
        dispatch(setUserInfo(response.data.data))//that is action function created by createSlice, setuserInfo=function (payload){return {type: ....., payload:.....}}
      } catch (err: any) {
      }
    }
    fetchUserInfo();
  }, [])
  return (
    <div className="flex flex-grow">
      <NotificationCard />
      <div className="flex flex-col flex-grow">
        <ProfileCard userId={userId} />
        <UserLikeOrCollects />
      </div>
    </div>

  )
}
export default Profile