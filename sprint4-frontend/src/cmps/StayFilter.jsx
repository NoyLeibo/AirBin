import React, { useRef, useState, useEffect } from "react";
import { useSelector } from 'react-redux'

import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useEffectUpdate } from "../customHooks/useEffectUpdate";

import { Filter } from "./Filter";
import { utilService } from "../services/util.service";

export function StayFilter({ filterBy, onSetFilter }) {
  const [scrolledLeft, setScrolledLeft] = useState(false);
  const [scrolledRight, setScrolledRight] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const filterContainerRef = useRef(null);
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy });
  const filters = useSelector((storeState) => storeState.stayModule.filters)
  onSetFilter = useRef(utilService.debounce(onSetFilter));

  const selectedEmojis = filterBy.placeType

  useEffectUpdate(() => {
    onSetFilter.current(filterByToEdit);
  }, [filterByToEdit]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsScrolledDown(true);
      }
      if (window.scrollY > 0) {
        setIsScrolledDown(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const updateScrollState = () => {
      const container = filterContainerRef.current;
      setScrolledLeft(container.scrollLeft > 0);
      setScrolledRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 1
      );
    };

    const container = filterContainerRef.current;
    container.addEventListener("scroll", updateScrollState);
    updateScrollState(); // Initialize the scroll state

    return () => {
      container.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  const handlePreviousScroll = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollLeft -= 110;
    }
  };

  const handleNextScroll = () => {
    if (filterContainerRef.current) {
      filterContainerRef.current.scrollLeft += 110;
    }
  };
  const handleEmojiSelect = (ev, key) => {
    ev.preventDefault();
    setSelectedEmoji(key);
    addPropertyType(key);
  };

  function addPropertyType(propertyType) {
    console.log(propertyType);
    setFilterByToEdit((prevFilter) => {
      const { placeType } = prevFilter;
      const updatedPlaceType = placeType.includes(propertyType)
        ? placeType.filter((currType) => currType !== propertyType)
        : [...placeType, propertyType];

      return { ...prevFilter, placeType: updatedPlaceType };
    });
  }

  return (
    <div
      className={
        !isScrolledDown
          ? "filters-layout divider filter-sticy"
          : "filters-layout divider"
      }
    >
      {scrolledLeft && (
        <div className="flex justify-center align-center">
          <NavigateBeforeIcon
            className="previous-filters"
            onClick={handlePreviousScroll}
          />
        </div>
      )}
      <div ref={filterContainerRef} className="emojis-filters ">
        {Object.entries(filters[0]).map(([key, value], filterIndex) => (
          <label
            key={key + filterIndex}
            className={`emoji-container ${selectedEmojis.includes(key) ? "selectedEmoji" : ""}`}
            onClick={(ev) => handleEmojiSelect(ev, key)}
          >
            <img
              className={`emoji-filter ${selectedEmojis.includes(key) ? "selectedEmoji" : ""}`}
              src={value}
              alt={key}
              width="24"
              height="24"
            />
            <div class="color-overlay"></div>
            <div className="emoji-text">{key}</div>
          </label>
        ))}
      </div>

      {scrolledRight && (
        <div className="flex justify-center align-center">
          <NavigateNextIcon
            className="next-filters"
            onClick={handleNextScroll}
          />
        </div>
      )}

      <button
        className="clean-btn flex justify-center align-center"
        onClick={() => setIsOpenFilter((currState) => !currState)}
      >
        Filters
      </button>
      <div className="filter-modal">
        {isOpenFilter && (
          <Filter
            onSetFilter={onSetFilter}
            setFilterByToEdit={setFilterByToEdit}
            filterByToEdit={filterByToEdit}
          />
        )}
      </div>
    </div>
  );
  // return (
  //     <div className='filters-layout flex row'>
  //         {scrolledLeft && (
  //             <button className="previous-filters" onClick={handlePreviousScroll}>Previous</button>
  //         )}

  //         <div className='filters-layout flex row'>
  //             <div ref={filterContainerRef} className="emojis-filters">
  //                 {Object.entries(filters[0]).map(([key, value], filterIndex) => (
  //                     <label key={key + filterIndex}
  //                         className={`emoji-container ${selectedEmoji === key ? 'selectedEmoji' : ''}`}
  //                         onClick={() => handleEmojiSelect(key)}>
  //                         <img className="emoji-filter" src={value} alt={key} width="24" height="24" />
  //                         <div className="emoji-text">{key}</div>
  //                     </label>
  //                 ))}
  //             </div>
  //         </div>

  //         {scrolledRight && (
  //             <button className="next-filters" onClick={handleNextScroll}>Next</button>
  //         )}
  //     </div>
  // );
}
