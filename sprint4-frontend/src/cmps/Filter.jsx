import React, { useState, useRef } from "react";
import { setSelectedGuests } from "../store/stay.actions";
import { useSelector, useDispatch } from "react-redux";
import { useEffectUpdate } from "../customHooks/useEffectUpdate";
import { utilService } from "../services/util.service";
import { PriceRange } from "./PriceRange";

export function Filter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
  onSetFilter = useRef(utilService.debounce(onSetFilter));

  useEffectUpdate(() => {
    onSetFilter.current(filterByToEdit);
  }, [filterByToEdit]);

  function handleChange(target, type = "number") {
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
        <PriceRange handlePriceRangeChange={handlePriceRangeChange} />
      </div>
      <div className="by-rooms">
        <h2>Rooms and beds</h2>
        <div>Bedrooms</div>
        <button
          className="clean-btn"
          value={1}
          name="bedrooms"
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
    </section>
  );
}
