'use client'

import { useState, useEffect } from "react"
import BookApi from "@/api/book"
import BookCard from "@/component/BookCard"
import { GetAllBooksInfoResponse} from "@/inference/BookCommentResponseType"
const BookViews=()=>{
      const [books, setBooks]=useState<GetAllBooksInfoResponse[]>([])
      const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const fetchBooks= async ()=>{
            setLoading(true);
            try{
            const response= await BookApi.getAllBooks()
            setBooks(response.data.data)
            } catch(error){
                console.error("Failed to fetch books", error);
            }finally{
                setLoading(false);
            }
        }
        fetchBooks();
    },[])
    
return (
    <div className="flex flex-col flex-grow">
    {loading && (
        <div className="z-[9999] h-1 w-full overflow-hidden bg-transparent">
          <div className="h-full animate-[indet_1.1s_linear_infinite] rounded-r bg-gradient-to-r from-gray-700 to-gray-500" />
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