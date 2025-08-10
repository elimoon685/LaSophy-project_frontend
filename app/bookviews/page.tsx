'use client'

import { useState, useEffect } from "react"
import BookApi from "@/api/book"
import BookCard from "@/component/BookCard"
import { GetAllBooksInfoResponse} from "@/inference/BookCommentResponseType"
const BookViews=()=>{
      const [books, setBooks]=useState<GetAllBooksInfoResponse[]>([])

    useEffect(()=>{
        const fetchBooks= async ()=>{
            try{
            const response= await BookApi.getAllBooks()
            setBooks(response.data.data)
            } catch(error){
                console.error("Failed to fetch books", error);
            }
        }
        fetchBooks();
    },[])
    
return (
  
    
    <>
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,250px))] gap-4">
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
    
    </>
)
}
export default BookViews