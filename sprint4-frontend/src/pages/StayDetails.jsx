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
      <h2>{stay.name}</h2>
      <h4>
        {stay.reviews[0].rate},{stay.loc.city},{stay.loc.country}
      </h4>
      <div className="imgs-grid">
        {stay.imgUrls.map((imgUrl) => (
          <img src={imgUrl} className={"img" + x} key={x++} />
        ))}
        {/* <img src={stay.imgUrls[0]} /> */}
      </div>
      <div className="stay-dets-summary">
        <h2>{stay.summary}</h2>
        <h4>{stay.capacity} guests, 2 rooms, 2 beds, 1 bath</h4>
        <StickyCard />
      </div>
    </section>
  );
}
