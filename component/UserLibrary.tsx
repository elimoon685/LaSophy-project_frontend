"use client"
import { useState } from "react"
const UserLikeOrCollects=()=>{

    const [panel, setPanel]=useState<"booklike"|"bookcollect">("booklike")
    return (
        <div className="flex flex-col">
            <div className="flex">
            <button className="">
             Like
            </button>
            <button>
             Collect
            </button>
            </div>
            <div></div>
        </div>
    )
}
export default UserLikeOrCollects