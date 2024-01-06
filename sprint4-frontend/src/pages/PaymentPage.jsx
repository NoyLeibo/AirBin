import { StickyCard } from "../cmps/StickyCardDets";
import { useNavigate, useParams } from "react-router";
import { stayService } from "../services/stay.service.local";
import { useState, useEffect } from "react";

export function PaymentPage() {
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const { stayId } = useParams();

  useEffect(() => {
    loadStay();
  });

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
    <section className="payment-container">
      <div className="page-title flex space-between">
        <button onClick={() => navigate(`/`)} className=".clean-btn">
          back
        </button>
        <h2>Request to book</h2>
      </div>
      <div className="order-content flex justify-between">
        <div className="details-section">
          <div className="rare-find flex justify-between">
            <div>
              <h4>This is a rare find</h4>
              <h5>Cristina's place is usually booked.</h5>
            </div>
            <div>
              <section className="icon-svg">💎</section>
            </div>
          </div>
          <div className="trip-details">
            <h3>Your trip</h3>
            <div className="flex justify-between">
              <h4>Dates</h4>
              <h5>Jan 11 - Jan 12</h5>
            </div>
            <div className="flex justify-between">
              <h4>Guests</h4>
              <h5>1 Guest</h5>
            </div>
          </div>
        </div>
        <div className="summary-card-section flex">
          <img src={stay.imgUrls[0]} />
          <div className="stay-desc ">
            <h4>Entire home/apt</h4>
            <h4>Spacious and quiet duplex apartment in Poble Sec</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
