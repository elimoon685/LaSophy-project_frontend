'use client'
import PdfReader from "@/component/PdfReader"
import BookInfo from "@/component/BookInfo";
import BookComments from "@/component/BookComments";
import { useSearchParams } from 'next/navigation';
import { useParams } from 'next/navigation'
import { useEffect, useState,useMemo} from "react";
import BookApi from "@/api/book";
import { GetBookInfoResponse ,GetCommentResponse} from "@/inference/BookCommentResponseType";
import LikeOrCollectApi from "@/api/like_or_collect";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/inference/UserResponseType";
import NewBookComments from "@/component/NewBookComments";
import NewBookCommentsVersion from "@/component/BookCommentsVersion4";
//do not write in this way
type commentLikeInfo = { currentLike: boolean; count: number };
type likeRoots=Partial<Record<number,Record<number,commentLikeInfo>>>;
const BookArea= ()=>{
    const sp = useSearchParams();
    const rawBookId = sp.get('bookId');
    const targetId = sp.get('commentId') ? Number(sp.get('commentId')) : undefined;
    console.log("targetId", targetId)
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
    const [userId, setUserId]=useState<string>();
    const [commentlikes, setCommentLikes] = useState<likeRoots>({});
    
    function flattenCommentLikes(root: GetCommentResponse[]):likeRoots {
        const likesByRoot:likeRoots={};
        for(const c of root){
            if (!likesByRoot[c.commentsId]) {
                likesByRoot[c.commentsId] = {};
              }
          likesByRoot[c.commentsId]![c.commentsId]={currentLike:c.commentLikedByMe, count:c.commentLikesCount};
          const parentStack=[...c.replies]
          while(parentStack.length){
            const reply=parentStack.pop()!;
            likesByRoot[c.commentsId]![reply.commentsId]={currentLike:reply.commentLikedByMe, count:reply.commentLikesCount}
            if(reply.replies?.length) parentStack.push(...reply.replies)
          }

        }
        return likesByRoot
      }
    useEffect(()=>{
        const fetchBooks= async ()=>{
            try{
            const response= await BookApi.getBooksInfoByBookId(bookId)
            const commentResponse=await BookApi.getBookCommentsByBookId(bookId);
            //const seeded = flattenLikes(commentResponse.data.data);
            const bookComments=commentResponse.data.data;
            const commentLikesStructure=flattenCommentLikes(bookComments);
           
            
            setBookComments(bookComments)
            setIsLikeClicked(response.data.data.currentUserLike)
            setIsCollectClicked(response.data.data.currentUserCollect)
            setLikeCount(response.data.data.likeCount)
            setCollectCount(response.data.data.collectCount)
            setCommentLikes(commentLikesStructure)
            setIsLoading(true)
            } catch(error){
                console.error("Failed to fetch books", error);
            }
        }
        const fetchUserId=()=>{
            const token = Cookies.get("token")
            if(token){
                const decoded:JwtPayload = jwtDecode(token);
                setUserId(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"])
            }else{
                setUserId(undefined)
            }
        }
        fetchBooks();
        fetchUserId();

    },[])

    const handleLike=async(likeOrNot:boolean)=>{
        console.log("likeorNot", likeOrNot)
    try{
        debugger
        if(likeOrNot){
            const response=await LikeOrCollectApi.getCurrentLikeCount({
                bookId:booksInfo?.id,
                isLiked:true
            })
            setLikeCount(response.data.data)
        }else{
            const response=await LikeOrCollectApi.getCurrentLikeCount(
                {
                    bookId:booksInfo?.id,
                    isLiked:false
                }
            )
            setLikeCount(response.data.data)
        }
     
    }
    catch(err:any){
        if (err.response?.status === 401) {
            toast.error("Please log in first.");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
    }
    }

    const handleCollect=async (collectOrNot:boolean)=>{
        try{
            if(!collectOrNot){
                const response=await LikeOrCollectApi.getCurrentCollectCount({
                    bookId: booksInfo?.id,
                    isCollected:false})
                    setCollectCount(response.data.data)
            }else{
                const response=await LikeOrCollectApi.getCurrentCollectCount({
                    bookId: booksInfo?.id,
                    isCollected:true})
                    setCollectCount(response.data.data)
            }
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
        <div className="w-screen">
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
        {/*<BookComments bookId={bookId} bookComments={bookComments} setBookComments={setBookComments} userId={userId}/>*/}
        {/* <NewBookComments bookId={bookId} bookComments={bookComments} setBookComments={setBookComments} userId={userId} /> */}
        <NewBookCommentsVersion bookId={bookId} bookComments={bookComments} setBookComments={setBookComments} userId={userId} commentlikes={commentlikes} setCommentLikes={setCommentLikes} targetId={targetId}/> 
           </> }
        </div>
    )
}
export default BookArea         