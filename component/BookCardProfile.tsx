"use client"
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import LikeOrCollectApi from "@/api/like_or_collect";
type BookCardCore = {
  bookId: number;
  pdfPath: string;
  imgPath: string;
  title: string;
};
type Controlled<T extends BookCardCore> = {
  model: "booklike" | "bookcollect",
  isCurrentUser:boolean,
  value: T[],
  setValue: React.Dispatch<React.SetStateAction<T[]>>;
  current: T,
};
function BookCardProfile<T extends BookCardCore>({ value, setValue, current, model, isCurrentUser}: Controlled<T>) {


  const router = useRouter();
  const [openDot, setOpenDot] = useState<boolean>(false)
  const refMenu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!openDot) return;  
    const handleMenuOnBlur = (e: MouseEvent) => {
      if (refMenu.current && !refMenu.current.contains(e.target as Node)) {
        setOpenDot(false)
      }
    }
    document.addEventListener("click", handleMenuOnBlur)
    return () => document.removeEventListener("click", handleMenuOnBlur)
  }, [openDot])
  const DeleteBookLikeOrCollect = async (id: number) => {

    if (model === "booklike") {
      const snapshot = value;
      setValue(prev =>
        prev.filter(bl => bl.bookId !== current.bookId)
      )
      try {
        const result = await LikeOrCollectApi.deleteUserBookLikeById(id)
      } catch (err) {
        setValue(snapshot);
      }
    } else {
      const snapshot = value;
      setValue(prev =>
        prev.filter(bc => bc.bookId !== current.bookId)
      )
      try {
        const result = await LikeOrCollectApi.deleteUserBookCollectById(id)
      } catch (err) {
        setValue(snapshot);
      }
    }
    setOpenDot(false)
  }
  const openDotButton = (e: React.MouseEvent<SVGElement>) => {
    e.stopPropagation();
    setOpenDot(prev => !prev)
  }
  return (
    <div className={`flex flex-col w-[170px] h-[240px] shadow-lg drop-shadow-md cursor-pointer shadow-black/30 relative ${openDot ? "z-[60]" : ""}`}
    onClick={()=>router.push(`/bookviews/${current.pdfPath}?bookId=${current.bookId}`)}
    >

      <div className="flex justify-center bg-gray-100">
        <img
          src={`${process.env.NEXT_PUBLIC_LASOPHY_BOOK_COVER_STORAGE_URL}${current.imgPath}`}
          alt={current.pdfPath}
          className="w-30 h-42"
        />
      </div>
      <div className="px-2 mt-2"><p className="text-sm font-bold">{current.title.length > 55 ? current.title.slice(0, 56) + "..." : current.title}</p></div>
      {isCurrentUser &&
      <div className="absolute left-[87%] top-[2%]"
            ref={refMenu}>
             
        <HiOutlineDotsVertical
          className="hover:ring-1 ring-black rounded-full"
          onClick={openDotButton}
        /></div>
      }
      {openDot && <div 
        className="absolute py-1 px-2 left-[97%] -top-[5%] rounded-2xl bg-white hover:font-bold cursor-pointer"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); DeleteBookLikeOrCollect(current.bookId)}}
      >
        <span>Delete</span></div>}
    </div>
  )
}
export default BookCardProfile