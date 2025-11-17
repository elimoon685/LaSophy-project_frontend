"use client"
import { useState, useContext, useCallback, startTransition} from "react"
import { FaRegCommentDots } from "react-icons/fa";
import { FcLikePlaceholder } from "react-icons/fc";
import { GetUserReplyHistoryResponse, GetUserCommentLikeHistoryResponse } from "@/inference/UserResponseType";
import { RxAvatar } from "react-icons/rx";
import { timeAgo } from "@/lib/CalculateTime";
import { WSContext } from "@/provider/WebsocketProvider";
import { useRouter } from "next/navigation";
import { NotificationApi } from "@/api/notification";
//I hope to get the wesocket data here
//and get the history data and put here
// so i need to use websocket context 
type NotificationProps = {
  replyHistory: GetUserReplyHistoryResponse[],
  commentLikeHistpry: GetUserCommentLikeHistoryResponse[],
  setReplyHistory:React.Dispatch<React.SetStateAction<GetUserReplyHistoryResponse[]>>
  setCommentLikeHistory:React.Dispatch<React.SetStateAction<GetUserCommentLikeHistoryResponse[]>>
}
const NotificationCard = ({ replyHistory, commentLikeHistpry, setCommentLikeHistory, setReplyHistory}: NotificationProps) => {
  const ctx = useContext(WSContext);
  const router=useRouter();
  if (!ctx) throw new Error("Wrap this tree with <ServerEventsProvider url=...>");
  const {unReadMesCount, commentLikeMessage, replymessage, setUnReadCount} = ctx;
  const [panel, setPanel] = useState<"reply" | "commentlike">("reply")
  
  async function markReplyRead(notificationId: number) {
    try {
      const result=await NotificationApi.markReplyNotificationRead(notificationId); 
      if(result.data.data){
        setUnReadCount(prev=>prev-1)
      }
      // PATCH /notifications/:id/read
    } catch (e) {
      console.error("markRead failed", e);
    }
  }
  async function markLikeRead(notificationId: number) {
    try {
      const result=await NotificationApi.markLikeNotificationRead(notificationId); // PATCH /notifications/:id/read
      if(result.data.data){
        setUnReadCount(prev=>prev-1)
      }
    } catch (e) {
      console.error("markRead failed", e);
    }
  }
  const openReply=useCallback((replyMes:GetUserReplyHistoryResponse)=>{
 if(!replyMes.readAt){
    setReplyHistory(prev=>
      prev.map(r=>
        r.id===replyMes.id ? {...r, readAt:new Date()} : r
      )
    )
    void markReplyRead(replyMes.id);
  }
    startTransition(() => {
      router.push(`/bookviews/${replyMes.pdfPath}?bookId=${replyMes.bookId}&commentId=${replyMes.commentId}`);
    });
  }, [router])
  const openLike=useCallback((LikeMes:GetUserCommentLikeHistoryResponse)=>{
if(!LikeMes.readAt){
    setCommentLikeHistory(prev=>
      prev.map(r=>
        r.id===LikeMes.id ? {...r, readAt:new Date()} : r
      )
    )
    void markLikeRead(LikeMes.id);
  }
    // 低优先级导航
    startTransition(() => {
      router.push(`/bookviews/${LikeMes.pdfPath}?bookId=${LikeMes.bookId}&commentId=${LikeMes.commentId}`);
    });
  }, [router])
  return (
    <div className="flex flex-grow max-w-[400px] min-h-0">
      <div className="flex flex-col flex-grow p-3 min-h-0">
        <h1 className="text-xl flex self-center mb-3">Notification lists</h1>
        <div className="flex flex-col">
          <div className="flex flex-grow">
            <div className="flex flex-grow">
              <button className={`flex items-center gap-2 bg-gray-100 rounded-2xl cursor-pointer px-2 py-1  ${panel==="reply" && "ring-black ring-1" }`} onClick={() => setPanel(prev => prev = "reply")}><FaRegCommentDots /> Reply</button>
            </div>
            <div className="flex flex-grow">
              <button className={`flex items-center gap-2 bg-gray-100 rounded-2xl cursor-pointer px-2 py-1 ${panel==="commentlike" && "ring-black ring-1"}`} onClick={() => setPanel(prev => prev = "commentlike")}><FcLikePlaceholder />Comment like</button>
            </div>
          </div>
          <div className="relative h-1">
          <div className={`absolute top-[100%] w-[40px] h-[2px] bg-black ${panel==="reply"? "left-[5%]" : "left-[56%]"} transition-[left] duration-400 ease-in-out`}></div>
          </div>
        </div>
        <div className="flex flex-col flex-1 border-1 border-gray-300 rounded-xl mt-2 p-1 min-h-0">
          <div className="h-full overflow-y-auto p-1">
          {panel === "reply" &&
            (
              replyHistory.map(reply => (

                <div  key={reply.commentId}
                  className="flex border-b-1 border-gray-200 gap-2 py-2 cursor-pointer"
                  onClick={()=>openReply(reply)}         
                >
                 
                  <RxAvatar className="w-9 h-9 " />
                  <div className="flex flex-col w-full">
                    <p className="flex justify-between">{reply.actorUserName} { !reply.readAt && <span className="w-2 h-2 rounded-2xl bg-red-500 self-end"> </span>}</p>
                    <div className="flex flex-col gap-1">
                      <p className="flex text-sm text-gray-500"><span className="flex-1">reply to your comment</span> <span className="flex-1">{timeAgo(reply.createdAt)}</span></p>
                      <p className="ml-3">{reply.content}</p>
                      <p className="border-l-4 border-gray-300 pl-2 text-gray-500 m-0">{reply.parentCommentContent}</p>
                    </div>
                  </div>
                </div>
              ))
            )

          }
          {panel === "commentlike" && 
          (commentLikeHistpry.map(like=>(

            <div key={like.commentId}
            className="flex border-b-1 border-gray-200 gap-2 py-2 cursor-pointer"
            onClick={()=>openLike(like)}
            >
               <RxAvatar className="w-8 h-8 " />
               <div className="flex flex-col w-full"> 
                    <p className="flex justify-between">{like.actorUserName} { !like.readAt && <span className="w-2 h-2 rounded-2xl bg-red-500 self-end"> </span>}</p>
                    <div className="flex flex-col gap-1">
                      <p className="flex text-sm text-gray-500"><span className="flex-1">like your comment</span> <span className="flex-1">{timeAgo(like.createdAt)}</span></p>
                      <p className="border-l-4 border-gray-300 pl-2 text-gray-500 m-0">{like.content}</p>
                    </div>
                  </div>

            </div>

          ))

            
            )}
        </div>
        </div>
      </div>

    </div>
  )
}
export default NotificationCard