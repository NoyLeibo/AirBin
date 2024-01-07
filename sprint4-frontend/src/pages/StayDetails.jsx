import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { StickyCard } from "../cmps/StickyCardDets";

import { showErrorMsg } from "../services/event-bus.service";
import { stayService } from "../services/stay.service.local";

export function StayDetails() {
  const [stay, setStay] = useState(null);

  const { stayId } = useParams();
  const navigate = useNavigate();
  var x = 1;

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
    <section className="stay-details-container flex column align-center">
      <div className="stay-dets">
        <h2>{stay.name}</h2>
        <h4>
          {stay.reviews[0].rate},{stay.loc.city},{stay.loc.country}
        </h4>
        <div className="imgs-grid">
          {stay.imgUrls.map((imgUrl) => (
            <img src={imgUrl} className={"img img" + x} key={x++} />
          ))}
          {/* <img src={stay.imgUrls[0]} /> */}
        </div>
        <div className="stay-dets-summary">
          <h2 className="summary">{stay.summary}</h2>
          <h4 className="capacity">
            {stay.capacity} guests, 2 rooms, 2 beds, 1 bath
          </h4>
          <span className="sticky-card"></span>
          <div className="stay-dets-highlights-first">
            <h3>Great location</h3>
            <div>100% of recent guests gave the location a 5-star rating.</div>
            <h3>Great check-in experiance</h3>
            <div>
              100% of recent guests gave the check-in process a 5-star rating.
            </div>
            <h3 className="divider">Free cancellation before Jan 8</h3>
            <img
              className="aircover"
              src="https://a0.muscache.com/im/pictures/54e427bb-9cb7-4a81-94cf-78f19156faad.jpg"
              alt="aircover"
            ></img>
            <div className="divider">
              Every booking includes free protection from Host cancellations,
              listing inaccuracies, and other issues like trouble checking in.
            </div>
            <div className="stay-owner-revirew">
              Moshe\'s house, stays under 7 night $38/res - Inquire about
              availability, I review then offer/approve if available :) - READ
              "The Space" for cleaning/etc AND brief explanation about timeshare
              reservations - Want guaranteed view for additional cost? Must be
              weekly rental, other restrictions - Wheelchair accessible / ADA,
              call resort directly to ensure U receive. If U need ADA U MUST
              inform us BEFORE booking.
            </div>
          </div>
          <StickyCard stay={stay} />
        </div>
      </div>
    </section>
  );
}
