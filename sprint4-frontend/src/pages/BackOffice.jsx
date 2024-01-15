import { useEffect } from "react";
import { useSelector } from "react-redux";
import { loadUsers, removeUser } from "../store/user.actions.js";
import { DashboardResarvation } from "../cmps/DashboardResarvation";
import ChartPie from "../cmps/ChartPie.jsx";
import ChartBar from "../cmps/ChartBar.jsx";

export function BackOffice() {
  const users = useSelector((storeState) => storeState.userModule.users);
  const isLoading = useSelector(
    (storeState) => storeState.userModule.isLoading
  );
  useEffect(() => {
    document.documentElement.style.setProperty('--main-layout-width', '1280px')
    loadUsers();
  }, []);

  return (
    <section className="main-back-office-container">
      {isLoading && "Loading..."}
      <div className="back-office-container ">
        <div className="btns-container-dashboard flex .align-center justify-center">
          <button className="btn-dashboard">Create listing</button>
          <button className="btn-dashboard">Listings</button>
          <button className="btn-dashboard">Reservation</button>
        </div>
      </div>
      <section className="charts-container ">
        <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs24">Orders By Stay </div>
        <ChartPie/>
        </div>
        <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs24">Orders Today</div>
        <ChartPie/>
        </div>
        <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs24">Income Last Year</div>
        <ChartBar/>
        </div>
      </section>
      <section>
        <DashboardResarvation />
      </section>
    </section>
  );
}
