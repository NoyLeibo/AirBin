import { HomePage } from "./pages/HomePage.jsx";
import { AboutUs } from "./pages/AboutUs.jsx";
import { StayIndex } from "./pages/StayIndex.jsx";
import { StayDetails } from "./pages/StayDetails.jsx";
import { ReviewIndex } from "./pages/ReviewIndex.jsx";
import { ChatApp } from "./pages/Chat.jsx";
import { AdminApp } from "./pages/AdminIndex.jsx";

// Routes accesible from the main navigation (in AppHeader)
const routes = [
  // {
  //   path: "/",
  //   component: <HomePage />,
  //   label: "Home 🏠",
  // },
  {
    path: "/",
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
    path: "admin",
    component: <AdminApp />,
    label: "Admin Only",
  },
];

export default routes;
