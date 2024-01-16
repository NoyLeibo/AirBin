import { useState } from "react"
import { useSelector } from "react-redux"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

import { removeFromCart, checkout } from "../store/stay.actions"
import { UserMsg } from "./UserMsg.jsx"
import { Link, NavLink, useLocation } from "react-router-dom"

export function AppFooter() {
  const location = useLocation()
  const currentPath = location.pathname
  let editPath
  if (currentPath.startsWith('/edit/')) {
    console.log('Current path is a edit page');
    editPath='/edit/'
  }
  if (currentPath.startsWith('/edit')) {
    console.log('Current path is a edit page');
    editPath='/edit'
  }
  return (
    <footer className={`app-footer  flex blacktxt full
    ${currentPath==="/"?" footer-fixed ":" "}
    ${editPath==="/edit"?" footer-close ":" "}
    ${editPath==="/edit/"?" footer-close ":" "}`}>


      <p>@ 2024 AirbMb, inc •
        <a className='pointer hovunderline'> Terms</a> •
        <a className='pointer hovunderline'> Sitemap</a> •
        <a className='pointer hovunderline'> Privacy</a> •
        <a className='pointer hovunderline'> Your Privacy Choices</a>
      </p>
      <p className="space-between">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          aria-hidden="true"
          role="presentation"
          focusable="false"
          style={{
            display: "block",
            height: "16px",
            width: "16px",
            fill: "currentColor",
          }}
        >
          <path d="M8 .25a7.77 7.77 0 0 1 7.75 7.78 7.75 7.75 0 0 1-7.52 7.72h-.25A7.75 7.75 0 0 1 .25 8.24v-.25A7.75 7.75 0 0 1 8 .25zm1.95 8.5h-3.9c.15 2.9 1.17 5.34 1.88 5.5H8c.68 0 1.72-2.37 1.93-5.23zm4.26 0h-2.76c-.09 1.96-.53 3.78-1.18 5.08A6.26 6.26 0 0 0 14.17 9zm-9.67 0H1.8a6.26 6.26 0 0 0 3.94 5.08 12.59 12.59 0 0 1-1.16-4.7l-.03-.38zm1.2-6.58-.12.05a6.26 6.26 0 0 0-3.83 5.03h2.75c.09-1.83.48-3.54 1.06-4.81zm2.25-.42c-.7 0-1.78 2.51-1.94 5.5h3.9c-.15-2.9-1.18-5.34-1.89-5.5h-.07zm2.28.43.03.05a12.95 12.95 0 0 1 1.15 5.02h2.75a6.28 6.28 0 0 0-3.93-5.07z"></path>
        </svg>
        <a className='pointer hovunderline'> English(US) </a>
        <a className='pointer hovunderline'> $ USD </a>
        <a className='pointer hovunderline'> Support & resources </a>

      </p>
      {/* <UserMsg /> */}
    </footer>
  )
}
