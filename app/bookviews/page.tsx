'use client'

import { useState, useEffect, useRef} from "react"
import BookApi from "@/api/book"
import BookCard from "@/component/BookCard"
import { GetAllBooksInfoResponse} from "@/inference/BookCommentResponseType"
const BookViews=()=>{
      const [books, setBooks]=useState<GetAllBooksInfoResponse[]>([])
      const [progress, setProgress]=useState<number>(0)
      const tickRef=useRef<number |null>(null)
      const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const fetchBooks= async ()=>{
            setLoading(true);
            tickRef.current=window.setInterval(()=>{
            setProgress(p => (p < 95 ? p + (p < 30 ? 10 : p < 70 ? 5 : 2) : 96));
            }, 150)
            try{
            const response= await BookApi.getAllBooks()
            setBooks(response.data.data)
            } catch(error){
                console.error("Failed to fetch books", error);
            }finally{
                if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
                setProgress(100);   
                setTimeout(() => { setLoading(false); setProgress(0); }, 300);

            }
        }
        fetchBooks();
    },[])
    
return (
    <div className="flex flex-col flex-grow relative">
    {loading && (
        <div role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className={`absolate left-0 top-0 w-full h-1 pointer-events-none z-[9999]
                    transition-opacity duration-300 ${loading ? "opacity-100" : "opacity-0"}`}>
          <div  className="h-full bg-blue-600 origin-left transition-transform duration-200 ease-out"
          style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      )}
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,250px))] gap-6 mt-10 ml-10 relative">
    {books?.map((book)=>(
    <BookCard key={book.id}
              coverUrl={`${process.env.NEXT_PUBLIC_LASOPHY_BOOK_COVER_STORAGE_URL}${book.imgPath}`}
              title={book.title}
              author={book.author}
              year={book.year}
              pdfPath={book.pdfPath}
              bookId={book.id}
              commentCount={book.commentCount}
              bookLikeCount={book.likeCount}
              bookCollectCount={book.collectCount}
    />
    ))


    }
    </div>
    </div>
    
)
}
export default BookViews