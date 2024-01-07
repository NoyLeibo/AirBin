export function StayAmenities({ amenities }) {
  return (
    <section className="amenities-container padding32">
      <h4>What this place offers</h4>
      <ul className="amenities-ul flex">
        {amenities.map((amenitie, index) => {
          return (
            <li className="amenities-li flex row" key={index}>
              <div>🎨</div>
              <span>{amenitie}</span>
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
