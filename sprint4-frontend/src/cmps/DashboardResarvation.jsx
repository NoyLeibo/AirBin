import { useEffect } from "react"
import { useSelector } from "react-redux"
import { loadUsers, removeUser } from "../store/user.actions"

export function DashboardResarvation() {
  const users = useSelector((storeState) => storeState.userModule.users)
  const isLoading = useSelector((storeState) => storeState.userModule.isLoading)

  useEffect(() => {
    loadUsers()
  }, [])

  return (
    <section className="dashboard-resarvation-container">
      {isLoading && "Loading..."}
      <div className="graphs-container">

      </div>
    </section>
  )
}