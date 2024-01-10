import { StayList } from "../cmps/StayList";
import { useSelector } from "react-redux";
export function Wishlist() {
  const stays = useSelector(
    (storeState) => storeState.userModule.user.wishlist
  );
  console.log(stays);
  return (
    <main className=" main-stay-index">
      <StayList stays={stays} />
    </main>
  );
}
