import { Link, NavLink } from 'react-router-dom'



export function StayPreview({ stay }) {



  return (
    <li className="stay-preview" key={stay._id}>
              < NavLink to={`/details/${stay._id}`}>              
              <div className="stay-img">
                <img src={stay.imgUrls[1]}/>
              </div>
              </NavLink>
              <h3>{stay.name}</h3>
              <p>
                <span>{stay.summary}</span>
              </p>
              <h3>
                <span>${stay.price.toLocaleString()} night</span>
              </h3>
              {/* {shouldShowActionBtns(stay) && (
                <div>
                  <button
                    onClick={() => {
                      onRemoveStay(stay._id);
                    }}
                  >
                    x
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStay(stay);
                    }}
                  >
                    Edit
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  onAddCarMsg(stay);
                }}
              >
                Add stay msg
              </button>
              <button
                className="buy"
                onClick={() => {
                  onAddToCart(stay);
                }}
              >
                Add to cart
              </button> */}
    </li>
  )
}