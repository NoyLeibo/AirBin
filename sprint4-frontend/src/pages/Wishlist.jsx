import { StayList } from "../cmps/StayList";
import { useSelector } from "react-redux";
export function Wishlist() {
  const stays = useSelector(
    (storeState) => storeState.userModule.user.wishlist
  );
  return (
    <main>
      <StayList stays={stays} />
    </main>
  );
}
