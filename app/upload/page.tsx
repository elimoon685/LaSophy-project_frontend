'use client'
import { useRef, useState, useEffect } from "react";
import { MdFileUpload } from "react-icons/md";
import UploadApi from "@/api/upload";
import { UploadFormData } from "@/inference/BookCommentRequestType";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { JwtPayload } from "@/inference/UserResponseType";
const Upload = () => {

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token")
    if (token) {
      try {
        const decoded:JwtPayload = jwtDecode(token);
        const isTokenExpired = decoded.exp * 1000 < Date.now();
        if (isTokenExpired) {
          router.push("/login");
          return;
        }
        setIsLoading(false)
      } catch (error) {
        Cookies.remove("token")
      }
    } else {
      router.push("/login")
    }

  }, [])


  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile: File | undefined = e.dataTransfer.files[0];
    console.log(droppedFile)
    if (droppedFile && droppedFile.type === "application/pdf") {
      setUploadFormData({ ...uploadFormData, PDF: droppedFile })
      setFileStatus("ready")
    } else {
      alert("Please drop a valid PDF file.");
    }
  }
  const handleCoverDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedCover: File | undefined = e.dataTransfer.files[0]
    if (droppedCover && droppedCover.type.startsWith("image/")) {
      setUploadFormData({ ...uploadFormData, IMG: droppedCover })
      setCoverStatus("ready")
    } else {
      alert("Please drop a valid IMG.");
    }

  }
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          alert(response.data.message)
        }
      } catch (err: any) {
        const error = err.response?.data;
        alert(error.Message);

      }


    } catch (error: any) {

    }
  }


  return (

    <div className="flex flex-col items-center mt-5 mx-40 p-10">
      <h1 className="text-4xl">Upload content</h1>
      <form id="uploadForm" className="flex space-x-40" onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-8">
          <div className="mt-6">
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
        <div className="flex flex-col space-y-5">
          <div className="flex flex-col mt-6 space-y-1">
            <label className="text-xl block">Upload the file</label>
            <div className="py-8 px-12 text-center border-2 border-dashed border-black bg-gray-400 rounded-sm max-w-[300px]"
              onDrop={handleFileDrop}
              onDragOver={handleDragOver}
            >Drag the file or choose from local
              {/*file && <p>📄 File: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>*/}
              {uploadFormData.PDF && <p>📄 File: {uploadFormData.PDF.name} ({(uploadFormData.PDF.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  fileInputRef.current?.click()}
                className=" bg-black text-white text-center py-1 px-2 rounded-sm text-sm cursor-pointer"
              >Choose file
              </button>
              {fileStatus === "ready" && <p style={{ color: "blue" }}>✅ PDF saved in memory, ready to upload</p>}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"></input>
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xl block">Upload the cover</label>
            <div className="py-8 px-12 text-center border-2 border-dashed border-black bg-gray-400  rounded-sm max-w-[300px]"
              onDrop={handleCoverDrop}
              onDragOver={handleDragOver}
            >Drag the file or choose from local
              {/*cover && <p>📄 File: {cover.name} ({(cover.size / 1024 / 1024).toFixed(2)} MB)</p>*/}
              {uploadFormData.IMG && <p>📄 File: {uploadFormData.IMG.name} ({(uploadFormData.IMG.size / 1024 / 1024).toFixed(2)} MB)</p>}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  coverInputRef.current?.click()}
                className=" bg-black text-white text-center py-1 px-2 rounded-sm text-sm cursor-pointer"
              >Choose image</button>
              {coverStatus === "ready" && <p style={{ color: "blue" }}>✅ IMG saved in memory, ready to upload</p>}
            </div>
            <input
              type="file"
              ref={coverInputRef}
              className="hidden"></input>
          </div>
        </div>
      </form >

      <button type="submit" form="uploadForm" className="bg-black text-white flex items-center justify-between text-center py-1 px-4 rounded-sm text-xl cursor-pointer mt-12"><MdFileUpload className="mr-1.5 h-5 w-5" />Upload</button>
    </div >

  )

}
export default Upload