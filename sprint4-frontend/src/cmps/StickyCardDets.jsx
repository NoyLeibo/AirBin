import { useNavigate } from "react-router";
import { Calendar } from "./Calendar.jsx";
import { Guests } from "./Guests.jsx";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export function StickyCard({ stay, onToggleReserve }) {
  const btnReserve = useRef(false);
  const navigate = useNavigate();
  const [isOpenDates, setIsOpenDates] = useState(false);
  const [isOpenGuests, setIsOpenGuests] = useState(false);
  const [gradientPosition, setGradientPosition] = useState('center');

  const selectedDates = useSelector(
    (storeState) => storeState.stayModule.filterBy.selectedDates
  );
  const selectedGuests = useSelector(
    (storeState) => storeState.stayModule.filterBy.selectedGuests
  );

  const days = numOfDays();
  const priceXdays = stay.price * days;
  const serviceFee = priceXdays / 10;
  const totalPrice = priceXdays + serviceFee;

  useEffect(() => {
    if (selectedDates.checkIn != null && selectedDates.checkOut != null) {
      setIsOpenDates(false);
    }
  }, [selectedDates]);

  function numOfDays() {
    if (selectedDates.checkIn != null && selectedDates.checkOut != null) {
      return (
        (selectedDates.checkOut - selectedDates.checkIn) / (24 * 60 * 60 * 1000)
      );
    }
    return 1;
  }

  function onReserveValidaton() {
    if (
      !selectedDates.checkIn ||
      !selectedDates.checkOut ||
      !selectedGuests.Adults
    ) {
      return false;
    }
    return true;
  }

  function onReserveNavigate() {
    if (onReserveValidaton() === false) {
      alert("Please enter trip dates or guests");
      return;
    } else {
      navigate(
        `/payment/${stay._id}?checkIn=${selectedDates.checkIn}&checkOut=${selectedDates.checkOut}&price=${priceXdays}&days=${days}&serviceFee=${serviceFee}&adults=${selectedGuests.Adults}&children=${selectedGuests.Children}&infants=${selectedGuests.Infants}&pets=${selectedGuests.Pets}`
      );
    }
  }
  useEffect(() => {
    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Target element is in the viewport")
          onToggleReserve(false)

        } else {
          console.log("Target element is out of the viewport")
          onToggleReserve(true)

        }
      })
    }

    const options = {
      rootMargin: "-80px",
      threshold: 0.2,
    }
    const observer = new IntersectionObserver(handleIntersection, options)

    if (btnReserve.current) {
      observer.observe(btnReserve.current)
    }
    return () => {
      observer.disconnect()
    }
  }, [])


  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setGradientPosition(`${x}px ${y}px`)
  }


  // const toggleCalendarModal = () => {
  //   setIsOpenGuests(false);
  //   setIsOpenDates(!isOpenDates);
  // };
  // const toggleGuestModal = () => {
  //   setIsOpenDates(false);
  //   setIsOpenGuests(!isOpenGuests);
  // };

  return (
    <section className="stay-details-sticky-card" id="detailsStickyCard">
      <h1 className="flex align-center">
        ₪{stay.price} <span>night</span>
      </h1>
      <div className="picker-container">
        <section className="stay-dates flex row">
          <button
            className="clean-btn"
            onClick={() => setIsOpenDates((currState) => !currState)}
          >
            <div className="flex">CHECK-IN</div>
            <div className="flex">
              {selectedDates.checkIn === null && <div>Add dates</div>}
              {selectedDates.checkIn && (
                <div>{selectedDates.checkIn.toLocaleDateString()}</div>
              )}
            </div>
          </button>
          <button
            className="check-out clean-btn"
            onClick={() => setIsOpenDates((currState) => !currState)}
          >
            <div className="flex">CHECK-OUT</div>
            <div className="flex">
              {selectedDates.checkOut === null && <div>Add dates</div>}
              {selectedDates.checkOut && (
                <div>{selectedDates.checkOut.toLocaleDateString()}</div>
              )}
            </div>
          </button>
          <div className="calendar-modal">{isOpenDates && <Calendar />}</div>
        </section>

        <section className="guest-picker flex">
          <button
            className="clean-btn"
            onClick={() => setIsOpenGuests((currState) => !currState)}
          >
            <div>Who</div>
            <div>Add guests</div>
          </button>
          <div className="guests-modal">{isOpenGuests && <Guests />}</div>
        </section>
      </div>
      <button
        style={{ backgroundImage: `radial-gradient(circle at ${gradientPosition}, #ff385c 0, #bd1e59 100%)` }}
        className="reserve-btn"
        onMouseMove={handleMouseMove}
        onClick={onReserveNavigate}
      >
        Reserve
      </button>
      <div className="flex justify-center fs14">You won't be charged yet</div>

      <div className="reservation-dets flex justify-between graytxt">
        <div className="fs16 blacktxt">
          {" "}
          ${stay.price} X {numOfDays()} nights
        </div>
        <span className="fs16 blacktxt">${stay.price * days}</span>
      </div>

      <div className="service-fee flex justify-between graytxt">
        <div className="fs16 blacktxt">Airbmb service fee</div>
        <span className="fs16 blacktxt">${serviceFee}</span>
      </div>

      <div className="total-reservation-count flex justify-between divider">
        <span className="fs16">Total</span>
        <span className="fs16">${totalPrice}</span>
      </div>
    </section>
  );
}
