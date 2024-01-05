import { Link, NavLink } from "react-router-dom"
import * as bootstrap from 'bootstrap'
// import Alert from 'bootstrap/js/dist/alert';

// or, specify which plugins you need:
// import { Tooltip, Toast, Popover } from 'bootstrap';

export function StayPreview({ stay }) {
  function toggleLike() {
    console.log("zzzzzzzzz")
  }

  return (
    <li className="stay-preview" key={stay._id}>
  <div id={`carouselExampleIndicators${stay._id}`} className="carousel slide">
    <div className="carousel-indicators">
      {stay.imgUrls.map((url, idx) => (
        <button
          key={idx}
          type="button"
          data-bs-target={`#carouselExampleIndicators${stay._id}`}
          data-bs-slide-to={idx}
          className={idx === 0 ? "active" : ""}
          aria-current={idx === 0 ? "true" : "false"}
          aria-label={`Slide ${idx + 1}`}
        ></button>
      ))}
    </div>
    <div className="carousel-inner">
      {stay.imgUrls.map((url, idx) => (
        <div key={url+idx} className={`carousel-item ${idx === 0 ? "active" : ""}`}>
          <img src={url} className="d-block w-100" alt='Place Image' />
        </div>
      ))}
    </div>
    <button
      className="carousel-control-prev"
      type="button"
      data-bs-target={`#carouselExampleIndicators${stay._id}`}
      data-bs-slide="prev"
    >
      <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Previous</span>
    </button>
    <button
      className="carousel-control-next"
      type="button"
      data-bs-target={`#carouselExampleIndicators${stay._id}`}
      data-bs-slide="next"
    >
      <span className="carousel-control-next-icon" aria-hidden="true"></span>
      <span className="visually-hidden">Next</span>
    </button>
  </div>
      {/* <div className="stay-img-card">
        
        <NavLink to={`/details/${stay._id}`}>
          <img src={stay.imgUrls[0]} />
        </NavLink>
        <button onClick={toggleLike} className="btn-like">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            aria-hidden="true"
            role="presentation"
            focusable="false"
            className="heart-icon "
          >
            <path d="M16 28c7-4.73 14-10 14-17a6.98 6.98 0 0 0-7-7c-1.8 0-3.58.68-4.95 2.05L16 8.1l-2.05-2.05a6.98 6.98 0 0 0-9.9 0A6.98 6.98 0 0 0 2 11c0 7 7 12.27 14 17z"></path>
          </svg>
        </button>
        <button onClick={toggleLike} className="btn-card-img btn-card-prev">
        <i className="fa-solid fa-angle-left"></i>
        </button>
        <button onClick={toggleLike} className=" btn-card-img btn-card-next ">
        <i className="fa-solid fa-angle-right"></i>
        </button>
      </div>
      <NavLink to={`/details/${stay._id}`}>
        <h3>{stay.name}</h3>
        <h3>
          <span>{stay.loc.country},</span>
          <span> {stay.loc.city}</span>
        </h3>
        <h3>
          <span>${stay.price.toLocaleString()} night</span>
        </h3>
      </NavLink> */}
    </li>
  )
}
