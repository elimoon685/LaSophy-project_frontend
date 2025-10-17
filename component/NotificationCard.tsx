"use client"
import { useState } from "react"
import { FaRegCommentDots } from "react-icons/fa";
import { FcLikePlaceholder } from "react-icons/fc";
import { GetUserReplyHistoryResponse } from "@/inference/UserResponseType";
import { RxAvatar } from "react-icons/rx";
import { timeAgo } from "@/lib/CalculateTime";
//I hope to get the wesocket data here
//and get the history data and put here
// so i need to use websocket context 
type NotificationProps={
  replyHistory:GetUserReplyHistoryResponse[]
}
const NotificationCard = ({replyHistory}:NotificationProps) => {

  const [panel, setPanel] = useState<"reply" | "commentlike">("reply")
  return (
    <div className="flex flex-grow max-w-[400px]">
      <div className="flex flex-col flex-grow p-3">
        <h1 className="text-xl flex self-center mb-3">Notification lists</h1>
        <div className="flex">
          <div className="flex flex-grow">
            <div className="flex flex-grow">
              <button className="flex items-center gap-2 bg-gray-100 rounded-2xl px-2 py-1 hover:ring-1 ring-black" onClick={() => setPanel(prev => prev = "reply")}><FaRegCommentDots /> Reply</button>
            </div>
            <div className="flex flex-grow">
            <button className="flex items-center gap-2 bg-gray-100 rounded-2xl px-2 py-1 hover:ring-1 ring-black" onClick={() => setPanel(prev => prev = "commentlike")}><FcLikePlaceholder />Comment like</button>
            </div>
          </div>
        </div>
        <div className="flex flex-col border-1 border-black flex-grow max-h-[570px] mt-2 p-1 overflow-auto">
          {panel === "reply" && 
            (
              replyHistory.map(reply=>(

                <div className="flex border-b-1 border-gray-200 gap-2 py-2">
                 <RxAvatar className="w-8 h-8 "/>
                <div className="flex flex-col w-full">
                  <p className="">{reply.actorUserName}</p>
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
          {panel === "commentlike" && <div>
            
            </div>}
        </div>
      </div>

    </div>
  )
}
export default NotificationCard