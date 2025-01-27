import FileUploader from "@/components/shared/file-uploader"

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-8">Upload File to S3</h1>
      <FileUploader />
    </div>
  )
}

