import { HomePage } from "./pages/HomePage.jsx"
import { AboutUs } from "./pages/AboutUs.jsx"
import { StayIndex } from "./pages/StayIndex.jsx"
import { StayDetails } from "./pages/StayDetails.jsx"
import { ReviewIndex } from "./pages/ReviewIndex.jsx"
import { ChatApp } from "./pages/Chat.jsx"
import { BackOffice } from "./pages/BackOffice.jsx"
import { PaymentPage } from "./pages/PaymentPage.jsx"
import { StayEdit } from "./pages/StayEdit.jsx"

export const pageRouteNameMap = {
  STAY_INDEX: "/",
  STAY_DETAILS: "details/:stayId",
}
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
    path: "details/:stayId",
    component: <StayDetails />,
    label: "Details",
  },
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
    path: "BackOffice",
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
]

export default routes
