import React, { useState } from "react"
import { NavLink } from "react-router-dom"
import { userService } from "../services/user.service"
import { updateUser } from "../store/user.actions"

const Carousel=({ stay, isLiked })=>{
  const [activeIndex, setActiveIndex] = useState(0)
  const [favoriteStay, setFavorite] = useState(isLiked)
  const goToSlide = (index) => {
    setActiveIndex(index)
  }

  const goToPrevSlide = () => {
    const index = (activeIndex - 1 + stay.imgUrls.length) % stay.imgUrls.length
    goToSlide(index)
  }

  const goToNextSlide = () => {
    const index = (activeIndex + 1) % stay.imgUrls.length
    goToSlide(index)
  }

  async function toggleLike() {
    setFavorite(!favoriteStay)
    const user = await userService.updateWishlist(stay)
    await updateUser(user)
  }
  const renderIndicators = () => {
    const totalButtons = Math.min(5, stay.imgUrls.length)
    let firstIndex = 0

    if (stay.imgUrls.length > totalButtons) {
      if (activeIndex >= 2 && activeIndex <= stay.imgUrls.length - 3) {
        firstIndex = activeIndex - 2
      } else if (activeIndex > stay.imgUrls.length - 3) {
        firstIndex = stay.imgUrls.length - totalButtons
      }
    }

    return stay.imgUrls
      .slice(firstIndex, firstIndex + totalButtons)
      .map((_, index) => (
        <div
          key={firstIndex + index}
          onClick={() => goToSlide(firstIndex + index)}
          className={
            `carousel-indicators-nav ${firstIndex + index === activeIndex
              ? "active"
              : ""}`
          }
        />
      ))
  }
  const isLike = `heart-icon ${favoriteStay ? "favorite" : ""}`
  return (
    <div className="carousel">
      <div
        className="carousel-inner"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {stay.imgUrls.map((image, index) => (
          <div key={index} className="carousel-slide">
            <NavLink to={`/details/${stay._id}`}>
              <img src={image} alt={`Slide ${index + 1}`} />
            </NavLink>
          </div>
        ))}
      </div>

      <div className="carousel-indicators">{renderIndicators()}</div>
      {activeIndex !== 0 && (
        <button className="carousel-control-prev" onClick={goToPrevSlide}>
          <i className="fa-solid fa-angle-left"></i>
        </button>
      )}
      {activeIndex !== stay.imgUrls.length - 1 && (
        <button className="carousel-control-next" onClick={goToNextSlide}>
          <i className="fa-solid fa-angle-right"></i>
        </button>
      )}
      <button onClick={() => toggleLike(stay)} className="btn-like ">
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
      {stay.host.isSuperhost&& <NavLink to={`/details/${stay._id}`}><div className="super-host-tag">Guest favorite</div></NavLink>}
    </div>
  )
}
export default Carousel


