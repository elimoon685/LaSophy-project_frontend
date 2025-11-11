'use client'
import React, { useRef, useState, useEffect } from "react";
import { MdFileUpload } from "react-icons/md";
import UploadApi from "@/api/upload";
import { UploadFormData } from "@/inference/BookCommentRequestType";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { JwtPayload } from "@/inference/UserResponseType";
import toast from "react-hot-toast";
const Upload = () => {
  type AuthStatus = 'checking' | 'authed' | 'unauth';
  const [uploadFormData, setUploadFormData] = useState<UploadFormData>({
    BookName: "",
    Author: "",
    Year: "",
    PDF: null,
    IMG: null,
  })
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileStatus, setFileStatus] = useState<string | null>(null)
  const [cover, setCover] = useState<File | undefined>(undefined);
  const [coverStatus, setCoverStatus] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<AuthStatus>("checking");
  const [count, setCount]=useState<number>(5)
  const router = useRouter();

  //add the global event to prevent drop the file outside
  useEffect(() => {
    let tickId: number | undefined;
    let toId: number | undefined;
    const startCountDown=()=>{
          setIsLoading("unauth")
          tickId=window.setInterval(()=>{
            setCount((c)=>Math.max(0, c-1))
          }, 1000);
          toId=window.setTimeout(()=>{
            router.replace("login")
          }, 5000)
    }
    const token = Cookies.get("token")
    if (!token) {
      startCountDown();
    } else {
      try{
        const decoded:JwtPayload = jwtDecode(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if (isTokenExpired) {
          startCountDown()
        }else{
          setIsLoading("authed");
          return;
        }
    } catch{
      startCountDown();
    }
  }
  setIsLoading("unauth");
  return () => {
    if (tickId !== undefined) clearInterval(tickId);
    if (toId !== undefined) clearTimeout(toId);
  };
  }, [router])

   const processPDF=(droppedFile:File|undefined)=>{
    if (droppedFile && droppedFile.type === "application/pdf") {
      setUploadFormData({ ...uploadFormData, PDF: droppedFile })
      setFileStatus("ready")
    } else {
      toast.error("Please drop a valid PDF file.");
    }

   }
   const processCover=(droppedCover:File|undefined)=>{
    if (droppedCover && droppedCover.type.startsWith("image/")) {
      setUploadFormData({ ...uploadFormData, IMG: droppedCover })
      setCoverStatus("ready")
    } else {
      toast.error("Please drop a valid IMG.");
    }
    
   }
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const droppedFile: File | undefined = e.dataTransfer.files[0];
    processPDF(droppedFile)
  }
  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
    const droppedCover: File | undefined = e.dataTransfer.files[0]
    processCover(droppedCover)
  }
  const onPdfInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    processPDF(e.target.files?.[0]);
    e.currentTarget.value = ""; 
  }
  const onCoverInputChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    processCover(e.target.files?.[0]);
    e.currentTarget.value = ""; 
  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Required to allow drop
  };
  const handleCancelPDF=()=>{
    if(!uploadFormData.PDF) return;
    setUploadFormData(prev=>({...prev, PDF:null}))
    setFileStatus(null);
  }
  const handleCancelIMG=()=>{
    if(!uploadFormData.IMG) return;
    setUploadFormData(prev=>({...prev, IMG:null}))
    setCoverStatus(null);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!uploadFormData.Author.trim() || !uploadFormData.BookName.trim() || !uploadFormData.Year.trim() || !uploadFormData.PDF || !uploadFormData.IMG){
      toast.error("Please fill all book info")
    }
    try {
      const formData = new FormData();
      formData.append("BookName", uploadFormData.BookName);
      formData.append("Author", uploadFormData.Author);
      formData.append("Year", uploadFormData.Year);
      if (uploadFormData.PDF) {
        formData.append("PDF", uploadFormData.PDF);
      }

      if (uploadFormData.IMG) {
        formData.append("IMG", uploadFormData.IMG);
      }
      try {
        const response = await UploadApi.adminUpload(formData)
        if (response.status === 200) {
          toast.success(response.data.message)
        }
      } catch (err: any) {
        toast.error(err.ErrorMessage)
      }
    } catch (error: any) {

    }
  }
  if (isLoading === 'checking') {
    return <div className="flex justify-center mt-5">
      <div className="inline-block px-20 py-10 border border-black bg-gray-300 shadow-lg drop-shadow-md shadow-black/30">
      <h1 className="text-2xl font-bold">Checking auth…</h1>
      </div>
      </div>
  }

  if (isLoading === 'unauth') {
    return (
      <div className="flex justify-center mt-5">
      <div className="px-24 py-10 border border-black bg-gray-300 shadow-lg drop-shadow-md shadow-black/30">
        <h1 className="text-2xl font-bold">Authentication required</h1>
        <p className="text-xl">Redirecting to login in <span className="font-bold">{count}</span> second{count !== 1 ? 's' : ''}…</p>
      </div>
      </div>
    );
  }
  
  return (

    <div className="flex flex-col flex-grow items-center justify-center">
      <div className="flex flex-col max-w-[1000px] w-full border-gray-200 border-1 rounded-xl shadow-lg drop-shadow-md shadow-black/30 px-10 py-4">
      <h1 className="text-4xl self-center mb-5">Upload content</h1>
      <form id="uploadForm" className="columns-1 md:columns-2 [column-gap:100px]" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-8 flex-grow">
          <div className="">
            <label htmlFor="bookname" className="Block text-xl">Book name</label>
            <input
              id="bookname"
              type="bookname"
              name="bookname"
              placeholder="Enter book name"
              value={uploadFormData.BookName}
              onChange={(e) => setUploadFormData({ ...uploadFormData, BookName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm mt-2"></input>
          </div>
          <div className="mt-6">
            <label htmlFor="bookauthor" className="Block text-xl">Author</label>
            <input
              id="bookauthor"
              type="bookauthor"
              name="bookauthor"
              placeholder="Enter book author"
              value={uploadFormData.Author}
              onChange={(e) => setUploadFormData({ ...uploadFormData, Author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm mt-2"></input>
          </div>
          <div className="mt-6">
            <label htmlFor="bookyear" className="Block text-xl mb-1">Published year</label>
            <input
              id="bookyear"
              type="bookyear"
              name="bookyear"
              placeholder="Enter book published year"
              value={uploadFormData.Year}
              onChange={(e) => setUploadFormData({ ...uploadFormData, Year: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500  text-sm mt-2"></input>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col mt-6 space-y-3">
            <label className="text-xl block">Upload the file</label>
            <div className="flex flex-col justify-center py-5 px-5 text-center border-2 border-dashed border-black bg-gray-400 rounded-sm h-[100px]"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >{!uploadFormData.PDF && <span className="text-center">Drag the file or choose from local</span>}
              {uploadFormData.PDF && <p>📄 File: {uploadFormData.PDF.name} ({(uploadFormData.PDF.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>
            <div className="flex justify-between items-center">
              {
                uploadFormData.PDF ?
                  <button type="button"
                  className="bg-black text-white text-center font-bold py-1 px-2 rounded-xl text-sm cursor-pointer"
                  onClick={handleCancelPDF}
                  >
                   Cancel
                  </button>
                  :
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()}
                className="bg-black text-white text-center font-bold py-1 px-2 rounded-xl text-sm cursor-pointer transition-colors duration-300"
              >Choose file
              </button>
               } 
              {fileStatus === "ready" && <p style={{ color: "blue" }}>✅ PDF saved in memory, ready to upload</p>}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={onPdfInputChange}
              accept="application/pdf"
              className="hidden"></input>
          </div>

          <div className="flex flex-col space-y-3">
            <label className="text-xl block">Upload the cover</label>
            <div className="flex flex-col justify-center py-5 px-5 text-center border-2 border-dashed border-black bg-gray-400 rounded-sm h-[100px]"
              onDrop={handleCoverDrop}
              onDragOver={handleDragOver}
            >
            {!uploadFormData.IMG && <span className="text-center">Drag the file or choose from local</span>}
              {/*cover && <p>📄 File: {cover.name} ({(cover.size / 1024 / 1024).toFixed(2)} MB)</p>*/}
              {uploadFormData.IMG && <p>📄 File: {uploadFormData.IMG.name} ({(uploadFormData.IMG.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>
            <div className="flex justify-between items-center">
              { uploadFormData.IMG ?
              <button type="button"
              className="bg-black text-white text-center font-bold py-1 px-2 rounded-xl text-sm cursor-pointer"
              onClick={handleCancelIMG}
              >
               Cancel
              </button>
              :
              <button
                type="button"
                onClick={() =>
                  coverInputRef.current?.click()}
                className="bg-black text-white text-center font-bold py-1 px-2 rounded-xl text-sm cursor-pointer"
              >Choose image</button>
            }
              {coverStatus === "ready" && <p style={{ color: "blue" }}>✅ IMG saved in memory, ready to upload</p>}
            </div>
            <input
              type="file"
              ref={coverInputRef} 
              onChange={onCoverInputChange}
              accept="image/*"
              className="hidden"></input>
          </div>
        </div>
      </form >
      <button type="submit" form="uploadForm" className="bg-black text-white flex items-center justify-between text-center py-1 px-4 rounded-sm text-xl cursor-pointer mt-12 self-center"><MdFileUpload className="mr-1.5 h-5 w-5" />Upload</button>
      </div>
    </div >

  )

}
export default Upload