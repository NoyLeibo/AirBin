import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate, useParams, NavLink } from "react-router-dom"
import { StickyCard } from "../cmps/StickyCardDets"

import { showErrorMsg } from "../services/event-bus.service"
import { stayService } from "../services/stay.service.local"
import { GalleryApt } from "../cmps/GalleryApt"
import { StayAmenities } from "../cmps/StayAmenities"
import { StayReviews } from "../cmps/StayReviews"

export function StayDetails() {
  const [stay, setStay] = useState(null)

  const { stayId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadStay()
  })

  //  function loadStay() {
  //   stayService
  //     .getById(stayId)
  //     .then(setStay)
  //     .catch((err) => {
  //       showErrorMsg("Cant load stay")
  //       navigate("/stay")
  //     })
  // }

  async function loadStay() {
    try {
      const currStay = await stayService.getById(stayId)
      setStay(currStay)
    } catch (err) {
      showErrorMsg("Cant load stay")
      navigate("/stay")
    }
  }

  if (!stay) {
    console.log("no stays")
    return (
      <div className="main-stay-index">
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
    <div className="stay-details-container flex column">
      <div className="title">
        <h2>{stay.name}</h2>
      </div>
      <GalleryApt imgUrls={stay.imgUrls} />

      <section className="stay-dets-summary flex row ">
        <div className="more-details ">
          <div className="divider padding24">
            <h1 className="stay-dets-loc fs22">
              {stay.type} in {stay.loc.city} ,{stay.loc.country}
            </h1>
            <div className="capacity fs16">
              {stay.capacity} guests <span className="fs14">•</span> 2 rooms{" "}
              <span className="fs14">•</span> 2 beds{" "}
              <span className="fs14">•</span> 1 bath
            </div>
            <div className="stay-dets-rating ">
              <span className="fs17 fw600">
                <i class="fa-solid fa-star"></i>
                {stay.reviews[0].rate}.87{" "}
              </span>
              <span className="fs14">•</span>
              <a href="#" className="stay-dets-rating-link">
                {" "}
                49 reviews
              </a>
            </div>
          </div>
          <div className="apt-host-details divider flex align-center  padding24">
            <img
              src="https://res.cloudinary.com/dgzyxjapv/image/upload/v1670246635/stayby/avatars/female/48.jpg"
              className="host-avatar-img"
            />
            <div className="apt-host-info ">
              <div className="host-name fs16 fw600">
                Hosted by {stay.host.fullname}{" "}
              </div>
              <div className="host-exp fs14 graytxt">
                Superhost <span className="fs14">•</span> 7 years hosting
              </div>
            </div>
            {/* <div>
              <h2 className="summary">{stay.summary}</h2>
            </div> */}
          </div>
          <div className="apt-dets-highlights padding24">
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i class="fa-solid fa-map-location"></i>
              </div>
              <div className="apt-dets-light-info">
                <h3 className="fs16">Great location</h3>
                <div className="fs14 graytxt">
                  100% of recent guests gave the location a 5-star rating.
                </div>
              </div>
            </div>
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i class="fa-solid fa-building-circle-check"></i>
              </div>
              <div className="apt-dets-light-info">
                <h3 className="fs16">Great check-in experiance</h3>
                <div className="fs14 graytxt">
                  100% of recent guests gave the check-in process a 5-star
                  rating.
                </div>
                
              </div>
            </div>
            <div className="apt-dets-light-con">
              <div className="apt-dets-light-icon">
                <i class="fa-solid fa-medal"></i>
              </div>
              <div className="apt-dets-light-info">
                <h3 className="fs16">Free cancellation</h3>
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
            <div className="padding24">
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
            <div className="stay-owner-revirew divider padding24">
              Davit  house, stays under 7 night $38/res - Inquire about
              availability, I review then offer/approve if available :) - READ
              "The Space" for cleaning/etc AND brief explanation about timeshare
              reservations - Want guaranteed view for additional cost? Must be
              weekly rental, other restrictions - Wheelchair accessible / ADA,
              call resort directly to ensure U receive. If U need ADA U MUST
              inform us BEFORE booking.
            </div>
          </div>
          <div className="amenities-cmp padding24">
            <StayAmenities amenities={stay.amenities} />
          </div>
          <div className="reviews-cmp padding24">
            <StayReviews reviews={stay.reviews} />
          </div>
        </div>
        <div className="sticky-card">
          <StickyCard stay={stay} />
        </div>
      </section>
    </div>
  )
}
