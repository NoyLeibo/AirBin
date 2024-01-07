export function StayReviews({ reviews }) {
  return (
    <section className="reviews-container padding32">
      <h4>What this place offers</h4>
      <ul className="reviews-ul flex">
        {reviews.map((review, index) => {
          return (
            <li className="review-li flex column" key={index}>
              <div className="user-avatar flex row">
                <img
                  src="https://res.cloudinary.com/dgzyxjapv/image/upload/v1670246635/stayby/avatars/male/68.jpg"
                  alt="Kiesha"
                  class="mini-user-img"
                ></img>
                <div className="fullname">{review.by.fullname}</div>
              </div>
              <div>{review.txt}</div>
            </li>
          );
        })}
      </ul>
      <button className="reviews-btn">Show all {reviews.length} reviews</button>
    </section>
  );
}
