import React, { useState } from "react"
import { useEffect } from "react"
import { useNavigate, useParams, NavLink } from "react-router-dom"

import { showErrorMsg } from "../services/event-bus.service"
import { stayService } from "../services/stay.service.local"

export function StayDetails() {
  const [stay, setStay] = useState(null)

  const { stayId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    loadStay()
  })

  //  function loadStay() {
  //   stayService
  //     .getById(stayId)
  //     .then(setStay)
  //     .catch((err) => {
  //       showErrorMsg("Cant load stay")
  //       navigate("/stay")
  //     })
  // }

  async function loadStay() {
    try {
      const currStay = await stayService.getById(stayId)
      setStay(currStay)
    } catch (err) {
      showErrorMsg("Cant load stay")
      navigate("/stay")
    }
  }

  if (!stay) return <div>Loading...</div>
  return (
    <section className="stay-details-container flex column align-center">
      <h2>{stay.name}</h2>
      <div>
        <img src={stay.imgUrls[0]} />
      </div>
      <h2>{stay.summary}</h2>
    </section>
  )
}
