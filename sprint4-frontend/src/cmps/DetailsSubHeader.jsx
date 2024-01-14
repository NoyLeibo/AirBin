import React, { useEffect, useRef } from "react"

export function DetailsSubHeader({ stay ,isOpenReserve }) {
  const targetRef = useRef(null)

  useEffect(() => {
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Target element is in the viewport")
        } else {
          console.log("Target element is out of the viewport")
        }
      })
    }
    const options = {

      rootMargin: "0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver(handleIntersection, options)

    if (targetRef.current) {
      observer.observe(targetRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, []) 
  return (
    <div className="details-sub-header-container ">
      <div className="sub-header-container ">
        <div className="sub-header">
        <nav className="nav-details-container">
          <ul className="clean-list flex nav-details fs14 fw600">
            <li>
              <a href="#galleryDetails">Photos</a>
            </li>
            <li>
              <a href="#amenitiesDetails" >Amenities</a>
            </li>
            <li>
              <a href="#reviewsDetails" >Reviews</a>
            </li>
            <li>
              <a href="#mapDetails">Location</a>
            </li>
          </ul>
        </nav>
        {isOpenReserve&&<div className="header-reserve-container flex">
          <div className="header-reserve-content flex column">
            <div className="reserve-price fs14">
              <span className="fw600 fs16">${stay.price} </span> night
            </div>
            <div className="reserve-rating fs12">
              <span className="fw600">
                <i className="fa-solid fa-star"></i> 5.0{" "}
              </span>
              <span className="graytxt">• {stay.reviews.length} reviews</span>
            </div>
          </div>
          <div>
          <a href="#detailsStickyCard" className="btn-reserve-header">Reserve</a>
          </div>
        </div>}
      </div>
      </div>
    </div>
  )
}
