import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom"
import { loadUsers, removeUser } from "../store/user.actions.js";
import { DashboardResarvation } from "../cmps/DashboardResarvation";
import ChartPie from "../cmps/ChartPie.jsx";
import ChartBar from "../cmps/ChartBar.jsx";
import ChartSparkLine from "../cmps/ChartSparkline.jsx";

export function BackOffice() {
  const users = useSelector((storeState) => storeState.userModule.users)
  const user = useSelector((storeState) => storeState.userModule.user)
  const [orders,setOrders]=useState(user.guestsReservations)
  const [ordersStatusApr,setOrdersStatusApr]=useState(0)
  const [ordersStatusRej,setOrdersStatusRej]=useState(0)
  const [ordersStatusPen,setOrdersStatusPen]=useState(0)
  const [dataOrders,setDataOrders]=useState([{income:0,month:''}])
  const [dataStays,setDataStays]=useState([{ id: 0, value: 10, label: 'Example Stay' ,color:'blue'}])
  const isLoading = useSelector(
    (storeState) => storeState.userModule.isLoading
  );
  useEffect(() => {
    document.documentElement.style.setProperty('--main-layout-width', '1280px')
    loadUsers();
  }, []);
  useEffect(() => {
    setOrdersStatus()
    onSetDataOrders()
    onSetDataStays()
  }, [orders]);
  
  console.log(user.guestsReservations ,'');
  function setOrdersStatus(){
    const statusApr= orders.filter(order=>order.status==="Accepted").length
    const statusPen= orders.filter(order=>order.status==="pending").length
    const statusRej= orders.filter(order=>order.status==="Rejected").length
    setOrdersStatusApr(statusApr)
    setOrdersStatusRej(statusRej)
    setOrdersStatusPen(statusPen)
  }
  function onSetDataOrders(){
    const resultArray = calculateMonthlyIncome(orders)
    setDataOrders(resultArray)
  }
  function onSetDataStays(){
    const resultArray = calculateStaySummaries(orders);
    setDataStays(resultArray)
  }
  const calculateMonthlyIncome = (orders) => {
    const monthlyIncome = {}

    const currentDate = new Date()
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]

    for (let i = 5; i >= 0; i--) {
      const monthStartDate = new Date(currentDate)
      monthStartDate.setMonth(currentDate.getMonth() - i)
      const monthKey = monthNames[monthStartDate.getMonth()]

      monthlyIncome[monthKey] = 0
    }

    orders.forEach((order) => {
      const month = order.booked.split(' ')[0];

      if (!monthlyIncome[month]) {
        monthlyIncome[month] = order.totalPrice;
      } else {
        monthlyIncome[month] += order.totalPrice;
      }
    })

    return Object.entries(monthlyIncome).map(([month, income]) => ({
      income,
      month,
    }))
  }

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`
  }

  const calculateStaySummaries = (orders) => {
    const staySummaries = {}
  
    orders.forEach((order, idx) => {
      const stayId = order.stay.stayId
      const stayName = order.stay.stayName
  
      if (!staySummaries[stayId]) {
        staySummaries[stayId] = {
          id: idx,
          value: 1, 
          label: stayName,
          color: generateRandomColor(),
        };
      } else {
        staySummaries[stayId].value += 1
      }
    })
  
    return Object.values(staySummaries)
  }

  


  return (
    <section className="main-back-office-container">
      {isLoading && "Loading..."}
      <div className="back-office-container ">
        <div className="btns-container-dashboard flex .align-center justify-center">
        <NavLink to={`/edit`}>
          <button className="btn-dashboard">Create listing</button>
        </NavLink>
          <button className="btn-dashboard">Listings</button>
          <button className="btn-dashboard">Reservation</button>
        </div>
      </div>
      <section className="charts-container ">
      <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs22">Revenue / month</div>
        <ChartBar data={dataOrders}/>
        </div>
        <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs22">Reservation status</div>
        <div className="table-status flex column">
         <div className="row-status flex justify-between">
          <div className="title-row">Pending</div>
          <div className="status-row pending">{ordersStatusPen}</div>
         </div>
         <div className="row-status flex justify-between">
          <div className="title-row">Approved</div>
          <div className="status-row approved">{ordersStatusApr}</div>
         </div>
         <div className="row-status flex justify-between">
          <div className="title-row">Rejected</div>
          <div className="status-row rejected">{ordersStatusRej}</div>
         </div>
        </div>
        </div>
        {/* <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs22">Today's income</div>
        <ChartPie/>
        </div> */}
        <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs22">Reservations / listing</div>
        <ChartPie data={dataStays}/>
        </div>
        {/* <div className="chart-container flex column align-center">
        <div className="chart-title fw600 fs24">This week's orders</div>
        <ChartSparkLine/>
        </div> */}
        
      </section>
      <section className="dashboard-table-container">
        <DashboardResarvation />
      </section>
    </section>
  );
}
