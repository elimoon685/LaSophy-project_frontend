import { apiUpload } from "@/lib/apiClient";

const UploadApi={
    adminUpload:(formData:FormData)=>
        apiUpload.post("Upload/upload", formData)
};
export default UploadApi