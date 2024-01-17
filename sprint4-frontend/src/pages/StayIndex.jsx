import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom"

import {
  loadStay,
  addStay,
  updateStay,
  removeStay,
  addToCart,
  setSelectedDestination,
  setSelectedDates,
  setSelectedGuests,
} from "../store/stay.actions.js";

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service.js";
import { userService } from "../services/user.service.js";
import { stayService } from "../services/stay.service.js";
import { StayList } from "../cmps/StayList.jsx";
import { ChatWindow } from "../cmps/Chat.jsx";
import { StayFilter } from "../cmps/StayFilter.jsx";
import { setFilterBy } from "../store/stay.actions.js";
import { socketService } from "../services/socket.service.js";

export function StayIndex() {
  const [isScrolledDown, setIsScrolledDown] = useState(true);
  const [isOnFilter, setIsOnFilter] = useState(false);
  const stays = useSelector((storeState) => storeState.stayModule.stays);
  const filterBy = useSelector((storeState) => storeState.stayModule.filterBy);
  const isLoading = useSelector(
    (storeState) => storeState.stayModule.isLoading
  );

  const dispatch = useDispatch()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // userService.addDemoUser();
  const currentPath = location.pathname
  useEffect(() => {
    setIsOnFilter(false)
    if (currentPath.startsWith('/s')) {
      console.log('/sssssssssssssssssss');
      setIsOnFilter(true)
      const selectedDestination = queryParams.get('location')
      const checkInDate = queryParams.get('checkIn')
      const checkOutDate = queryParams.get('checkOut')
      const adults = queryParams.get('adults')
      const children = queryParams.get('children')
      const infants = queryParams.get('infants')
      const pets = queryParams.get('pets')
      const totalGuests = { Adults: adults, Children: children, Infants: infants, Pets: pets }

      if (checkInDate instanceof Date && checkOutDate instanceof Date) {
        console.log('checkInDate', checkInDate);
        dispatch(setSelectedDates({ checkIn: new Date(checkInDate), checkOut: new Date(checkOutDate) }));
      }
      if (selectedDestination) {
        dispatch(setSelectedDestination(selectedDestination));
      }
      dispatch(setSelectedGuests(totalGuests));
    }
  }, [])

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
  }, [filterBy])

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
      className={`" main-stay-index " ${!isScrolledDown ? "scroll-down" : ""}`}>
      <StayFilter filterBy={filterBy} onSetFilter={onSetFilter} />
      <StayList stays={stays} isOnFilter={isOnFilter} />
      <ChatWindow />
    </main>
  );
}
