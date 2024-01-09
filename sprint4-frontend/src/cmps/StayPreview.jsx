import { Link, NavLink } from "react-router-dom"
import * as bootstrap from 'bootstrap'
import Carousel from './Carousel';
// import Alert from 'bootstrap/js/dist/alert';

// or, specify which plugins you need:
// import { Tooltip, Toast, Popover } from 'bootstrap';

export function StayPreview({ stay }) {
  function toggleLike(stayid) {
    console.log("StayPreview")
  }

  return (
    <li className="stay-preview" key={stay._id}>
      <div className="stay-img-card">
        <Carousel stay={stay} />
      </div>
      < NavLink to={`/details/${stay._id}`}>
        <div className="fs16  stay-card-title flex justify-between align-center">
          <div className="stay-card-area bold">{stay.loc.city}, {stay.loc.country}</div>
          <div className="stay-card-rating-container fs16 flex align-center">
            <i className="fa-solid fa-star fs12 "></i>
            <span className="fw300 stay-card-rating"> {stay.reviews[0].rate}.00</span>
          </div>
        </div>
        <div className="stay-card-distance fs16">
          3,231 kilometer away
        </div>
        <div className="stay-card-dates fs16">
          Apr 15-20
        </div>
        <div className="stay-card-price-container fs16">
          <span className="stay-card-price fw600">${stay.price.toLocaleString()} </span>
          <span className="stay-card-price-details">
            night
          </span>
        </div>
      </NavLink>
    </li>
  )
}
