
interface PdfReaderPros{
    fileName:string
}
const PdfReader=({fileName}:PdfReaderPros)=>{


return (
    <>
   <iframe
      src={fileName}
      className="w-full h-[600px]"
      title="PDF Viewer"
    ></iframe>
    </>
)
}
export default PdfReader