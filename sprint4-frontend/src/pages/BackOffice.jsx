import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadUsers, removeUser } from "../store/user.actions.js"
import { DashboardResarvation } from "../cmps/DashboardResarvation"

export function BackOffice() {
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <section className="main-back-office-container">
      {isLoading && "Loading..."}
      <div className="back-office-container ">

          <div className="btns-container-dashboard flex .align-center justify-center">
            <button className="btn-dashboard">
              Create listing
            </button>
            <button className="btn-dashboard">
              Listings
            </button>
            <button className="btn-dashboard">
              Reservation
            </button>
          </div>
        </div>
        <section>
            <DashboardResarvation />
        </section>
    </section>
  )
}
