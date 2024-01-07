export function GalleryApt({ imgUrls }) {
  return (
    <div className="imgs-grid">
      {imgUrls.map((imgUrl, index) => (
        <img src={imgUrl} className={`img img${index}`} key={index} />
      ))}
      {/* <img src={stay.imgUrls[0]} /> */}
    </div>
  );
}
