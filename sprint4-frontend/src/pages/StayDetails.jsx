import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { StickyCard } from "../cmps/StickyCardDets";

import { showErrorMsg } from "../services/event-bus.service";
import { stayService } from "../services/stay.service.local";
import { GalleryApt } from "../cmps/GalleryApt";
import { StayAmenities } from "../cmps/StayAmenities";
import { StayReviews } from "../cmps/StayReviews";

export function StayDetails() {
  const [stay, setStay] = useState(null);

  const { stayId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadStay();
  });

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
      const currStay = await stayService.getById(stayId);
      setStay(currStay);
    } catch (err) {
      showErrorMsg("Cant load stay");
      navigate("/stay");
    }
  }

  if (!stay) return <div>Loading...</div>;
  return (
    <div className="stay-details-container flex column">
      <div className="title">
        <h2>{stay.name}</h2>
        <h4>
          ⭐ {stay.reviews[0].rate}.87 • {stay.loc.city} • {stay.loc.country}
        </h4>
      </div>
      <GalleryApt imgUrls={stay.imgUrls} />

      <div className="stay-dets-summary flex row">
        <div className="more-details">
          <div className="apt-host-details divider flex justify-between padding32">
            <div>
              <h2 className="summary">{stay.summary}</h2>
              <h4 className="capacity">
                {stay.capacity} guests • 2 rooms • 2 beds • 1 bath
              </h4>
            </div>
            <img
              src="https://res.cloudinary.com/dgzyxjapv/image/upload/v1670246635/stayby/avatars/female/48.jpg"
              className="host-avatar-img"
            ></img>
          </div>
          <div className="apt-dets-highlights padding32">
            <h3>Great location</h3>
            <div className="padding1">
              100% of recent guests gave the location a 5-star rating.
            </div>
            <h3>Great check-in experiance</h3>
            <div className="padding1">
              100% of recent guests gave the check-in process a 5-star rating.
            </div>
            <h3>Free cancellation before Jan 8</h3>
          </div>
          <div className="apt-extra-dets padding32">
            <img
              className="aircover"
              src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"
              alt="aircover"
            ></img>
            <div className="padding32">
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
            <div className="stay-owner-revirew divider padding32">
              Moshe\'s house, stays under 7 night $38/res - Inquire about
              availability, I review then offer/approve if available :) - READ
              "The Space" for cleaning/etc AND brief explanation about timeshare
              reservations - Want guaranteed view for additional cost? Must be
              weekly rental, other restrictions - Wheelchair accessible / ADA,
              call resort directly to ensure U receive. If U need ADA U MUST
              inform us BEFORE booking.
            </div>
          </div>
          <div className="amenities-cmp padding32">
            <StayAmenities amenities={stay.amenities} />
          </div>
          <div className="reviews-cmp padding32">
            <StayReviews reviews={stay.reviews} />
          </div>
        </div>
        <div className="sticky-card">
          <StickyCard stay={stay} />
        </div>
      </div>
    </div>
  );
}
