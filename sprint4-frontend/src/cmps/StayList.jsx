import React from "react";
import { StayPreview } from "./StayPreview"
import { useSelector } from "react-redux"

export function StayList({ stays, isOnFilter }) {

  const user = useSelector((storeState) => storeState.userModule.user);
  function isLiked(stay) {
    return (
      user?.wishlist?.some((currWish) => currWish._id === stay._id) || false
    )
  }

  function getRandomDateRangeString() {
    // Get the current date
    const currentDate = new Date()

    // Calculate the minimum date (current date + 3 days)
    const minDate = new Date(currentDate)
    minDate.setDate(currentDate.getDate() + 3)

    // Calculate the maximum date (current date + 2 weeks)
    const maxDate = new Date(currentDate)
    maxDate.setDate(currentDate.getDate() + 14)

    // Generate a random timestamp within the range
    const randomTimestamp = minDate.getTime() + Math.floor(Math.random() * (maxDate.getTime() - minDate.getTime()))

    // Create a new Date object from the random timestamp
    const randomDate = new Date(randomTimestamp)

    // Calculate the end date (random date + 6 days)
    const endDate = new Date(randomDate)
    endDate.setDate(randomDate.getDate() + 6)

    // Format the result to display the date range as a string
    let formattedResult
    if (randomDate.getMonth() !== endDate.getMonth()) {
      formattedResult = `${randomDate.toLocaleString('en-US', { month: 'short' })} ${randomDate.getDate()} - ${endDate.toLocaleString('en-US', { month: 'short' })} ${endDate.getDate()}`;
    } else {
      formattedResult = `${randomDate.toLocaleString('en-US', { month: 'short' })} ${randomDate.getDate()} - ${endDate.getDate()}`
    }

    return formattedResult
  }

  return (
    <section className="stay-list-on-filter">
      {/* {isOnFilter ?
        <React.Fragment>
          <ul>
            {stays?.map((stay) => (
              <div key={stay._id}>
                <StayPreview stay={stay} isLiked={isLiked(stay)} getRandomDateRangeString={getRandomDateRangeString} />
              </div>
            ))}
          </ul>
          <div className="google-map-filter">
          </div>
        </React.Fragment> */}
      <ul className="stay-list tests">
        {stays?.map((stay) => (
          <div key={stay._id}>
            <StayPreview stay={stay} isLiked={isLiked(stay)} getRandomDateRangeString={getRandomDateRangeString} />
          </div>
        ))}
      </ul>

    </section>
  );
}  