import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';

export function StayAmenities({ amenities }) {
  const filters = useSelector((storeState) => storeState.stayModule.filters[0]);
  const [showScreenShadow, setShowScreenShadow] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (ev) => {
    ev.preventDefault();
    setModalOpen(true);
    setShowScreenShadow(true);
    document.body.style.overflow = 'hidden'; // Stop scrolling
  };

  const closeModal = () => {
    setModalOpen(false);
    setShowScreenShadow(false);
    document.body.style.overflow = 'unset'; // Resume scrolling
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <section className="amenities-container padding32">
      <h4>What this place offers</h4>
      <div className="amenities-ul flex">
        {amenities.slice(0, 6).map((amenitie, index) => (
          <li className="amenities-li flex row" key={index}>
            <div><img className="emoji-filter" src={filters[amenitie]} alt={amenitie} /></div>
            <span>{amenitie}</span>
          </li>
        ))}
      </div>
      <button className="amenities-btn" onClick={openModal}>
        Show all {amenities.length} amenities
      </button>

      {showScreenShadow && <div className="screen-shadow-login"></div>}
      {isModalOpen &&
        <div className="amenitie-modal">
          <button onClick={closeModal}>Close</button>
          <div className="amenitie-items">
            {amenities.map((amenitie, index) => (
              <li className="amenities-li flex row" key={index}>
                <div><img className="emoji-filter" src={filters[amenitie]} alt={amenitie} /></div>
                <span>{amenitie}</span>
              </li>
            ))}
          </div>
        </div>
      }
    </section>
  );
}
