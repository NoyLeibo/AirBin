export function StayAmenities({ amenities }) {
  return (
    <section className="amenities-container">
      <h4>What this place offers</h4>
      <ul className="amenities-ul flex">
        {amenities.map((amenitie) => {
          return (
            <li className="amenities-li flex row">
              <div>🎨</div>
              <span className="">{amenitie}</span>
            </li>
          );
        })}
      </ul>
      <button className="amenities-btn">
        Show all {amenities.length} amenities
      </button>
    </section>
  );
}
