import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { StickyCard } from "../cmps/StickyCardDets";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { showErrorMsg } from "../services/event-bus.service";
import { stayService } from "../services/stay.service";
import { GalleryApt } from "../cmps/GalleryApt";
import { StayAmenities } from "../cmps/StayAmenities";
import { StayReviews } from "../cmps/StayReviews";
import SimpleMap from "../cmps/GoogleMap";

export function StayDetails() {
  const [stay, setStay] = useState(null);

  const { stayId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1000px");
    loadStay();
  }, []);

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


  async function loadStay() {
    try {
      const currStay = await stayService.getById(stayId);
      setStay(currStay);
    } catch (err) {
      showErrorMsg("Cant load stay");
      navigate("/stay");
    }
  }

  async function onAddReview() {
    try {
      const review = prompt("Enter your review");
      const toAddReview = await stayService.addStayReview(stayId, review);
      loadStay();
    } catch (err) {
      showErrorMsg("Cant add review");
      navigate(`/details/${stayId}`);
    }
  }

  if (!stay) {
    console.log("no stays");
    return (
      <div className="stay-details-container">
        <div className="loader">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            ></span>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="stay-details-container">
      <div className="title">
        <h2>{stay.name}</h2>
      </div>
      <GalleryApt imgUrls={stay.imgUrls} />

      <section className="stay-dets-summary flex row">
        <div className="more-details ">
          <div className="stay-header">
            <h1 className="stay-dets-loc fs22">
              {stay.type} in {stay.loc.city} ,{stay.loc.country}
            </h1>
            <div className="capacity fs16">
              {stay.capacity} guests <span className="fs14">•</span>{" "}
              {stay.bedrooms} rooms <span className="fs14">•</span> {stay.beds}{" "}
              beds <span className="fs14">•</span> {stay.bedrooms} bath
            </div>
            <div className="stay-dets-rating ">
              <span className="fs14 fw600">
                <i className="fa-solid fa-star"></i>
                {stay.reviews.length!==0&&<span className="avgRate">{stay.reviews[0].rate}.67 </span>}
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
            <img src={stay.host.pictureUrl} className="host-avatar-img" />
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
              {stay.host.ownerReview}
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
            {stay.reviews.length!==0&&<span className="avgRate">{stay.reviews[0].rate}.67</span>}
            {stay.reviews.length===0&&<span className="avgRate">New</span>}
          </span>
          <span className="fs14 dotP"> • </span>
          <a href="#" className="stay-dets-rating-link fs26">
            {stay.reviews.length} {stay.reviews.length!==0?"Reviews":"Review"}
          </a>
        </div>
        <div className="apt-rating-dets-con">
          <div className="apt-rating-dets">
            <div className="title-rating-det">Cleanliness</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-solid fa-spray-can-sparkles  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Accuracy</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-regular fa-circle-check  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Check-in</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-solid fa-key fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Communication</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-regular fa-message fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Location</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-solid fa-map-location  fs20"></i>
          </div>
          <div className="apt-rating-dets">
            <div className="title-rating-det">Value</div>
            {stay.reviews.length!==0&&<div className="rating-det">{stay.reviews[0].rate}.0</div>}
            {stay.reviews.length===0&&<div className="rating-det">0</div>}
            <i className="fa-solid fa-coins  fs20"></i>
          </div>
        </div>
      </section>
      <div className="reviews-cmp divider padding24">
        {stay.reviews.length!==0&&<StayReviews reviews={stay.reviews} stars={stay.reviews[0].rate} />}
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
              <i className="fa-solid fa-envelope"></i>
              <span> {stay.reviews.length} Reviews</span>
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
            <p>
              {" "}
              Situated in Feteiras, 16 km from Ponta Delgada, Moinho das
              Feteiras features a garden and free WiFi.
            </p>
            <p>
              All air-conditioned units come with a patio, a dining area and a
              seating area with a cable flat-screen TV.Each unit includes an
              en-suite bathroom with a shower, a hairdryer and free toiletries.
            </p>
            <p>
              There are barbecue facilities and a terrace at this
              property.Guests can go hiking and cycling nearby.
            </p>
            <div className="fw600">{stay.host.fullname} is a Superhost</div>
            <p>
              Superhosts are experienced, highly rated hosts who are committed
              to providing great stays for guests.
            </p>
          </div>
        </div>
        <div className="host-ctn-con">
          <div className="host-ctn-content fs16">
            <p>Registration number: Exempt</p>
            <p>Languages: English, Português</p>
            <p>Response rate: 100%</p>
            <p>Response time: within an hour</p>
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
        <button onClick={onAddReview}>Add Review</button>
      </section>
    </div>
  );
}
