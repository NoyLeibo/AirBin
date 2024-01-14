import { HomePage } from "./pages/HomePage.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { StayIndex } from "./pages/StayIndex.jsx";
import { StayFilterBy } from "./pages/StayFilterBy.jsx";
import { StayDetails } from "./pages/StayDetails.jsx";
import { ReviewIndex } from "./pages/ReviewIndex.jsx";
import { ChatApp } from "./pages/Chat.jsx";
import { BackOffice } from "./pages/BackOffice.jsx";
import { PaymentPage } from "./pages/PaymentPage.jsx";
import { StayEdit } from "./pages/StayEdit.jsx";
import { UserTrips } from "./pages/UserTrips.jsx";
import { Wishlist } from "./pages/Wishlist.jsx";
import { Messages } from "./pages/Messages.jsx";
export const pageRouteNameMap = {
  STAY_INDEX: "/",
  STAY_DETAILS: "details/:stayId",
};
// Routes accesible from the main navigation (in AppHeader)
const routes = [
  // {
  //   path: "/",
  //   component: <HomePage />,
  //   label: "Home 🏠",
  // },
  {
    path: pageRouteNameMap.STAY_INDEX,
    component: <StayIndex />,
    label: "Stays",
  },
  {
    path: "/stay",
    component: <StayIndex />,
    label: "Stays",
  },
  {
    path: "details/:stayId",
    component: <StayDetails />,
    label: "Details",
  },
  // {
  //   path: "/stay",
  //   component: <StayFilterBy />,
  //   label: "Filter",
  // },
  {
    path: "review",
    component: <ReviewIndex />,
    label: "Reviews",
  },
  {
    path: "chat",
    component: <ChatApp />,
    label: "Chat",
  },
  {
    path: "about",
    component: <AboutUs />,
    label: "About us",
  },
  {
    path: "backOffice",
    component: <BackOffice />,
    label: "Back Office",
  },
  {
    path: "payment/:stayId",
    component: <PaymentPage />,
    label: "payment page",
  },
  {
    path: "edit/:stayId?",
    component: <StayEdit />,
    label: "edit",
  },
  {
    path: "userTrips",
    component: <UserTrips />,
    label: "trips",
  },
  {
    path: "wishlist",
    component: <Wishlist />,
    label: "wishlist",
  },
  {
    path: "messages",
    component: <Messages />,
    label: "messages",
  },
];

export default routes;
