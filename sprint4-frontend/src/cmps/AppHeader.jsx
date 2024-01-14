import { Link, NavLink, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import routes from "../routes"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"
import { login, logout, signup } from "../store/user.actions.js"
import { LoginSignup } from "./LoginSignup.jsx"
import { useState, useEffect, useRef } from "react"
import { Calendar } from "./Calendar"
import { Guests } from "./Guests"
import { LoginModal } from "./Login"
import { Destinations } from "./Destinations"
import { DatePicker, Space } from "antd"
import { LoggedInModal } from "./LoggedInModal.jsx"

const LOGO = "/img/airbnb.png"
const LOGO_ICON = "/img/airbnb-icon.png"

export function AppHeader() {
  const navigate = useNavigate();

  const [selectedButton, setSelectedButton] = useState("stays")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isOpenDates, setIsOpenDates] = useState(false)
  const [isOpenGuests, setIsOpenGuests] = useState(false)
  const [isOpenDestinations, setIsOpenDestinations] = useState(false)
  const [userSearchDestination, setUserSearchDestination] = useState("")
  const [isScrolledDown, setIsScrolledDown] = useState(true)
  const [showScreenShadow, setShowScreenShadow] = useState(false)
  const [isClassAdded, setIsClassAdded] = useState(false)

  const filterBy = useSelector(
    (storeState) => storeState.stayModule.filterBy
  )


  const gRef = useRef() // global use ref for closing modals by noy

  const location = useLocation()
  const currentPath = location.pathname
  let detailPath = location.pathname
  let tripPath = location.pathname
  let hostPath = location.pathname
  if (currentPath.startsWith('/details/')) {
    // console.log('Current path is a details page');
    detailPath = '/details/'
  }

  // console.log("Current page path:", currentPath)
  useEffect(() => {
    if (filterBy.selectedDates.checkIn != null && filterBy.selectedDates.checkOut != null)
      setIsOpenDates(false)
  }, [filterBy])

  useEffect(() => {
    if (!isScrolledDown) {
      const timer = setTimeout(() => {
        setIsClassAdded(true)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setIsClassAdded(false)
    }
  }, [isScrolledDown])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsScrolledDown(true)
      }
      if (window.scrollY > 0) {
        setIsScrolledDown(false)
        setIsOpenDates(false)
        setIsOpenGuests(false)
        setIsOpenDestinations(false)
      }
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if ((window.scrollY > 0) & isOpenDates) {
      setShowScreenShadow(true)
      // להכניס פה את הקוד שזה הופך בחזרה למרכז התפריט של הפילטור לפי תאריכים והכל
      setIsScrolledDown(true)
    }
    if (isOpenDates === false) {
      setShowScreenShadow(false)
    }
  }, [isOpenDates])

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        isOpenGuests &&
        gRef.current &&
        !gRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setIsOpenGuests(false)
        }, 150)
      }
      if (isOpenDates && gRef.current && !gRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsOpenDates(false)
        }, 150)
      }
      if (
        isOpenDestinations &&
        gRef.current &&
        !gRef.current.contains(event.target)
      ) {
        setTimeout(() => {
          setIsOpenDestinations(false)
        }, 150)
      }
      if (isMenuOpen && gRef.current && !gRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsMenuOpen(false)
        }, 150)
      }
      if (isLoginOpen && gRef.current && !gRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsLoginOpen(false)
        }, 150)
      }
    } // לא לשלב בין שלושת התנאים זה יוצר באג!
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpenGuests, isOpenDates, isOpenDestinations, isMenuOpen, isLoginOpen])

  const totalGuests = Object.values(filterBy.selectedGuests).reduce(
    (total, currentValue) => total + currentValue,
    0
  )

  function searchFilterBy(ev) {
    event.preventDefault()
    console.log(`/stay?location=${filterBy.selectedDestination}&checkIn=${filterBy.selectedDates.checkIn.toLocaleDateString('en-US')}&checkOut=${filterBy.selectedDates.checkOut.toLocaleDateString('en-US')}&selectedGuests=${totalGuests}`);
    navigate(`/stay?location=${filterBy.selectedDestination}&checkIn=${filterBy.selectedDates.checkIn.toLocaleDateString('en-US')}&checkOut=${filterBy.selectedDates.checkOut.toLocaleDateString('en-US')}&selectedGuests=${totalGuests}`);
  }


  function refreshPage() {
    if (location.pathname === "/") {
      window.location.reload()
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
  }

  const toggleCalendarModal = () => {
    setIsOpenDestinations(false)
    setIsOpenGuests(false)
    if (isOpenDates) {
      setIsOpenDates(false)
      return
    }
    setIsOpenDates(true)
  }
  const toggleDestinationsModal = () => {
    // ---- DESTINATIONS
    setIsOpenDates(false)
    setIsOpenGuests(false)
    if (isOpenDestinations) {
      setIsOpenDestinations(false)
      return
    }
    setIsOpenDestinations(true)
  }
  const toggleGuestModal = () => {
    setIsOpenDestinations(false)
    setIsOpenDates(false)
    if (isOpenGuests) {
      setIsOpenGuests(false)
      return
    }
    setIsOpenGuests(true)
  }

  async function onLogin(credentials) {
    try {
      const user = await login(credentials)
      showSuccessMsg(`Welcome: ${user.fullname}`)
    } catch (err) {
      showErrorMsg("Cannot login")
    }
  }
  async function onSignup(credentials) {
    try {
      const user = await signup(credentials)
      showSuccessMsg(`Welcome new user: ${user.fullname}`)
    } catch (err) {
      showErrorMsg("Cannot signup")
    }
  }
  async function onLogout() {
    try {
      await logout()
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg("Cannot logout")
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setUserSearchDestination(value)
  }

  const openLoginModal = () => {
    setIsLoginOpen(true)
    setIsMenuOpen(false)
  }

  return (
    <header
      className={`app-header grid 
        ${!isScrolledDown || currentPath !== "/" ? " header-inserted " : ""
        } ${(!isScrolledDown && currentPath === "/")
          ? " header-sticky " : ' '}
        
      `}
    >
      {/* <div className='header-content flex justify-between align-center'> */}
      <div className="header-content">
        <div className="logo-container flex justify-center align-center right-header">
          <NavLink
            className="flex justify-center align-center"
            to="/"
            onClick={refreshPage}
          >
            <img src={LOGO_ICON} alt="logo icon" className="logo-header-img" />
            <img src={LOGO} alt="logo name" className="logo-header-txt" />
          </NavLink>
        </div>
        {(currentPath === "/" || detailPath === '/details/') && <div
          className={`
          small-search-form flex align-center
            ${(!isScrolledDown || currentPath !== "/")
              ? " small-form-expended "
              : " "
            }
          `}
        >
          <button className="btn-small-search-bar  fs14">Anywhere</button>
          <span className="splitter"></span>
          <button className="btn-small-search-bar  fs14">Any week</button>
          <span className="splitter"></span>
          <button className="btn-small-search-bar btn-small-search-grey fs14 ">
            Add guests
          </button>
        </div>}

        <nav
          className={`
          mid-three-menu flex column justify-center mid-header
            ${!isScrolledDown || currentPath !== "/"
              ? " mid-three-menu-close "
              : " "
            }  
          `}
        >
          <div className="header-btns-container">
            <button
              className={`header-btns clean-btn ${selectedButton === "stays" ? "selected" : ""
                }`}
              onClick={() => handleButtonClick("stays")}
            >
              Stays
            </button>
            <button
              className={`header-btns clean-btn ${selectedButton === "experiences" ? "selected" : ""
                }`}
              onClick={() => handleButtonClick("experiences")}
            >
              Experiences
            </button>
            <button
              className={`header-btns clean-btn ${selectedButton === "onlineExperiences" ? "selected" : ""
                }`}
              onClick={() => handleButtonClick("onlineExperiences")}
            >
              Online Experiences
            </button>
          </div>
        </nav>
        {(currentPath === "/" || currentPath === "/messages" || currentPath === "/backOffice" || currentPath === "/wishlist" || currentPath === "/userTrips" || detailPath === '/details/') && <div className="flex left-header justify-center align-center">
          <LoggedInModal
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
          />
        </div>}
      </div>
      {isLoginOpen && (
        <div ref={gRef}>
          <LoginModal
            isLoginOpen={isLoginOpen}
            setIsLoginOpen={setIsLoginOpen}
          />
        </div>
      )}
      <div className="flex justify-center">
        <form
          className={`
          search-form justify-center flex row 
          
        }
           ${(!isScrolledDown || currentPath !== "/")
              ? " header-search-inserted "
              : " "
            }    
              ${(currentPath !== "/" || isClassAdded) ? " close-header" : ""}
              `}
        >
          <div
            className="form-control flex column"
            onClick={toggleDestinationsModal}
          >
            <div className="destination-title fs12 blacktxt fw600">Where</div>
            <input
              type="text"
              value={userSearchDestination}
              onInput={handleInputChange}
              placeholder="Search destinations"
              className="destination-input fs12"
            ></input>
          </div>
          {isOpenDestinations && (
            <div ref={gRef}>
              <Destinations setUserSearchDestination={setUserSearchDestination} />
            </div>
          )}
          <span className="splitter"></span>

          <div className="form-dates flex column" onClick={toggleCalendarModal}>
            <div className="fs12 blacktxt fw600">Check in</div>
            {filterBy.selectedDates.checkIn === null && (
              <div className="fs14 blacktxt fw600">Add dates</div>
            )}
            {filterBy.selectedDates.checkIn && (
              <div className="fs14 blacktxt fw600">
                {filterBy.selectedDates.checkIn.toLocaleDateString()}
              </div>
            )}{" "}
          </div>
          {isOpenDates && (
            <div>
              <Calendar />
            </div>
          )}
          <div className="form-dates flex column" onClick={toggleCalendarModal}>
            <div className="fs12 blacktxt fw600">Check out</div>
            {filterBy.selectedDates.checkOut === null && (
              <div className="fs14 blacktxt fw600">Add dates</div>
            )}
            {filterBy.selectedDates.checkOut && (
              <div className="fs14 blacktxt fw600">
                {filterBy.selectedDates.checkOut.toLocaleDateString()}
              </div>
            )}
          </div>
          {isOpenDates && (
            <div ref={gRef}>
              <Calendar />
            </div>
          )}
          <span className="splitter"></span>

          <div className="form-dates flex column" onClick={toggleGuestModal}>
            <div className="fs12 blacktxt">Who</div>
            <div className="fs14 graytxt">
              {totalGuests ? `${totalGuests} guests` : "Add guests"}
            </div>
          </div>
          {isOpenGuests && (
            <div ref={gRef}>
              <Guests />
            </div>
          )}
          <button className="header-search-btn" onClick={(() => searchFilterBy())}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </form>
      </div>

      <div
        className="screen-shadow-login"
        style={{ display: isLoginOpen ? "block" : "none" }}
      ></div>
      <div
        className="screen-shadow"
        style={{ display: showScreenShadow ? "block" : "none" }}
      ></div>
    </header>
  )
}
