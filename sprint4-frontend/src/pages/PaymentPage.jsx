import { StickyCard } from "../cmps/StickyCardDets";

export function PaymentPage() {
  return (
    <section className="payment-container">
      <div className="page-title flex space-between">
        <button className=".clean-btn">back</button>
        <h2>Request to book</h2>
      </div>
      <div className="order-content flex justify-content">
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
        <div className="summary-card-section"></div>
      </div>
    </section>
  );
}
