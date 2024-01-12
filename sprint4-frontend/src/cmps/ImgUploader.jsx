import { useState } from 'react'
import { uploadService } from '../services/upload.service'
export function ImgUploader({ addImgStay,stay,onUploaded = null }) {
  const [imgData, setImgData] = useState({
    imgUrl: null,
    height: 500,
    width: 500,
  })
  const [isUploading, setIsUploading] = useState(false)

  async function uploadImg(ev) {
    setIsUploading(true)
    const { secure_url, height, width } = await uploadService.uploadImg(ev)
    setImgData({ imgUrl: secure_url, width, height })
    addImgStay(secure_url)
    setIsUploading(false)
    onUploaded && onUploaded(secure_url)
  }

  function getUploadLabel() {
    if (imgData.imgUrl) return 'Upload Another?'
    return isUploading ? 'Uploading....' : 'Upload Image'
  }
  console.log(imgData);
  return (
    <div className="upload-preview flex column">
      {/* {imgData.imgUrl && <img src={imgData.imgUrl} style={{ maxWidth: '200px', float: 'right' }} />} */}
      <section className="imgs-container ">
      {stay.imgUrls.map((url,idx) =>{
     return <img key={url} src={url} className={idx===0?'img1':'img'} />
    })}
      </section>
      <label htmlFor="imgUpload">{getUploadLabel()}</label>
      <input type="file" onChange={uploadImg} accept="img/*" id="imgUpload" />
    </div>
  )
}