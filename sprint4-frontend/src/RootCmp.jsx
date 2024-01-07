import React from "react"
import { Routes, Route } from "react-router"

import routes from "./routes"

import { AppHeader } from "./cmps/AppHeader"
import { AppFooter } from "./cmps/AppFooter"
import { StayDetails } from "./pages/StayDetails"
import { PaymentPage } from "./pages/PaymentPage"

export function RootCmp() {
  return (
    <div >
      <AppHeader />
      <main  className="main-container">
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              exact={true}
              element={route.component}
              path={route.path}
            />
          ))}
          <Route path="user/:id" element={<StayDetails />} />
          <Route path="user/:id" element={<PaymentPage />} />
        </Routes>
      </main>
      <AppFooter />
    </div>
  )
}
