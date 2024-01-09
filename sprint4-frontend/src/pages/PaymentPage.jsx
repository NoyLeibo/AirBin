import { StickyCard } from "../cmps/StickyCardDets";
import { useNavigate, useParams } from "react-router";
import { stayService } from "../services/stay.service.local";
import { useState, useEffect } from "react";
import { LoginSignup } from "../cmps/LoginSignup";
import { useLocation } from "react-router";

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const { stayId } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const checkIn = queryParams.get("checkIn");
  const checkOut = queryParams.get("checkOut");
  const price = queryParams.get("price");
  const days = queryParams.get("days");
  const serviceFee = queryParams.get("serviceFee");
  const adults = queryParams.get("adults");
  const children = queryParams.get("children");
  const infants = queryParams.get("infants");
  const pets = queryParams.get("pets");
  const guests = +adults + +children + +infants + +pets;

  useEffect(() => {
    loadStay();
  }, []);

  function convertDate(timestamp) {
    const options = { month: "short", day: "numeric" };
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", options);
  }

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
      <div className="page-title flex">
        <button
          onClick={() => navigate(`/details/${stay._id}`)}
          className=".clean-btn"
        >
          back
        </button>
        <h2>Request to book</h2>
      </div>

      <div className="order-content flex">
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
              <h5>
                <span>{convertDate(checkIn)}</span> -{" "}
                <span>{convertDate(checkOut)}</span>
              </h5>
            </div>
            <div className="flex justify-between">
              <h4>Guests</h4>
              <h5>{guests} Guest</h5>
            </div>
          </div>
          <div className="login-section">
            <h3>Log in or sign up to book</h3>
            <LoginSignup />
          </div>
        </div>

        <div className="summary-card-section flex">
          <img src={stay.imgUrls[0]} />
          <div className="stay-desc">
            <h4>Entire home/apt</h4>
            <h4>Spacious and quiet duplex apartment in Poble Sec</h4>
          </div>
          <div className="price-dets">
            <h2>Price details</h2>
            <div className="flex justify-between">
              <h4>
                ${stay.price} X {days}
              </h4>
              <h4>${price}</h4>
            </div>
            <div className="flex justify-between">
              <h4>Service fee</h4>
              <h4>${serviceFee}</h4>
            </div>
          </div>

          <div className="flex justify-between">
            <h4>Total</h4>
            <h4>${+price + +serviceFee}</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
