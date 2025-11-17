'use client'
export const dynamic = "force-dynamic";
import ProfileCard from "@/component/ProfileCard"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react";
import ProfileApi from "@/api/profile";
import { NotificationApi } from "@/api/notification";
import LikeOrCollectApi from "@/api/like_or_collect";
import NotificationCard from "@/component/NotificationCard";
import { GetUserInfoResponse } from "@/inference/UserResponseType";
import { GetUserReplyHistoryResponse,GetUserCommentLikeHistoryResponse} from "@/inference/UserResponseType";
import UserLikeOrCollects from "@/component/UserLibrary";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { setUserInfo } from "@/store/slices/userInfo";
import { GetUserBookLikeResponse ,GetUserBookCollectResponse} from "@/inference/UserResponseType";
type UserInfo = { userId: string; userName: string };

const Profile = () => {
  type RouteParams = { userId: string };
  const { userId } = useParams<RouteParams>();
  const params = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [replyHistory, setReplyHistory]=useState<GetUserReplyHistoryResponse[]>([])
  const [commentLikeHistory, setCommentLikeHistory]=useState<GetUserCommentLikeHistoryResponse[]>([])
  const [bookLikeList, setBookLikeList]=useState<GetUserBookLikeResponse[]>([])
  const [bookCollectList, setBookCollectList]=useState<GetUserBookCollectResponse[]>([])
  const [isCurrentUser, setIsCurrentUser]=useState<boolean>(false)
  const [userInfo, setuserInfo]=useState<GetUserInfoResponse>({userName:"", email:"", bio:"", createdAt:""})
  const [isLoading, setIsloading]=useState<boolean>(false)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try { 
        const raw = localStorage.getItem("userInfo");
        let loginUserId: string | null = null;

      if (raw) {
        const userInfo = JSON.parse(raw) as UserInfo;
        loginUserId = userInfo.userId;
      }
      const isSelf = loginUserId !== null && loginUserId === userId;
      
        const response = await ProfileApi.getUserInfo(userId)
        setuserInfo({userName:response.data.data.userName,
        email:response.data.data.email,
        bio:response.data.data.bio,
        createdAt:response.data.data.createdAt,
})
        if(isSelf) {
          dispatch(setUserInfo(response.data.data));
          setIsCurrentUser(isSelf);
          
          const [replyResponse, commentLikeResponse] = await Promise.all([
            NotificationApi.userReplyHistory(),
            NotificationApi.userCommlikeHistory(),
          ]);
          setReplyHistory(replyResponse.data.data)
          setCommentLikeHistory(commentLikeResponse.data.data)
          
        }
        const bookLikeRespons=await LikeOrCollectApi.getAllBookLikeByUserId(userId);
        const bookCollectRespons=await LikeOrCollectApi.getAllBookCollectByUserId(userId)
        setBookLikeList(bookLikeRespons.data.data)
        setBookCollectList(bookCollectRespons.data.data)
       
      } catch (err: any) {
      }
    }
    fetchUserInfo();
  }, [])
  return (
    <div className="flex flex-grow min-h-0 max-h-[calc(100vh-150.828px)]">
      {isCurrentUser && <NotificationCard replyHistory={replyHistory} commentLikeHistpry={commentLikeHistory} setReplyHistory={setReplyHistory} setCommentLikeHistory={setCommentLikeHistory}/>}
      <div className="flex flex-col flex-grow min-h-0">
        <ProfileCard userId={userId} showEditButton={isCurrentUser} userStateInfo={userInfo}/>
      <UserLikeOrCollects bookLikeList={bookLikeList} bookCollectList={bookCollectList} setBookLikeList={setBookLikeList} setBookCollectList={setBookCollectList} isCurrentUser={isCurrentUser}/>
      </div>
    </div>

  )
}
export default Profile