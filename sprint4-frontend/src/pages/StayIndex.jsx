import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  loadStay,
  addStay,
  updateStay,
  removeStay,
  addToCart,
} from "../store/stay.actions.js";

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { userService } from "../services/user.service.js";
import { stayService } from "../services/stay.service.js";
import { StayList } from "../cmps/StayList.jsx";
import { ChatWindow } from "../cmps/Chat.jsx";
import { StayFilter } from "../cmps/StayFilter.jsx";
import { setFilterBy } from "../store/stay.actions.js";
import { socketInit } from "../services/socketInit.js";

export function StayIndex() {
  const [isScrolledDown, setIsScrolledDown] = useState(true);
  const stays = useSelector((storeState) => storeState.stayModule.stays);
  const filterBy = useSelector((storeState) => storeState.stayModule.filterBy);
  const isLoading = useSelector(
    (storeState) => storeState.stayModule.isLoading
  );
  // userService.addDemoUser();

  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "2360px");
    loadStay();
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
  }, [filterBy]);

  useEffect(() => {
    socketInit();
  }, []);

  function onSetFilter(filterBy) {
    setFilterBy(filterBy);
  }

  async function onRemoveStay(stayId) {
    try {
      await removeStay(stayId);
      showSuccessMsg("Stay removed");
    } catch (err) {
      showErrorMsg("Cannot remove stay");
    }
  }

  async function onAddStay() {
    const stay = stayService.getEmptyStay();
    stay.vendor = prompt("Vendor?");
    try {
      const savedStay = await addStay(stay);
      showSuccessMsg(`Stay added (id: ${savedStay._id})`);
    } catch (err) {
      showErrorMsg("Cannot add stay");
    }
  }

  async function onUpdateStay(stay) {
    const price = +prompt("New price?");
    const stayToSave = { ...stay, price };
    try {
      const savedStay = await updateStay(stayToSave);
      showSuccessMsg(`Stay updated, new price: ${savedStay.price}`);
    } catch (err) {
      showErrorMsg("Cannot update stay");
    }
  }

  function onAddToCart(stay) {
    console.log(`Adding ${stay.vendor} to Cart`);
    addToCart(stay);
    showSuccessMsg("Added to Cart");
  }

  function onAddStayMsg(stay) {
    console.log(`TODO Adding msg to stay`);
    try {
      showSuccessMsg(`Stay msg added, it now has: ${3}`);
    } catch (err) {
      showErrorMsg("Cannot update stay");
    }
  }

  function shouldShowActionBtns(stay) {
    const user = userService.getLoggedinUser();
    if (!user) return false;
    if (user.isAdmin) return true;
    return stay.owner?._id === user._id;
  }

  if (isLoading) {
    return (
      <div className="main-stay-index">
        <div className="loader">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            ></span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main
      className={`" main-stay-index " ${!isScrolledDown ? "scroll-down" : ""}`}
    >
      <StayFilter filterBy={filterBy} onSetFilter={onSetFilter} />
      <StayList stays={stays} />
      <ChatWindow />
    </main>
  );
}
