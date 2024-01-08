import React, { useState } from "react";
import { setSelectedGuests } from "../store/stay.actions";
import { useSelector, useDispatch } from "react-redux";

export function Filter({ filterBy, onSetFilter }) {
  function handleChange({ target }) {
    let { value, name: field, type } = target;
    value = type === "number" ? +value : value;
    if (type === "select-multiple")
      value = Array.from(target.selectedOptions, (option) => option.value);
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  return (
    <section className="stay-index-filter">
      <div className="by-type-place">
        <h2>Type of place</h2>
        <div>Search rooms, entire homes, or any type of place.</div>
        <button className="clean-btn">Any type</button>
        <button className="clean-btn">Room</button>
        <button className="clean-btn">Entire home</button>
      </div>
      <div className="by-price-range">
        <h2>Price range</h2>
        <div>Nightly prices including fees and taxes</div>
        <input type="range" name="price" id="price" />
      </div>
      <div className="by-rooms">
        <h2>Rooms and beds</h2>
        <div>Bedrooms</div>
        <button className="clean-btn">1</button>
        <button className="clean-btn">2</button>
        <button className="clean-btn">3</button>
        <button className="clean-btn">4</button>
        <button className="clean-btn">5</button>
        <button className="clean-btn">6</button>
        <button className="clean-btn">7+</button>
      </div>
      <div className="by-beds">
        <div>Beds</div>
        <button className="clean-btn">1</button>
        <button className="clean-btn">2</button>
        <button className="clean-btn">3</button>
        <button className="clean-btn">4</button>
        <button className="clean-btn">5</button>
        <button className="clean-btn">6</button>
        <button className="clean-btn">7+</button>
      </div>
      <div className="by-bathrooms">
        <div>Bathrooms</div>
        <button className="clean-btn">1</button>
        <button className="clean-btn">2</button>
        <button className="clean-btn">3</button>
        <button className="clean-btn">4</button>
        <button className="clean-btn">5</button>
        <button className="clean-btn">6</button>
        <button className="clean-btn">7+</button>
      </div>
    </section>
  );
}
