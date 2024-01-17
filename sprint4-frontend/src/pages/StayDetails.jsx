import React, { useState } from "react"
import { useEffect, useRef } from "react"
import { useNavigate, useParams, NavLink } from "react-router-dom"
import { StickyCard } from "../cmps/StickyCardDets"
import { useDispatch, useSelector } from "react-redux"
import { DetailsSubHeader } from "../cmps/DetailsSubHeader"

import { showErrorMsg } from "../services/event-bus.service"
import { stayService } from "../services/stay.service"
import { GalleryApt } from "../cmps/GalleryApt"
import { StayAmenities } from "../cmps/StayAmenities"
import { StayReviews } from "../cmps/StayReviews"
import SimpleMap from "../cmps/GoogleMap"

export function StayDetails() {
  const galleryRef = useRef(false)

  const [stay, setStay] = useState(null)
  const [isOpenHeader, setIsOpenHeader] = useState(false)
  const [isOpenReserve, setIsReserve] = useState(false)
  useEffect(() => {
    // Callback function to be executed when the target element enters or exits the viewport
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // console.log("Target element is in the viewport")
          onToggleHeadr(false)
        } else {
          // console.log("Target element is out of the viewport")
          onToggleHeadr(true)
        }
      })
    }

    const options = {
      // root: null, // Use the viewport as the root
      rootMargin: "0px",
      threshold: 0, // Trigger the callback when 50% of the target is visible
    }
    const observer = new IntersectionObserver(handleIntersection, options)

    if (galleryRef.current) {
      observer.observe(galleryRef.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [onToggleHeadr])
  console.log(stay);
  const { stayId } = useParams()
  const navigate = useNavigate()
  const user = useSelector((storeState) => storeState.userModule.user)
  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1000px")
    loadStay()
  }, [])

  function onToggleHeadr(isOpen) {
    setIsOpenHeader(isOpen)
  }
  function onToggleReserve(Reserve) {
    setIsReserve(Reserve)
  }

  //  function loadStay() {
  //   stayService
  //     .getById(stayId)
  //     .then(setStay)
  //     .catch((err) => {
  //       showErrorMsg("Cant load stay")
  //       navigate("/stay")
  //     })
  // }
  // /stay?location=${filterBy.selectedDestination}&checkIn=${filterBy.selectedDates.checkIn}&checkOut=${filterBy.selectedDates.checkOut}&selectedGuests=${totalGuests}
  // console.log(user)
  async function loadStay() {
    try {
      const currStay = await stayService.getById(stayId)
      // console.log(currStay)
      setStay(currStay)
    } catch (err) {
      showErrorMsg("Cant load stay")
      navigate("/stay")
    }
  }

  async function onAddReview() {
    try {
      const review = prompt("Enter your review")
      const toAddReview = await stayService.addStayReview(stayId, review)
      loadStay()
    } catch (err) {
      showErrorMsg("Cant add review")
      navigate(`/details/${stayId}`)
    }
  }

  if (!stay) {
    // console.log("no stays")
    return (
      <div>
        <div className="loader">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            ></span>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className="stay-details-container">
      <div className="title" id="galleryDetails">
        <h2>{stay.name}</h2>
      </div>
      <div ref={galleryRef} >
        <GalleryApt imgUrls={stay.imgUrls} />
      </div>
      {isOpenHeader && (
        <DetailsSubHeader
          stay={stay}
          isOpenReserve={isOpenReserve}
        />
      )}
      <section className="stay-dets-summary flex row">
        <div className="more-details ">
          <div className="stay-header">
            <h1 className="stay-dets-loc fs22">
              {stay.type} in {stay.loc.city} ,{stay.loc.country}
            </h1>
            <div className="capacity fs16">
              {stay.capacity} guests <span className="fs14">•</span>{" "}
              {stay.bedrooms ? stay.bedrooms : stay.rooms} rooms <span className="fs14">•</span> {stay.beds ? stay.beds : stay.capacity}{" "}
              beds <span className="fs14">•</span> {stay.bathrooms} bath
            </div>
            <div className="stay-dets-rating ">
              <span className="fs14 fw600">
                <i className="fa-solid fa-star"></i>
                {stay.rate ? <span>{stay.rate}</span>
                  :
                  <span> New</span>
                }
                <span className="fs14 dotP">
                  •
                  <span className="bold pointer underline">
                    {" "}
                    {stay.reviews.length} reviews
                  </span>
                </span>
              </span>
            </div>
          </div>
          <div className="apt-host-details divider flex align-center  padding24">
            <img src={
              stay.host.thumbnailUrl
                ? `${stay.host.thumbnailUrl}`
                : "https://res.cloudinary.com/dlscarx4f/image/upload/v1705511200/%D7%A6%D7%99%D7%9C%D7%95%D7%9D_%D7%9E%D7%A1%D7%9A_2024-01-17_190611_bana3a.png"
            } className="host-avatar-img" />
            <div className="apt-host-info ">
              <div className="host-name fs16 fw600">
                Hosted by {stay.host.fullname}{" "}
              </div>
              <div className="host-exp fs14 graytxt">
                Superhost <span className="fs14">•</span>{" "}
                {stay.host.hostingYears} years hosting
              </div>
            </div>
            {/* <div>
              <h2 className="summary">{stay.summary}</h2>
            </div> */}
          </div>
          <div className="apt-dets-highlights padding24">
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i className="fa-solid fa-map-location"></i>
              </div>
              <div className="apt-dets-light-info fs14">
                <div className="bold fs16">Great location</div>
                <div className="graytxt">
                  100% of recent guests gave the location a 5-star rating.
                </div>
              </div>
            </div>
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i className="fa-solid fa-building-circle-check"></i>
              </div>
              <div className="apt-dets-light-info">
                <div className="bold fs16">Great check-in experiance</div>
                <div className="fs14 graytxt">
                  100% of recent guests gave the check-in process a 5-star
                  rating.
                </div>
              </div>
            </div>
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i className="fa-regular fa-calendar-xmark"></i>
              </div>
              <div className="apt-dets-light-info">
                <div className="bold fs16">Free cancellation</div>
                <div className="fs14 graytxt">
                  Free cancellation 7 days before the date.
                </div>
              </div>
            </div>
          </div>

          <div className="apt-extra-dets padding24">
            <img
              className="aircover"
              src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"
              alt="aircover"
            ></img>
            <div className="padding24 fs16">
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
            <div className="stay-owner-revirew divider padding24 fs16">
              {stay.summary}
            </div>
          </div>
          <div className="amenities-cmp padding24 " id="amenitiesDetails">
            <StayAmenities amenities={stay.amenities} />
          </div>
        </div>
        <div className="sticky-card">
          <StickyCard stay={stay} onToggleReserve={onToggleReserve} />
        </div>
      </section>
      <section className="apt-reviews-rating divider padding24">
        <div className="stay-dets-rating ">
          <span className="fs26 fw600">
            <i className="fa-solid fa-star"></i>
            {stay.rate ? <span>{stay.rate}</span>
              :
              <span> {stay.reviews.length} Reviews</span>
            }
          </span>
          <span className="fs14 dotP"> • </span>
          <a href="#" className="stay-dets-rating-link fs26">
            {stay.reviews.length}{" "}
            {stay.reviews.length !== 0 ? "Reviews" : "Review"}
          </a>
        </div>
        <div className="apt-rating-dets-con">
          <div className="apt-rating-dets">
            <div className="title-rating-det">Cleanliness</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 4.5 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-solid fa-spray-can-sparkles  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Accuracy</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 4.15 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-regular fa-circle-check  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Check-in</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 4 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-solid fa-key fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Communication</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 3.75 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-regular fa-message fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Location</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 4.2 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-solid fa-map-location  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Value</div>
            {stay.reviews.length !== 0 && (
              <div className="rating-det">{stay.reviews.length % 5 < 3 ? 4.5 : 5}</div>
            )}
            {stay.reviews.length === 0 && <div className="rating-det">0</div>}
            <i className="fa-solid fa-coins  fs20"></i>
          </div>
        </div>
      </section>
      <div className="reviews-cmp divider padding24" id="reviewsDetails">
        {stay._id && (
          <button className="btn-add-review" onClick={onAddReview}>
            Add Review
          </button>
        )}
        {stay.reviews.length !== 0 && (
          <StayReviews reviews={stay.reviews} stars={stay.reviews[0].rate} />
        )}
        {stay.reviews.length === 0 && (
          <div className="review-none-container flex column">
            <div className="review-none-title fs22 fw600">No reviews (yet)</div>
            <div className="flex align-center">
              <i className="fa-regular fa-star"></i>
              <div className="fs18 review-none-content">
                This host has 0 review
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="apt-loc-map padding24" id="mapDetails">
        <div className="apt-loc-map-title fs22 fw600">Where you’ll be</div>
        <div className="apt-loc-map-sub-title fs16">
          {stay.name} ,{stay.loc.city} ,{stay.loc.country}
        </div>
        <SimpleMap lat={stay.loc.lat} lng={stay.loc.lng} marker={stay.name} />
      </div>
      <section className="host-apt-det-ext divider padding24">
        <div className="host-info-ext">
          <div className="host-profile-ext flex">
            <img
              src={
                stay.host.thumbnailUrl
                  ? `${stay.host.thumbnailUrl}`
                  : "https://res.cloudinary.com/dlscarx4f/image/upload/v1705511200/%D7%A6%D7%99%D7%9C%D7%95%D7%9D_%D7%9E%D7%A1%D7%9A_2024-01-17_190611_bana3a.png"
              }
              className="host-avatar-img"
            />
            <div className="host-avatar-dets">
              <div className="host-name-ext fs22 fw600">
                {stay.host.fullname}
              </div>
              <div className="host-date-ext fs14">
                {stay.host.location
                  ? `${stay.host.location}`
                  : "Joined in February 2015"}
              </div>
            </div>
          </div>
          <div className="host-icon-ext fs16">
            <div>
              <i className="fa-solid fa-envelope"></i>
              <span> {stay.reviews.length} Reviews</span>
            </div>
            <div>
              <i className="fa-solid fa-user-shield"></i>
              <span> Identity verified</span>
            </div>
            {stay.host.isSuperhost && (
              <div>
                <i className="fa-solid fa-medal"></i>
                <span> Superhost</span>
              </div>
            )}
          </div>
          <div className="host-summary-ext fs16">
            {stay.about ? (
              <p>{stay.about}</p>
            ) : (
              <section>
                <p>
                  Situated in Feteiras, 16 km from Ponta Delgada, Moinho das
                  Feteiras features a garden and free WiFi.
                </p>
                <p>
                  All air-conditioned units come with a patio, a dining area and
                  a seating area with a cable flat-screen TV.Each unit includes
                  an en-suite bathroom with a shower, a hairdryer and free
                  toiletries.
                </p>
                <p>
                  There are barbecue facilities and a terrace at this
                  property.Guests can go hiking and cycling nearby.
                </p>
              </section>
            )}
            {stay.host.isSuperhost && (
              <>
                <div className="fw600">{stay.host.fullname} is a Superhost</div>
                <p>
                  Superhosts are experienced, highly rated hosts who are
                  committed to providing great stays for guests.
                </p>
              </>
            )}
          </div>
        </div>
        <div className="host-ctn-con">
          <div className="host-ctn-content fs16">
            <p>Registration number: Exempt</p>
            <p>Languages: English, Português</p>
            <p>Response rate: 100%</p>
            <p>
              Response time:
              {stay.host.responseTime
                ? `${stay.host.responseTime}`
                : "within an hour"}
            </p>
          </div>
          <button className="btn-host-ctn">Contact Host</button>
          <div className="protect-host fs12 flex">
            <div className="protect-host-icon fs30">
              <i className="fa-solid fa-shield-virus"></i>
            </div>
            <p>
              To protect your payment, never transfer money or communicate
              outside of the Airbnb website or app.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
