export function StayReviews({ reviews }) {
  let avgRate = reviews.rate / reviews.length;
  return (
    <section className="reviews-container">
      <h4>⭐ 4.87 • {reviews.length} Reviews</h4>
      <ul className="reviews-ul">
        {reviews.map((review, index) => {
          return (
            <li className="review-li flex column" key={index}>
              <div className="user-avatar flex row">
                {/* <img
                  src="https://res.cloudinary.com/dgzyxjapv/image/upload/v1670246635/stayby/avatars/male/68.jpg"
                  alt="Kiesha"
                  className="mini-user-img"
                ></img> */}
                <div className="txt-review fs16 user-avatar flex row">
                  {review.by.imgUrl}
                </div>
                <div className="fullname">{review.by.fullname}</div>
              </div>
              <div className="txt-review fs16">{review.txt}</div>
            </li>
          );
        })}
      </ul>
      <button className="reviews-btn">Show all {reviews.length} reviews</button>
    </section>
  );
}
