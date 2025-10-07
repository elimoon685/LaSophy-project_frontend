"use client"
//import {GiSpellBook} from "react-icons/gi";
//import { FaRegHeart } from "react-icons/fa";
//import { FaRegStar } from "react-icons/fa";
//import { FaRegCommentAlt } from "react-icons/fa";
import {BookOpen} from "lucide-react";
import {Heart} from "lucide-react";
import {Star} from "lucide-react";
import {MessageSquareMore} from "lucide-react";

import { useRouter } from "next/navigation";
import Image from "next/image";
interface BookCardPros{

    coverUrl: string,
    title:string,
    author:string,
    year:string,
    pdfPath:string,
    bookId:number,
    commentCount:number,
    bookLikeCount:number,
    bookCollectCount:number,
}

const BookCard=({coverUrl,title, author, year, pdfPath, bookId, commentCount, bookCollectCount, bookLikeCount}:BookCardPros)=>{
    const router=useRouter();

 return(
    <div className="flex flex-col shadow-lg justify-between rounded-lg hover:shadow-xl transition w-[250px] h-[424px]"
         onClick={()=>router.push(`/bookviews/${pdfPath}?bookId=${bookId}`)}
    >
    <div className="flex justify-center bg-gray-100"> 
        <img
        src={coverUrl}
        alt={pdfPath}
        //loading="lazy"
        //width={40}
        //height={64}
        className="w-40 h-64"
        />
    </div>
    <div className="px-3 font-bold text-lg">{title.length>60 ? title.slice(0,61)+"..." : title}</div>
    <div className="mt-1 px-3">By {author}</div>
    <div className="flex py-2 px-1 justify-between items-center"> 
    <BookOpen className="w-7 h-7 ml-2"/>
    <div className="flex justify-between gap-10 px-4">
    <div className="flex flex-col items-center"><Heart className="w-5 h-5"/><span className="text-sm">{bookLikeCount}</span></div>
    <div className="flex flex-col items-center"><Star className="w-5 h-5"/><span className="text-sm">{bookCollectCount}</span></div>
    <div className="flex flex-col items-center"><MessageSquareMore className="w-5 h-5"/><span className="text-sm">{commentCount}</span></div>
    </div>
    </div>
    </div>

 )
}
export default BookCard