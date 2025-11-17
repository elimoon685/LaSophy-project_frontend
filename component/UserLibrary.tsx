"use client"
import { useState } from "react"
import { FaRegHeart } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import LikeOrCollectApi from "@/api/like_or_collect"
import BookCardProfile from "./BookCardProfile";
import { GetUserBookLikeResponse ,GetUserBookCollectResponse} from "@/inference/UserResponseType";

type Props ={
    bookLikeList:GetUserBookLikeResponse[],
    bookCollectList:GetUserBookCollectResponse[],
    setBookLikeList:React.Dispatch<React.SetStateAction<GetUserBookLikeResponse[]>>,
    setBookCollectList:React.Dispatch<React.SetStateAction<GetUserBookCollectResponse[]>>,
    isCurrentUser:boolean,


}
const UserLikeOrCollects=({bookLikeList, bookCollectList, setBookLikeList,  setBookCollectList, isCurrentUser}:Props)=>{

    const [panel, setPanel]=useState<"booklike"|"bookcollect">("booklike")
    return (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex flex-col w-fit ml-4 sm:ml-1">
            <div className="flex gap-8 mt-2">
            <button className={`flex px-2 py-1 bg-gray-100 rounded-2xl items-center gap-2 ${panel==="booklike" && "ring-black ring-1" }`} onClick={()=>setPanel(prev=>prev="booklike")}><FaRegHeart/>
             Like
            </button>
            <button className={`flex px-2 py-1 bg-gray-100 rounded-2xl items-center gap-2 ${panel==="bookcollect" && "ring-black ring-1" }`} onClick={()=>setPanel(prev=>prev="bookcollect")}><FaRegStar/>
             Collect
            </button>
            </div>
            <div className="relative h-1">
                <div className={`absolute w-[20px] top-[100%] bg-black h-[2px] ${panel==="booklike" ? "left-[12%]": "left-[72%]"} transition-[left] duration-400 ease-in-out`}></div>
            </div>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,170px))] gap-6 mt-2 relative px-3 py-3 rounded-xl overflow-y-auto">
            {panel==="booklike" && (
             
             bookLikeList.map(bl=> 
             <BookCardProfile<GetUserBookLikeResponse> key={bl.bookId} value={bookLikeList} setValue={setBookLikeList} current={bl} model="booklike" isCurrentUser={isCurrentUser}/>

            ))
            }
            {panel==="bookcollect" && (
                bookCollectList.map(bc=> 
                <BookCardProfile<GetUserBookCollectResponse> key={bc.bookId} value={bookCollectList} setValue={setBookCollectList} current={bc} model="bookcollect" isCurrentUser={isCurrentUser}/>
                ))
            }
            </div>
        </div>
    )
}
export default UserLikeOrCollects