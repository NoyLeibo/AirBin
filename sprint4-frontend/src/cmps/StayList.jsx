import { StayPreview } from "./StayPreview";
import { useSelector } from "react-redux";

export function StayList({ stays }) {
  const userWishlist = useSelector(
    (storeState) => storeState.userModule.user.wishlist
  );

  function isLiked(stay) {
    return userWishlist.some((currWish) => currWish._id === stay._id);
  }

  return (
    <ul className="stay-list">
      {stays.map((stay) => {
        return (
          <div key={stay._id}>
            <StayPreview stay={stay} isLiked={isLiked(stay)} />
          </div>
        );
      })}
    </ul>
  );
}
