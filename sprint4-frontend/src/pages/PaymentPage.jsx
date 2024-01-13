import { StickyCard } from "../cmps/StickyCardDets";
import { useNavigate, useParams } from "react-router";
import { stayService } from "../services/stay.service";
import { useState, useEffect } from "react";
import { LoginSignup } from "../cmps/LoginSignup";
import { useLocation } from "react-router";
import { LoginModal } from "../cmps/Login";
import { userService } from "../services/user.service";
import { updateUser } from "../store/user.actions";
import { useSelector } from "react-redux";

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [stay, setStay] = useState(null);
  const { stayId } = useParams();
  const user = useSelector((storeState) => storeState.userModule.user);
  const queryParams = new URLSearchParams(location.search);
  const checkIn = convertDate(queryParams.get("checkIn"));
  const checkOut = convertDate(queryParams.get("checkOut"));
  const price = +queryParams.get("price");
  const days = +queryParams.get("days");
  const serviceFee = +queryParams.get("serviceFee");
  const adults = +queryParams.get("adults");
  const children = +queryParams.get("children");
  const infants = +queryParams.get("infants");
  const pets = +queryParams.get("pets");
  const guests = adults + children + infants + pets;
  const totalPrice = price + serviceFee;

  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1280px");
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
      alert(err);
      // showErrorMsg("Cant load stay");
      navigate("/");
    }
  }

  function createTrip() {
    const stayDetails = {
      stayId: stayId,
      stayImg: stay.imgUrls[0],
      stayName: stay.name,
    };
    const host = stay.host;
    const guest = {
      _id: user._id,
      username: user.username,
      imgUrl: user.imgUrl,
      fullname: user.fullname,
    };
    const newTrip = {
      stay: stayDetails,
      checkIn,
      checkOut,
      booked: convertDate(Date.now()),
      host,
      guest,
      totalPrice,
      status: "pending",
    };
    return newTrip;
  }

  async function onConfirm() {
    const newTrip = createTrip();
    console.log(newTrip);
    const updatedUser = await userService.updateTripList(newTrip);
    await updateUser(updatedUser);
    navigate("/userTrips");
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
                <span>{checkIn}</span> - <span>{checkOut}</span>
              </h5>
            </div>
            <div className="flex justify-between">
              <h4>Guests</h4>
              <h5>{guests} Guest</h5>
            </div>
          </div>
          <button className="reserve-btn" onClick={onConfirm}>
            Confirm
          </button>
          <div className="login-section">
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
            <h4>${totalPrice}</h4>
          </div>
        </div>
      </div>
    </section>
  );
}
