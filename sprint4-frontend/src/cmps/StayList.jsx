import { StayPreview } from "./StayPreview";
import { useSelector } from "react-redux";

export function StayList({ stays }) {
  const user = useSelector((storeState) => storeState.userModule.user);

  function isLiked(stay) {
    return (
      user?.wishlist?.some((currWish) => currWish._id === stay._id) || false
    );
  }

  return (
    <ul className="stay-list">
      {stays?.map((stay) => (
        <div key={stay._id}>
          <StayPreview stay={stay} isLiked={isLiked(stay)} />
        </div>
      ))}
    </ul>
  );
}
