import { stayService } from "../services/stay.service.local";
export function StickyCard({ stay }) {
  return (
    <section className="stay-details-stickyCard flex column align-center">
      <h1>
        ${stay.price} <span>night</span>
      </h1>
      <div className="stay-dates">
        <header>
          <label htmlFor="checkIn">CHECK-IN</label>
          <input type="date" id="checkIn" name="checkIn" />
        </header>

        <div className="data-section">
          <label htmlFor="checkOut">CHECK-OUT</label>
          <input type="date" id="checkOut" name="checkOut" />
        </div>

        <section className="guest-count">
          <label htmlFor="guests">GUESTS</label>
          <select id="guests" name="guests">
            <option value="adults">Adults</option>
            <option value="children">Children</option>
            <option value="pets">Pets</option>
          </select>
        </section>

        <button>Reserve</button>

        <div>You won't be charged yet</div>

        <section className="total-reservation-count">
          <span>${stay.price} X 1 nights</span>
          <span>${stay.price}</span>
        </section>
      </div>
    </section>
  );
}
