import React, { useState } from 'react'
import {  NavLink } from "react-router-dom"


const Carousel = ({stay}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [favoriteStay,setFavorite]=useState(false)
  const goToSlide = (index) => {
    setActiveIndex(index)
  };

  const goToPrevSlide = () => {
    const index = (activeIndex - 1 + stay.imgUrls.length) % stay.imgUrls.length
    goToSlide(index)
  };

  const goToNextSlide = () => {
    const index = (activeIndex + 1) % stay.imgUrls.length
    goToSlide(index)
  };

  function toggleLike() {
    setFavorite(!favoriteStay)
    console.log(isLike);
  };

  const renderIndicators = () => {
    const totalButtons = Math.min(5, stay.imgUrls.length)
    return [...Array(totalButtons)].map((_, index) => (
      <div
            key={index}
            onClick={() => goToSlide(index)}
            className={index === activeIndex ? 'carousel-indicators-nav active' : 'carousel-indicators-nav'}
          />
    ))
  }
  const isLike=favoriteStay?"heart-icon favorite":"heart-icon"
  console.log(activeIndex)
  return (
    <div className="carousel">
      <div className="carousel-inner" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
        {stay.imgUrls.map((image, index) => (
          <div key={index} className="carousel-slide">
            <NavLink  to={`/details/${stay._id}`}>
            <img src={image} alt={`Slide ${index + 1}`} />
            </NavLink>
          </div>
        ))}
      </div>
      
      <div className="carousel-indicators">
        {renderIndicators()}
      </div>
      {activeIndex!==0 &&<button className="carousel-control-prev" onClick={goToPrevSlide}>
      <i className="fa-solid fa-angle-left"></i>
      </button>}
      {activeIndex!==stay.imgUrls.length-1 &&<button className="carousel-control-next" onClick={goToNextSlide}>
      <i className="fa-solid fa-angle-right"></i>
      </button>}
      <button onClick={()=>toggleLike(stay)} className="btn-like ">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className={isLike}
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
          </svg>
        </button>
    </div>
  )
}

export default Carousel