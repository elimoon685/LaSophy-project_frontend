"use client"
import { useState } from "react"
import { FaRegCommentDots } from "react-icons/fa";
import { FcLikePlaceholder } from "react-icons/fc";
//I hope to get the wesocket data here
//and get the history data and put here
// so i need to use websocket context 
const NotificationCard = () => {
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
        <div className="flex col border-1 border-black flex-grow mt-2">
          {panel === "reply" && <div></div>}
          {panel === "commentlike" && <div></div>}
        </div>
      </div>

    </div>
  )
}
export default NotificationCard