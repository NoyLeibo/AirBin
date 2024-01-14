import React, { useState, useEffect } from 'react';

export function GalleryApt({ imgUrls }) {
  const [showScreenShadow, setShowScreenShadow] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (ev) => {
    ev.preventDefault();
    setModalOpen(true);
    setShowScreenShadow(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowScreenShadow(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <div className="imgs-grid">
      {imgUrls.slice(0, 5).map((imgUrl, index) => (
        <img src={imgUrl} alt={`Image ${index + 1}`} className={`img img${index + 1}`} key={index} />
      ))}
      {imgUrls.length > 5 && (
        <div className="view-all-container">
          <button className="all-details-imgs" onClick={openModal}>Show all photos</button>
        </div>
      )}

      {showScreenShadow && <div className="screen-shadow-login"></div>}
      {isModalOpen && (
        <div className="modal-imgs-container">
          <div className="modal-header">
            <button onClick={closeModal}><i class="fa-solid fa-x"></i></button>
          </div>
          <div className="imgs-list">
            {imgUrls.map((imgUrl, index) => (
              <div className="img-container" key={index}>
                <div className="img-index">{index + 1}</div>
                <img src={imgUrl} alt={`Image ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
