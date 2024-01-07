import { useNavigate } from "react-router";
import { Calendar } from "./Calendar.jsx";
import { Guests } from "./Guests.jsx";
import { useState } from "react";

export function StickyCard({ stay }) {
  const navigate = useNavigate();
  const [isOpenDates, setIsOpenDates] = useState(false);
  const [isOpenGuests, setIsOpenGuests] = useState(false);

  const toggleCalendarModal = () => {
    setIsOpenGuests(false);
    setIsOpenDates(!isOpenDates);
  };
  const toggleGuestModal = () => {
    setIsOpenDates(false);
    setIsOpenGuests(!isOpenGuests);
  };
  return (
    <section className="stay-details-stickyCard">
      <h1>
        ${stay.price} <span>night</span>
      </h1>
      <div className="stay-dates flex column">
        <label htmlFor="checkIn">CHECK-IN</label>
        <div className="data-section">
          {/* <label htmlFor="checkOut">CHECK-OUT</label>
          <input type="date" id="checkOut" name="checkOut" /> */}
          <button onClick={() => setIsOpenDates(true)}> clickme</button>
          {isOpenDates && <Calendar />}
        </div>

        <section className="guest-count">
          <label htmlFor="guests">GUESTS</label>
          <select id="guests" name="guests">
            <option value="adults">Adults</option>
            <option value="children">Children</option>
            <option value="pets">Pets</option>
          </select>
        </section>
        <button onClick={() => navigate(`/payment/${stay._id}`)}>
          Reserve
        </button>
        <div>You won't be charged yet</div>
        <section className="total-reservation-count">
          <span>${stay.price} X 1 nights</span>
          <span>${stay.price}</span>
        </section>
      </div>
    </section>
  );
}
