import React from "react";
import { Routes, Route } from "react-router";

import routes from "./routes";

import { AppHeader } from "./cmps/AppHeader";
import { AppFooter } from "./cmps/AppFooter";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function RootCmp() {
  return (
    <main className="main-container">
      <AppHeader />
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            exact={true}
            element={route.component}
            path={route.path}
          />
        ))}
      </Routes>
      <ToastContainer theme="dark" />
      <AppFooter />
    </main>
  );
}
