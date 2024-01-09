import { useSelector } from "react-redux";

export function StayAmenities({ amenities }) {
  // Assuming filters is an array with a single object containing all amenities
  const filters = useSelector((storeState) => storeState.stayModule.filters[0]);

  return (
    <section className="amenities-container padding32">
      <h4>What this place offers</h4>
      <ul className="amenities-ul flex">
        {amenities.map((amenitie, index) => {
          return (
            <li className="amenities-li flex row" key={index}>
              <div><img className="emoji-filter" src={filters[amenitie]} alt={amenitie} /></div>
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
