import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate, useParams, NavLink } from "react-router-dom"
import { StickyCard } from "../cmps/StickyCardDets"


import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"


import { showErrorMsg } from "../services/event-bus.service"
import { stayService } from "../services/stay.service.local"
import { GalleryApt } from "../cmps/GalleryApt"
import { StayAmenities } from "../cmps/StayAmenities"
import { StayReviews } from "../cmps/StayReviews"
import SimpleMap from "../cmps/GoogleMap"

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
                <i className="fa-solid fa-star"></i>
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
                <i className="fa-solid fa-map-location"></i>
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
                <i className="fa-solid fa-building-circle-check"></i>
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
              <i class="fa-regular fa-calendar-xmark"></i>
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
              Davit house, stays under 7 night $38/res - Inquire about
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
          <div className="apt-calender">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar />
            </LocalizationProvider>
          </div>
        </div>
        <div className="sticky-card">
          <StickyCard stay={stay} />
        </div>
      </section>
      <section className="apt-reviews-rating divider padding24">
        <div className="stay-dets-rating ">
          <span className="fs26 fw600">
            <i className="fa-solid fa-star"></i>
            {stay.reviews[0].rate}.87
          </span>
          <span className="fs14"> • </span>
          <a href="#" className="stay-dets-rating-link fs26">
            49 reviews
          </a>
        </div>
        <div className="apt-rating-dets-con">
          <div className="apt-rating-dets">
            <div className="title-rating-det">Cleanliness</div>
            <div className="rating-det">4.9</div>
            <i className="fa-solid fa-spray-can-sparkles  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Accuracy</div>
            <div className="rating-det">4.9</div>
            <i className="fa-regular fa-circle-check  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Check-in</div>
            <div className="rating-det">5.0</div>
            <i className="fa-solid fa-key fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Communication</div>
            <div className="rating-det">5.0</div>
            <i className="fa-regular fa-message fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Location</div>
            <div className="rating-det">4.9</div>
            <i className="fa-solid fa-map-location  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Value</div>
            <div className="rating-det">4.8</div>
            <i className="fa-solid fa-coins  fs20"></i>
          </div>
        </div>
      </section>
      <div className="reviews-cmp divider padding24">
        <StayReviews reviews={stay.reviews} />
      </div>
      <div className="apt-loc-map padding24">
        <div className="apt-loc-map-title fs22 fw600">Where you’ll be</div>
        <div className="apt-loc-map-sub-title fs16">
          {stay.name} ,{stay.loc.city} ,{stay.loc.country}
        </div>
        <SimpleMap lan={stay.loc.lat} lng={stay.loc.lng} marker={stay.name} />
      </div>
      <section className="host-apt-det-ext divider padding24">
        <div className="host-info-ext">
          <div className="host-profile-ext flex">
            <img
              src="https://res.cloudinary.com/dgzyxjapv/image/upload/v1670246635/stayby/avatars/female/48.jpg"
              className="host-avatar-img"
            />
            <div className="host-avatar-dets">
              <div className="host-name-ext fs22 fw600">
                {stay.host.fullname}
              </div>
              <div className="host-date-ext fs14">Joined in February 2015</div>
            </div>
          </div>
          <div className="host-icon-ext fs16">
            <div>
              <i className="fa-solid fa-star"></i>
              <span> 49 Reviews</span>
            </div>
            <div>
            <i className="fa-solid fa-user-shield"></i>
              <span> Identity verified</span>
            </div>
            <div>
            <i className="fa-solid fa-medal"></i>
              <span> Superhost</span>
            </div>
          </div>
          <div className="host-summary-ext fs16">
            {/* {stay.summary} */}
            <p> Situated in Feteiras, 16 km from Ponta Delgada, Moinho das Feteiras features a garden and free WiFi.</p>
            <p>
            All air-conditioned units come with a patio, a dining area and a seating area with a cable flat-screen TV.Each unit includes an en-suite bathroom with a shower, a hairdryer and free toiletries.
            </p>
            <p>
            There are barbecue facilities and a terrace at this property.Guests can go hiking and cycling nearby.
            </p>
            <div className="fw600">{stay.host.fullname} is a Superhost</div>
            <p>
            Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.
            </p>
          </div>
        </div>
        <div className="host-ctn-con">
         <div className="host-ctn-content fs16">
          <p>
          Registration number: Exempt
          </p>
          <p>
          Languages: English, Português
          </p>
          <p>
          Response rate: 100%
          </p>
          <p>
          Response time: within an hour
          </p>
         </div>
         <button className="btn-host-ctn">Contact Host</button>
         <div className="protect-host fs12 flex">
          <div className="protect-host-icon fs30">
          <i class="fa-solid fa-shield-virus"></i>
          </div>
          <p>To protect your payment, never transfer money or communicate outside of the Airbnb website or app.</p>
         </div>
        </div>
      </section>
    </div>
  )
}
