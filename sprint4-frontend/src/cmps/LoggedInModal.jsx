import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { LoginModal } from "./Login";
import { logout } from "../store/user.actions";

export function LoggedInModal({ isLoginOpen, setIsLoginOpen, setSignUp }) {
  //  left-header
  // const [isLoginOpen, setIsLoginOpen] = useState(false);
  const onlineUser = useSelector(
    (storeState) => storeState.userModule.user
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const gRef = useRef();
  const user = useSelector((storeState) => storeState.userModule.user);
  const location = useLocation()
  const currentPath = location.pathname

  console.log(onlineUser);


  const openLoginModal = () => {
    setIsLoginOpen(true);
    // setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (isMenuOpen && gRef.current && !gRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsMenuOpen(false);
        }, 150);
      }
      if (isLoginOpen && gRef.current && !gRef.current.contains(event.target)) {
        setTimeout(() => {
          setIsLoginOpen(false);
        }, 150);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isLoginOpen]);

  async function handleLogout() {
    try {
      await logout();
      refreshPage();
      setIsLoginOpen(false);
    } catch (err) {
      console.log("err: " + err);
    } finally {
      setIsMenuOpen(false);
    }
  }

  return (
    <section>
      <div>
        <div className="flex left-header justify-center align-center">
          {currentPath !== '/backOffice' && <NavLink
            to={user ? "/hosting" : "#"}
            onClick={user ? undefined : openLoginModal}
            className="moveto-host fs14"
          >
            {user ? "Swich to hosting" : "Airbnb your home"}
          </NavLink>}

          {/* <button className="clean-btn moveto-host">Airbnb your home</button> */}
          {currentPath !== '/backOffice' && <div className="word-icon lx138ae atm_h_1h6ojuz atm_9s_1txwivl atm_e2_1osqo2v atm_mk_h2mmj6 atm_wq_kb7nvz dir dir-ltr">
            <div className="_z5mecy" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                style={{
                  display: "block",
                  height: "16px",
                  width: "16px",
                  fill: "currentColor",
                }}
              >
                <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z"></path>
              </svg>
            </div>
          </div>}
          <button
            className="burger-menu clean-btn flex align-center"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              aria-hidden="true"
              role="presentation"
              focusable="false"
              style={{
                display: "block",
                fill: "none",
                height: "16px",
                width: "16px",
                stroke: "currentColor",
                strokeWidth: 3,
                overflow: "visible",
              }}
            >
              <g fill="none">
                <path d="M2 16h28M2 24h28M2 8h28"></path>
              </g>
            </svg>

            {onlineUser ?
              <img src={onlineUser.imgUrl} alt="User Avatar" className="avatar" />
              :
              <svg className="avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false"
                style={{ fill: "currentColor" }}>
                <path d="M16 .7C7.56.7.7 7.56.7 16S7.56 31.3 16 31.3 31.3 24.44 31.3 16 24.44.7 16 .7zm0 28c-4.02 0-7.6-1.88-9.93-4.81a12.43 12.43 0 0 1 6.45-4.4A6.5 6.5 0 0 1 9.5 14a6.5 6.5 0 0 1 13 0 6.51 6.51 0 0 1-3.02 5.5 12.42 12.42 0 0 1 6.45 4.4A12.67 12.67 0 0 1 16 28.7z"></path>
              </svg>}
          </button>
          {isMenuOpen && (
            <div ref={gRef} className="hamburger-menu">
              {!user && (
                <>
                  <div className="manu-one flex column">
                    <NavLink
                      to="/"
                      className="bold"
                      onClick={() => {
                        openLoginModal();
                        setIsMenuOpen(false);
                      }}
                    >
                      Log in
                    </NavLink>
                    <NavLink
                      to="/"
                      onClick={() => {
                        openLoginModal();
                        setIsMenuOpen(false);
                        setSignUp(true)
                      }}
                    >
                      Sign up
                    </NavLink>
                  </div>
                  <div className="flex column">
                    <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Gift cards
                    </NavLink>
                    <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Airbnb your home
                    </NavLink>
                    <NavLink to="/signup" onClick={() => setIsMenuOpen(false)}>
                      Help center
                    </NavLink>
                  </div>
                </>
              )}
              {user && (
                <>
                  <div className="manu-one flex column">
                    <NavLink
                      to="/userTrips"
                      className="bold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Trips
                    </NavLink>
                    <NavLink
                      to="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Wishlist
                    </NavLink>
                  </div>
                  <div className="flex column">
                    <NavLink
                      to="/messages"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Messages
                    </NavLink>
                    <NavLink
                      to="/backOffice"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View orders
                    </NavLink>
                    <NavLink to="/edit" onClick={() => setIsMenuOpen(false)}>
                      Add another stay
                    </NavLink>
                    <NavLink to="/" onClick={handleLogout}>
                      Log out
                    </NavLink>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
