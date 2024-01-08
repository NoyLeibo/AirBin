import React, { useRef, useState, useEffect } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { Filter } from "./Filter";

export function StayFilter({ filterBy, onSetFilter }) {
  const [scrolledLeft, setScrolledLeft] = useState(false);
  const [scrolledRight, setScrolledRight] = useState(true);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);
  const filterContainerRef = useRef(null);

  const filters = [
    {
      Arctic:
        "https://a0.muscache.com/pictures/8b44f770-7156-4c7b-b4d3-d92549c8652f.jpg",
      "Iconic cities":
        "https://a0.muscache.com/pictures/ed8b9e47-609b-44c2-9768-33e6a22eccb2.jpg",
      Beachfront:
        "https://a0.muscache.com/pictures/bcd1adc0-5cee-4d7a-85ec-f6730b0f8d0c.jpg",
      Rooms:
        "https://a0.muscache.com/pictures/7630c83f-96a8-4232-9a10-0398661e2e6f.jpg",
      "Amazing pools":
        "https://a0.muscache.com/pictures/3fb523a0-b622-4368-8142-b5e03df7549b.jpg",
      Riads:
        "https://a0.muscache.com/pictures/7ff6e4a1-51b4-4671-bc9a-6f523f196c61.jpg",
      Luxe: "https://a0.muscache.com/pictures/c8e2ed05-c666-47b6-99fc-4cb6edcde6b4.jpg",
      "Grand pianos":
        "https://a0.muscache.com/pictures/8eccb972-4bd6-43c5-ac83-27822c0d3dcd.jpg",
      "Historial homes":
        "https://a0.muscache.com/pictures/33dd714a-7b4a-4654-aaf0-f58ea887a688.jpg",
      Mansions:
        "https://a0.muscache.com/pictures/78ba8486-6ba6-4a43-a56d-f556189193da.jpg",
      Towers:
        "https://a0.muscache.com/pictures/d721318f-4752-417d-b4fa-77da3cbc3269.jpg",
      "Creative spaces":
        "https://a0.muscache.com/pictures/8a43b8c6-7eb4-421c-b3a9-1bd9fcb26622.jpg",
      "Top of the world":
        "https://a0.muscache.com/pictures/248f85bf-e35e-4dc3-a9a1-e1dbff9a3db4.jpg",
      Skiling:
        "https://a0.muscache.com/pictures/c8bba3ed-34c0-464a-8e6e-27574d20e4d2.jpg",
      "Earth homes":
        "https://a0.muscache.com/pictures/d7445031-62c4-46d0-91c3-4f29f9790f7a.jpg",
      "Amazing views":
        "https://a0.muscache.com/pictures/3b1eb541-46d9-4bef-abc4-c37d77e3c21b.jpg",
    },
  ];
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
  const handleEmojiSelect = (key) => {
    setSelectedEmoji(key);
  };

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
            className={`emoji-container ${
              selectedEmoji === key ? "selectedEmoji" : ""
            }`}
            onClick={() => handleEmojiSelect(key)}
          >
            <img
              className="emoji-filter"
              src={value}
              alt={key}
              width="24"
              height="24"
            />
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
        className="clean-btn"
        onClick={() => setIsOpenFilter((currState) => !currState)}
      >
        Filters
      </button>
      <div className="filter-modal">
        {isOpenFilter && (
          <Filter filterBy={filterBy} onSetFilter={onSetFilter} />
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
