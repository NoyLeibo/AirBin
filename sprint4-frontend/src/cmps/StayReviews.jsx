import { useSelector } from "react-redux";
import React, { useState, useEffect } from 'react';

export function StayReviews({ reviews, stars }) {
  const [showScreenShadow, setShowScreenShadow] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [showMoreStates, setShowMoreStates] = useState(
    reviews.map(() => false)
  )

  const openModal = (ev) => {
    ev.preventDefault()
    setModalOpen(true)
    setShowScreenShadow(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setModalOpen(false)
    setShowScreenShadow(false)
    document.body.style.overflow = 'unset'
  }

  const toggleShowMore = (index) => {
    setShowMoreStates(
      showMoreStates.map((state, idx) => (idx === index ? !state : state))
    )
  }

  let avgRate = reviews.length > 0 ? (reviews.rate / reviews.length) : 0

  return (
    <section className="reviews-container">
      <div className="reviews-ul">
        {reviews.slice(0, 6).map((review, index) => (
          <li className="review-li flex column" key={index}>
            <div className="user-avatar flex row">
              <img
                src={review.by.imgUrl}
                className="mini-user-img"
              ></img>
              <div className="fullname">{review.by.fullname}</div>
            </div>
            <div className="txt-review fs16">
              {showMoreStates[index]
                ? review.txt
                : (review.txt.length > 150 ? `${review.txt.substring(0, 150)}...` : review.txt)
              }
              {review.txt.length > 150 && (
                <button
                  className="showmore-btn underline"
                  onClick={() => toggleShowMore(index)}
                >
                  {showMoreStates[index] ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>
          </li>
        ))}
      </div>
      <button className="reviews-btn" onClick={openModal}>Show all {reviews.length} reviews</button>

      {showScreenShadow && <div className="screen-shadow-login"></div>}
      {isModalOpen &&
        <div className="modal-reviews">
          <button onClick={closeModal}><i class="fa-solid fa-x"></i></button>
          <div className="reviews-on-modal">
            {reviews.map((review, index) => (
              <li className="review-li flex column" key={index}>
                <div className="user-avatar flex row">
                  <img
                    src={review.by.imgUrl}
                    alt={`${review.by.fullname}'s profile`}
                    className="mini-user-img"
                  />
                  <div className="fullname">{review.by.fullname}</div>
                </div>
                <div className="txt-review fs16">{review.txt}</div>
              </li>

            ))}
          </div>
        </div>
      }
    </section>
  );
}

