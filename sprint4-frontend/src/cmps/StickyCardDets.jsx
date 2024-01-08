import { useNavigate } from "react-router";
import { Calendar } from "./Calendar.jsx";
import { Guests } from "./Guests.jsx";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export function StickyCard({ stay }) {
  const navigate = useNavigate();
  const [isOpenDates, setIsOpenDates] = useState(false);
  const [isOpenGuests, setIsOpenGuests] = useState(false);
  const selectedDates = useSelector(
    (storeState) => storeState.stayModule.selectedDates
  );

  useEffect(() => {
    if (selectedDates.checkIn != null && selectedDates.checkOut != null)
      setIsOpenDates(false);
  }, [selectedDates]);

  // const toggleCalendarModal = () => {
  //   setIsOpenGuests(false);
  //   setIsOpenDates(!isOpenDates);
  // };
  // const toggleGuestModal = () => {
  //   setIsOpenDates(false);
  //   setIsOpenGuests(!isOpenGuests);
  // };

  return (
    <section className="stay-details-sticky-card">
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
        className="reserve-btn"
        onClick={() => navigate(`/payment/${stay._id}`)}
      >
        Reserve
      </button>
      <div className="flex justify-center fs14">You won't be charged yet</div>

      <div className="reservation-dets flex justify-between graytxt">
        <div className="fs16 blacktxt">${stay.price} X 1 nights</div>
        <span className="fs16 blacktxt">${stay.price}</span>
      </div>

      <div className="service-fee flex justify-between graytxt">
        <div className="fs16 blacktxt">${stay.price} X 1 nights</div>
        <span className="fs16 blacktxt">${stay.price}</span>
      </div>

      <div className="total-reservation-count flex justify-between divider">
        <span className="fs16">Total</span>
        <span className="fs16">${stay.price}</span>
      </div>
    </section>
  );
}
