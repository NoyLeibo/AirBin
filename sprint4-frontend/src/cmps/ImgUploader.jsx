import { useState } from "react"
import { uploadService } from "../services/upload.service"
import { IoMdClose } from "react-icons/io"
export function ImgUploader({ addImgStay,deleteImgStay , stay, onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  })
  const [isUploading, setIsUploading] = useState(false)
  const uploadImg = async (ev) => {
    setIsUploading(true)
    console.log(ev.target.files, "targen ev.target.files |")
    try {
      if (ev && ev.target) {
        const filesArray = Array.from(ev.target.files)
        console.log(filesArray, "targen filesArray |")
        if (filesArray && filesArray.length > 0) {
          const uploadedImages = await Promise.all(
            filesArray.map(async (file) => {
              try {
                const { secure_url, height, width } =
                  await uploadService.uploadImg(file)
                console.log(secure_url)
                addImgStay(secure_url)
                onUploaded && onUploaded(secure_url)
                return { secure_url, height, width }
              } catch (error) {
                console.error("Error uploading file:", error)
                return null
              }
            })
          )

          const filteredImages = uploadedImages.filter((img) => img !== null)
          setImgData(filteredImages)
        } else {
          console.error("No files found or files not selected:", filesArray)
        }
      } else {
        console.error("Event or its target is undefined:", ev)
      }
    } catch (error) {
      console.error("Error processing file upload:", error)
    }
    console.log(stay)
    setIsUploading(false)
  }

  function getUploadLabel() {
    return isUploading ? "Uploading...." : "Upload Image"
  }

  return (
    <div className="upload-preview flex column">
      <div className="img-uploader">
        <label htmlFor="imgUpload">{getUploadLabel()}</label>
        <input
          type="file"
          onChange={uploadImg}
          accept="image/*"
          id="imgUpload"
          multiple
        />
      </div>
      <section className="imgs-container">
        {stay.imgUrls.map((img, idx) => (
          <div key={idx} className={`${idx === 0 ? "img1 " : "img "} `}>
            <img
              
              src={stay.imgUrls[idx]}
              className={idx === 0 ? "img1" : "img"}
              alt={`Stay Image ${idx + 1}`}
            />
            <button className="btn-img-del" onClick={()=>deleteImgStay(idx)}>
            <IoMdClose size="18" />
            </button>
          </div>
        ))}

        {stay.imgUrls.length === 0 && (
          <div className="img-bg-cover img1">Upload Image 1</div>
        )}

        {stay.imgUrls.length < 2 && (
          <div className="img-bg-cover">Upload Image 2</div>
        )}

        {stay.imgUrls.length < 3 && (
          <div className="img-bg-cover">Upload Image 3</div>
        )}

        {stay.imgUrls.length < 4 && (
          <div className="img-bg-cover">Upload Image 4</div>
        )}

        {stay.imgUrls.length < 5 && (
          <div className="img-bg-cover">Upload Image 5</div>
        )}
      </section>
    </div>
  )
}