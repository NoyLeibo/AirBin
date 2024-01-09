import React, { useState, useRef } from "react";
import { setSelectedGuests } from "../store/stay.actions";
import { useSelector, useDispatch } from "react-redux";
import { useEffectUpdate } from "../customHooks/useEffectUpdate";
import { utilService } from "../services/util.service";
import { PriceRange } from "./PriceRange";

export function Filter({ onSetFilter, setFilterByToEdit, filterByToEdit }) {
  // const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
  const [selectedOption, setSelectedOption] = useState(false);
  // onSetFilter = useRef(utilService.debounce(onSetFilter));

  useEffectUpdate(() => {
    onSetFilter.current(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange(target, type = "number") {
    // ev.preventDefault()
    let { value, name: field } = target;
    value = type === "number" ? +value : value;
    if (type === "select-multiple")
      value = Array.from(target.selectedOptions, (option) => option.value);
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  function handlePriceRangeChange(priceRange) {
    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      priceRange: priceRange,
    }));
  }

  return (
    <section className="filter-modal-container">
      {/* <div className="by-type-place">
        <h2>Type of place</h2>
        <div>Search rooms, entire homes, or any type of place.</div>
        <button type="button" className="clean-btn type">
          Any type
        </button>
        <button type="button" className="clean-btn type">
          Room
        </button>
        <button type="button" className="clean-btn type">
          Entire home
        </button>
      </div> */}
      <div className="by-price-range">
        <h2>Price range</h2>
        <div>Nightly prices including fees and taxes</div>
        <div className="range">
          <PriceRange handlePriceRangeChange={handlePriceRangeChange} />
        </div>
      </div>
      <h2>Rooms and beds</h2>
      <div className="by-rooms">
        <div>Bedrooms</div>
        <button
          className="clean-btn"
          value={1}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(event, e.target, "number");
          }}
        >
          1
        </button>
        <button
          className="clean-btn"
          value={2}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          2
        </button>
        <button
          className="clean-btn"
          value={3}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          3
        </button>
        <button
          className="clean-btn"
          value={4}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          4
        </button>
        <button
          className="clean-btn"
          value={5}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          5
        </button>
        <button
          className="clean-btn"
          value={6}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          6
        </button>
        <button
          className="clean-btn"
          value={7}
          name="bedrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          7+
        </button>
      </div>
      <div className="by-beds">
        <div>Beds</div>
        <button
          className="clean-btn"
          value={1}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          1
        </button>
        <button
          className="clean-btn"
          value={2}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          2
        </button>
        <button
          className="clean-btn"
          value={3}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          3
        </button>
        <button
          className="clean-btn"
          value={4}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          4
        </button>
        <button
          className="clean-btn"
          value={5}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          5
        </button>
        <button
          className="clean-btn"
          value={6}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          6
        </button>
        <button
          className="clean-btn"
          value={7}
          name="beds"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          7+
        </button>
      </div>
      <div className="by-bathrooms">
        <div>Bathrooms</div>
        <button
          className="clean-btn"
          value={1}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          1
        </button>
        <button
          className="clean-btn"
          value={2}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          2
        </button>
        <button
          className="clean-btn"
          value={3}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          3
        </button>
        <button
          className="clean-btn"
          value={4}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          4
        </button>
        <button
          className="clean-btn"
          value={5}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          5
        </button>
        <button
          className="clean-btn"
          value={6}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          6
        </button>
        <button
          className="clean-btn"
          value={7}
          name="bathrooms"
          type="button"
          onClick={(e) => {
            handleChange(e.target, "number");
          }}
        >
          7+
        </button>
      </div>
      <footer className="filter-footer flex justify-between divider">
        <button className="clean-btn">Clear all</button>
        <button className="show-btn clean-btn">Show places</button>
      </footer>
    </section>
  );
}
