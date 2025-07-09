'use client'
import PdfReader from "@/component/PdfReader"
import BookInfo from "@/component/BookInfo";
import BookComments from "@/component/BookComments";
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import BookApi from "@/api/book";
import { GetBookInfoResponse ,GetCommentResponse} from "@/inference/BookCommentResponseType";
import LikeOrCollectApi from "@/api/like_or_collect";
import toast from "react-hot-toast";
const BookArea= ()=>{
    const searchParams = useSearchParams();
    const rawBookId = searchParams.get('bookId');
    const bookId = rawBookId ? parseInt(rawBookId, 10) : null;
    const params = useParams();
    const pdfFilename = params.pdf;
    const [booksInfo, setBooksInfo]=useState<GetBookInfoResponse|undefined>()
    const [likeCount, setLikeCount]=useState<number>(0)
    const [collectCount, setCollectCount]=useState<number>(0)
    const [isLikeClicked, setIsLikeClicked]=useState<boolean>(false)
    const [isCollectClicked, setIsCollectClicked]=useState<boolean>(false)
    const [bookComments, setBookComments]=useState<GetCommentResponse[]>([])
    const [isLoading, setIsLoading]=useState<boolean>(false)
    useEffect(()=>{
        const fetchBooks= async ()=>{
            try{
            const response= await BookApi.getBooksInfoByPdfpath({pdfPath:pdfFilename})
            console.log("bookinfo", response.data.data)
            const commentResponse=await BookApi.getBookCommentsByBookId(bookId)
            setBooksInfo(response.data.data) 
            setBookComments(commentResponse.data.data)
            setIsLikeClicked(response.data.data.currentUserLike)
            setIsCollectClicked(response.data.data.currentUserCollect)
            setLikeCount(response.data.data.likeCount)
            setCollectCount(response.data.data.collectCount)
            setIsLoading(true)
            } catch(error){
                console.error("Failed to fetch books", error);
            }
        }
        fetchBooks();
    },[])

    const handleLike=async ()=>{
    try{
     const response=await LikeOrCollectApi.getCurrentLikeCount(booksInfo?.id)
     console.log(response.data)
      setLikeCount(response.data.data)
    }
    catch(err:any){
        if (err.response?.status === 401) {
            toast.error("Please log in first.");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
    }
    }
    const handleCollect=async ()=>{
        try{
            const response=await LikeOrCollectApi.getCurrentCollectCount(booksInfo?.id)
             setCollectCount(response.data.data)
           }
           catch(err:any){
            if (err.response?.status === 401) {
                toast.error("Please log in first.");
              } else {
                toast.error("Something went wrong. Please try again.");
              }
           }
    }
    return (
        <div className="min-h-screen w-screen">
            {isLoading && <>
        <PdfReader fileName={`${process.env.NEXT_PUBLIC_LASOPHY_BOOK_PDF_STORAGE_URL}${pdfFilename}`}/>

        <BookInfo title={booksInfo?.title} 
                  author={booksInfo?.author} 
                  year={booksInfo?.year} 
                  handleCollect={handleCollect} 
                  handleLike={handleLike}
                  isLikeClicked={isLikeClicked}
                  isCollectClicked={isCollectClicked}
                  setLike={setIsLikeClicked}
                  setCollect={setIsCollectClicked}
                  likeCount={likeCount}
                  collectCount={collectCount}
                  />
        <BookComments bookId={bookId} bookComments={bookComments} setBookComments={setBookComments}/>
           </> }
        </div>
    )
}
export default BookArea