import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { stayService } from "../services/stay.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import SimpleMap from "../cmps/GoogleMap";
import "@fortawesome/fontawesome-free/css/all.min.css"

import { LuDoorOpen } from "react-icons/lu"
import { GiHouse } from "react-icons/gi"
import { GiCastle } from "react-icons/gi"
import { GiBarn } from "react-icons/gi"
import { GiCaveEntrance } from "react-icons/gi"
import { GiWoodCabin } from "react-icons/gi"
import { GiCargoCrate } from "react-icons/gi"

import { FaCaravan } from "react-icons/fa"
import { FaRegBuilding } from "react-icons/fa"
import { FaHotel } from "react-icons/fa"

import { IoCafeOutline } from "react-icons/io5"
import { TbSailboat } from "react-icons/tb"
import { PiWarehouseDuotone } from "react-icons/pi"

export function StayEdit() {
  const labels = useSelector((storeState) => storeState.stayModule.lables)
  const isLoading = useSelector((storeState) => storeState.stayModule.isLoading)
  const [stayToEdit, setStayToEdit] = useState(stayService.getEmptyStay())
  const apiKey = 'AIzaSyB0dUlJsQSAuB636Yc1NGBUaJbwvYjfS1s'

  const [sectionProgress, setSectionProgress] = useState(1)
  const [selectedBtn, setSelectedBtn] = useState("")
  const [selectedStayPlace, setSelectedBtnStayPlace] = useState("")
  const [cords, setCords] = useState({lat:32.109333,lng:34.855499})
  const [valueGuests, setValueGuests] = useState(stayToEdit.capacity)
  const [valueBedrooms, setValueBedrooms] = useState(stayToEdit.rooms)
  const [valueBeds, setValueBeds] = useState(stayToEdit.beds)
  const [valueBathrooms, setValueBathrooms] = useState(stayToEdit.bathrooms)

  const { stayId } = useParams()
  const navigate = useNavigate()
  console.log(stayToEdit , cords ,valueGuests ,'startttt')

  useEffect(() => {
    if (!stayId) return
    stayService.getById(stayId).then((stay) => {
      setStayToEdit(stay)
    })
  }, [])

  function handleChange(ev) {
    const { name, value, type, options } = ev.target
    let newValue = value

    if (type === "number") {
      newValue = +value
    } else if (type === "select-multiple") {
      newValue = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value)
    }

    let field = name
    if (
      name === "area" ||
      name === "country" ||
      name === "city" ||
      name === "address"
    ) {
      const locationField =
        name === "area"
          ? "area"
          : name === "country"
          ? "country"
          : name === "city"
          ? "city"
          : "address"
      setStayToEdit((prevStay) => ({
        ...prevStay,
        loc: {
          ...prevStay.loc,
          [locationField]: newValue,
        },
      }))
    } else if (
      name === "capacity" ||
      name === "rooms" ||
      name === "beds" ||
      name === "bathrooms"
    ) {
      setStayToEdit((prevStay) => ({
        ...prevStay,
        stayDetail: {
          ...prevStay.stayDetail,
          [name]: newValue,
        },
      }))
    } else {
      setStayToEdit((prevStay) => ({
        ...prevStay,
        [field]: newValue,
      }))
    }
    if(stayToEdit.loc.country && stayToEdit.loc.city &&stayToEdit.loc.address ){
      let stayAddress= stayToEdit.loc.country+" "+stayToEdit.loc.city+" "+stayToEdit.loc.address
      getLatLngFromAddress(stayAddress)
    }
    console.log(ev.target, field, newValue)
  }
  
  function onSave(ev) {
    ev.preventDefault()

    const newStay = { ...stayToEdit }

    saveStay(newStay)
      .then(() => {
        showSuccessMsg("Stay saved successfully")
        navigate("/")
      })
      .catch((err) => {
        showErrorMsg("Can not save Stay, please try again")
      })
  }

  function changeSection(diff) {
    const step = diff + sectionProgress
    setSectionProgress(step)
  }

  function setType(type) {
    console.log(stayToEdit.type, type, selectedBtn)
    if (stayToEdit.type === type) {
      console.log("unset")
      stayToEdit.type = ""
      setStayToEdit(stayToEdit)
      setSelectedBtn("")
    } else if (stayToEdit.type === "") {
      console.log("set")
      stayToEdit.type = type
      setStayToEdit(stayToEdit)
      setSelectedBtn(type)
    }
  }
  function setStayPlace(stayPlace) {
    console.log(stayToEdit.stayPlace, stayPlace, selectedBtn)
    if (stayToEdit.stayPlace === stayPlace) {
      console.log("unset")
      stayToEdit.stayPlace = ""
      setStayToEdit(stayToEdit)
      setSelectedBtnStayPlace("")
    } else if (stayToEdit.stayPlace === "") {
      console.log("set")
      stayToEdit.stayPlace = stayPlace
      setStayToEdit(stayToEdit)
      setSelectedBtnStayPlace(stayPlace)
    }
  }

  function setBasic(type,diff){
    if(type==='guests'){
      if(stayToEdit.capacity>=0 && diff===1){

        stayToEdit.capacity=stayToEdit.capacity+diff
        setValueGuests(stayToEdit.capacity)
        setStayToEdit(stayToEdit)
      }else if(stayToEdit.capacity>0){
        stayToEdit.capacity=stayToEdit.capacity+diff
        setValueGuests(stayToEdit.capacity)
        setStayToEdit(stayToEdit)
      }
    }
    if(type==='bedrooms'){
      if(stayToEdit.rooms>=0 && diff===1){

        stayToEdit.rooms=stayToEdit.rooms+diff
        setValueBedrooms(stayToEdit.rooms)
        setStayToEdit(stayToEdit)
      }else if(stayToEdit.rooms>0){
        stayToEdit.rooms=stayToEdit.rooms+diff
        setValueBedrooms(stayToEdit.rooms)
        setStayToEdit(stayToEdit)
      }
    }
    if(type==='beds'){
      if(stayToEdit.beds>=0 && diff===1){
        stayToEdit.beds=stayToEdit.beds+diff
        setValueBeds(stayToEdit.beds)
        setStayToEdit(stayToEdit)
      }else if(stayToEdit.beds>0){
        stayToEdit.beds=stayToEdit.beds+diff
        setValueBeds(stayToEdit.beds)
        setStayToEdit(stayToEdit)
      }
    }
    if(type==='bathrooms'){
      if(stayToEdit.bathrooms>=0 && diff===1){
        stayToEdit.bathrooms=stayToEdit.bathrooms+diff
        setValueBathrooms(stayToEdit.bathrooms)
        setStayToEdit(stayToEdit)
      }else if(stayToEdit.bathrooms>0){
        stayToEdit.bathrooms=stayToEdit.bathrooms+diff
        setValueBathrooms(stayToEdit.bathrooms)
        setStayToEdit(stayToEdit)
      }
    }
  }
  console.log(sectionProgress)

  const getLatLngFromAddress = (address) => {
    // console.log(address);
    const encodedAddress = encodeURIComponent(address);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
  
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location
          console.log(`Latitude: ${lat}, Longitude: ${lng}`)
          stayToEdit.loc.lat=lat
          stayToEdit.loc.lng=lng
          // setStayToEdit(stayToEdit)
          cords.lat=lat
          cords.lng=lng
          setCords(cords)
        } else {
          console.log('No results found')
        }
      })
      .catch((error) => {
        console.error('There was a problem fetching the data:', error)
      })
  }

  if (isLoading) {
    console.log("no stay to edit")
    return (
      <section className="edit-main-container">
        <div className="loader">
          {Array.from({ length: 6 }).map((_, index) => (
            <span
              key={index}
              style={{ animationDelay: `${index * 0.15}s` }}
            ></span>
          ))}
        </div>
      </section>
    )
  }
  return (
    <section className="edit-main-container">
      {sectionProgress === 1 && (
        <section className="new-stay-container step-1">
          <div className="fw600 fs22"> Step 1</div>
          <div className="step-1-title">Tell us about your place</div>
          <p className="fs18">
            In this step, we'll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay.
          </p>
          <div className="video-step-container">
            <video
              className="video-step"
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              muted
              autoPlay
            >
              <source src="https://stream.media.muscache.com/zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek.mp4?v_q=high" type="video/mp4" />
            </video>
          </div>
        </section>
      )}
      {sectionProgress === 2 && (
        <section className="new-stay-container step-2">
          <div className="fw600 fs22"> Step 2</div>
          <div className="step-2-title fw600 fs30 ">
            Which of these best describes your place?
          </div>
          <div className="btns-container-new-stay">
            <button
              onClick={() => setType("House")}
              className={
                selectedBtn === "House"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24.155 8.78099L24.33 8.94499L37.402 21.787L36 23.213L34.2 21.445L34.201 35C34.201 36.054 33.385 36.918 32.35 36.994L32.201 37H12.201C11.147 37 10.283 36.184 10.206 35.149L10.201 35L10.2 21.446L8.402 23.213L7 21.787L20.058 8.95799C21.171 7.82199 22.966 7.75899 24.155 8.78099ZM21.569 10.285L21.473 10.372L12.2 19.481L12.201 35L17.2 34.999L17.201 25C17.201 23.946 18.017 23.082 19.052 23.005L19.201 23H25.201C26.255 23 27.119 23.816 27.196 24.851L27.201 25L27.2 34.999L32.201 35L32.2 19.48L22.901 10.344C22.537 9.98699 21.969 9.96499 21.569 10.285ZM25.201 25H19.201L19.2 34.999H25.2L25.201 25Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">House</div>
            </button>
            <button
              onClick={() => setType("Apartment")}
              className={
                selectedBtn === "Apartment"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34 13.5H26V10.5C25.999 9.97 25.788 9.461 25.413 9.086C25.039 8.712 24.53 8.501 24 8.5H10C9.47 8.501 8.961 8.711 8.586 9.086C8.211 9.461 8.001 9.97 8 10.5V34.5C8.001 35.03 8.212 35.539 8.586 35.913C8.961 36.288 9.47 36.499 10 36.5H34C34.53 36.499 35.038 36.288 35.413 35.913C35.788 35.538 35.999 35.03 36 34.5V15.5C35.999 14.97 35.788 14.461 35.413 14.086C35.039 13.712 34.53 13.501 34 13.5ZM19 34.5H15V29.5H19V34.5ZM24 34.5H21V29.5C20.999 28.97 20.788 28.461 20.413 28.087C20.039 27.712 19.53 27.501 19 27.5H15C14.47 27.501 13.961 27.712 13.586 28.087C13.212 28.461 13.001 28.97 13 29.5V34.5H10L9.999 10.5H24V34.5ZM34 34.5H26V15.5H34V34.5ZM31 22.5C31 22.698 30.941 22.891 30.831 23.056C30.722 23.22 30.565 23.348 30.383 23.424C30.2 23.5 29.999 23.519 29.805 23.481C29.611 23.442 29.433 23.347 29.293 23.207C29.153 23.067 29.058 22.889 29.019 22.695C28.981 22.501 29 22.3 29.076 22.117C29.152 21.935 29.28 21.778 29.444 21.669C29.609 21.559 29.802 21.5 30 21.5C30.265 21.5 30.52 21.605 30.707 21.793C30.895 21.98 31 22.235 31 22.5ZM29 18.5C29 18.302 29.059 18.109 29.169 17.944C29.278 17.78 29.435 17.652 29.617 17.576C29.8 17.5 30.001 17.481 30.195 17.519C30.389 17.558 30.567 17.653 30.707 17.793C30.847 17.933 30.942 18.111 30.981 18.305C31.019 18.499 31 18.7 30.924 18.883C30.848 19.065 30.72 19.222 30.556 19.331C30.391 19.441 30.198 19.5 30 19.5C29.735 19.5 29.48 19.395 29.293 19.207C29.105 19.02 29 18.765 29 18.5ZM21 22.5C21 22.698 20.941 22.891 20.831 23.056C20.722 23.22 20.565 23.348 20.383 23.424C20.2 23.5 19.999 23.519 19.805 23.481C19.611 23.442 19.433 23.347 19.293 23.207C19.153 23.067 19.058 22.889 19.019 22.695C18.981 22.501 19 22.3 19.076 22.117C19.152 21.935 19.28 21.778 19.444 21.669C19.609 21.559 19.802 21.5 20 21.5C20.265 21.5 20.52 21.605 20.707 21.793C20.895 21.98 21 22.235 21 22.5ZM21 18.5C21 18.698 20.941 18.891 20.831 19.056C20.722 19.22 20.565 19.348 20.383 19.424C20.2 19.5 19.999 19.519 19.805 19.481C19.611 19.442 19.433 19.347 19.293 19.207C19.153 19.067 19.058 18.889 19.019 18.695C18.981 18.501 19 18.3 19.076 18.117C19.152 17.935 19.28 17.778 19.444 17.669C19.609 17.559 19.802 17.5 20 17.5C20.265 17.5 20.52 17.605 20.707 17.793C20.895 17.98 21 18.235 21 18.5ZM21 14.5C21 14.698 20.941 14.891 20.831 15.056C20.722 15.22 20.565 15.348 20.383 15.424C20.2 15.5 19.999 15.519 19.805 15.481C19.611 15.442 19.433 15.347 19.293 15.207C19.153 15.067 19.058 14.889 19.019 14.695C18.981 14.501 19 14.3 19.076 14.117C19.152 13.935 19.28 13.778 19.444 13.669C19.609 13.559 19.802 13.5 20 13.5C20.265 13.5 20.52 13.605 20.707 13.793C20.895 13.98 21 14.235 21 14.5ZM15 22.5C15 22.698 14.941 22.891 14.831 23.056C14.722 23.22 14.565 23.348 14.383 23.424C14.2 23.5 13.999 23.519 13.805 23.481C13.611 23.442 13.433 23.347 13.293 23.207C13.153 23.067 13.058 22.889 13.019 22.695C12.981 22.501 13 22.3 13.076 22.117C13.152 21.935 13.28 21.778 13.444 21.669C13.609 21.559 13.802 21.5 14 21.5C14.265 21.5 14.52 21.605 14.707 21.793C14.895 21.98 15 22.235 15 22.5ZM15 18.5C15 18.698 14.941 18.891 14.831 19.056C14.722 19.22 14.565 19.348 14.383 19.424C14.2 19.5 13.999 19.519 13.805 19.481C13.611 19.442 13.433 19.347 13.293 19.207C13.153 19.067 13.058 18.889 13.019 18.695C12.981 18.501 13 18.3 13.076 18.117C13.152 17.935 13.28 17.778 13.444 17.669C13.609 17.559 13.802 17.5 14 17.5C14.265 17.5 14.52 17.605 14.707 17.793C14.895 17.98 15 18.235 15 18.5ZM15 14.5C15 14.698 14.941 14.891 14.831 15.056C14.722 15.22 14.565 15.348 14.383 15.424C14.2 15.5 13.999 15.519 13.805 15.481C13.611 15.442 13.433 15.347 13.293 15.207C13.153 15.067 13.058 14.889 13.019 14.695C12.981 14.501 13 14.3 13.076 14.117C13.152 13.935 13.28 13.778 13.444 13.669C13.609 13.559 13.802 13.5 14 13.5C14.265 13.5 14.52 13.605 14.707 13.793C14.895 13.98 15 14.235 15 14.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Apartment</div>
            </button>
            <button
              onClick={() => setType("Barn")}
              className={
                selectedBtn === "Barn"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.993 17.884C34.98 17.769 34.946 17.656 34.894 17.552L32.27 12.304L32.174 12.128C31.803 11.494 31.21 11.016 30.507 10.789L23.143 8.416L23.022 8.367C22.362 8.128 21.638 8.128 20.978 8.367L20.856 8.416L13.493 10.789L13.304 10.858C12.622 11.13 12.06 11.643 11.73 12.304L9.106 17.552L9.06 17.658C9.02 17.767 9 17.884 9 18V35L9.005 35.149C9.082 36.184 9.946 37 11 37H33L33.149 36.994C34.184 36.917 35 36.054 35 35V18L34.993 17.884ZM33 35H11V25H33V35ZM33 23H11V18.235L13.519 13.199L13.586 13.082C13.711 12.899 13.893 12.763 14.106 12.694L21.495 10.313L21.707 10.233C21.936 10.162 22.185 10.175 22.406 10.274L22.505 10.313L29.894 12.694L30.018 12.742C30.217 12.838 30.381 12.998 30.481 13.199L33 18.237V23Z"
                  fill="#222222"
                />
                <path
                  d="M25 13.999H19L18.883 14.006C18.386 14.063 18 14.486 18 14.999V19.999L18.007 20.116C18.065 20.613 18.487 20.999 19 20.999H25L25.117 20.992C25.614 20.934 26 20.512 26 19.999V14.999L25.993 14.882C25.935 14.385 25.513 13.999 25 13.999ZM24 18.999H20V15.999H24V18.999Z"
                  fill="#222222"
                />
                <path d="M16 24.125V35" stroke="#222222" stroke-width="2" />
                <path
                  d="M28.004 35.996H27.269H15.998V24.016H28.004V34.63V35.996Z"
                  stroke="#222222"
                  stroke-width="1.998"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.998 24.017L28.004 35.997"
                  stroke="#222222"
                  stroke-width="1.998"
                  stroke-miterlimit="10"
                />
                <path
                  d="M28.004 24.017L15.998 35.997"
                  stroke="#222222"
                  stroke-width="1.998"
                  stroke-miterlimit="10"
                />
              </svg>
              <div className="type-title ">Barn</div>
            </button>
            <button
              onClick={() => setType("Bed & breakfast")}
              className={
                selectedBtn === "Bed & breakfast"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <IoCafeOutline size="28px" />
              <div className="type-title ">Bed & breakfast</div>
            </button>
            <button
              onClick={() => setType("Boat")}
              className={
                selectedBtn === "Boat"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28px"
                height="28px"
                viewBox="60 -10 45 180"
                fill="none"
              >
                <path
                  fill="#222222"
                  d="M155,150c-2.88,0-4.72-.64-6.44-1.72,7.11-6.19,11.44-14.35,11.44-23.28,0-2.76-2.24-5-5-5H85v-10h70c1.89,0,3.62-1.07,4.47-2.76,.85-1.69,.67-3.72-.47-5.24L84,2c-.11-.14-.23-.26-.35-.39-.05-.06-.1-.12-.15-.17-.21-.2-.43-.39-.68-.56-.06-.04-.14-.08-.2-.12-.18-.11-.37-.22-.56-.31-.1-.05-.21-.08-.31-.12-.18-.07-.36-.12-.55-.17-.11-.03-.21-.05-.32-.07-.26-.05-.52-.07-.79-.08-.03,0-.06,0-.09,0H25c-1.61,0-3.12,.77-4.06,2.08-.94,1.3-1.2,2.98-.69,4.5l4.47,13.42-4.47,13.42c-.51,1.52-.25,3.2,.69,4.5,.94,1.3,2.45,2.08,4.06,2.08h50V120H5c-2.76,0-5,2.24-5,5,0,8.93,4.33,17.09,11.44,23.28-1.72,1.08-3.55,1.72-6.44,1.72s-5,2.24-5,5,2.24,5,5,5c6.95,0,11.05-2.55,14.24-5,.48-.37,.94-.74,1.39-1.1,2.94-2.35,4.88-3.9,9.38-3.9s6.44,1.55,9.38,3.9c.45,.36,.91,.73,1.39,1.1,3.18,2.45,7.28,5,14.24,5s11.05-2.55,14.23-5c.48-.37,.94-.74,1.39-1.1,2.94-2.35,4.88-3.9,9.38-3.9s6.44,1.55,9.38,3.9c.45,.36,.91,.73,1.39,1.1,3.18,2.45,7.28,5,14.23,5s11.05-2.55,14.23-5c.48-.37,.94-.74,1.39-1.1,2.94-2.35,4.88-3.9,9.38-3.9s6.44,1.55,9.38,3.9c.45,.36,.91,.73,1.39,1.1,3.18,2.45,7.28,5,14.23,5,2.76,0,5-2.24,5-5s-2.24-5-5-5Zm-70-50V20l60,80h-60ZM31.94,30l2.81-8.42c.34-1.03,.34-2.14,0-3.16l-2.81-8.42h43.06V30H31.94Zm98.06,110c-8,0-12.23,3.38-15.62,6.1-2.94,2.35-4.88,3.9-9.38,3.9s-6.44-1.55-9.38-3.9c-3.39-2.72-7.62-6.1-15.62-6.1s-12.23,3.38-15.62,6.1c-2.94,2.35-4.88,3.9-9.38,3.9s-6.44-1.55-9.38-3.9c-3.39-2.72-7.62-6.1-15.62-6.1-4.35,0-7.58,1-10.17,2.35-4.54-3.36-7.78-7.61-9.13-12.35H149.3c-1.35,4.74-4.59,8.99-9.13,12.35-2.59-1.35-5.82-2.35-10.17-2.35Z"
                />
              </svg>
              <div className="type-title ">Boat</div>
            </button>
            <button
              onClick={() => setType("Cabin")}
              className={
                selectedBtn === "Cabin"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 9 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33.4999 20.757V13.672H34.4999V22.757V22.964L34.6459 23.111L36.9999 25.464L36.2929 26.172L35.3529 25.232L34.4999 24.377V25.585V26.172C34.4999 26.812 34.2599 27.395 33.8639 27.838L33.5649 28.171L33.8629 28.505C34.2279 28.912 34.4599 29.438 34.4949 30.017L34.4999 30.179V31.172C34.4999 31.812 34.2599 32.395 33.8639 32.838L33.5649 33.171L33.8629 33.505C34.2279 33.912 34.4599 34.438 34.4949 35.017L34.4999 35.179V36.172C34.4999 37.501 33.4629 38.588 32.1539 38.667L31.9929 38.672H11.9999C10.6709 38.672 9.58388 37.635 9.50488 36.326L9.49988 36.164V35.172C9.49988 34.531 9.73988 33.948 10.1359 33.505L10.4349 33.172L10.1359 32.838C9.77188 32.431 9.53988 31.905 9.50488 31.326L9.49988 31.164V30.172C9.49988 29.531 9.73988 28.948 10.1359 28.505L10.4349 28.172L10.1359 27.838C9.78188 27.442 9.55188 26.933 9.50788 26.371L9.49988 26.162V25.585V24.378L8.64588 25.232L7.70688 26.172L6.99988 25.465L20.2319 12.232C21.1669 11.297 22.6599 11.258 23.6409 12.114L23.7729 12.238L32.6459 21.111L33.4999 21.964V20.757ZM17.4999 34.171V33.671H16.9999L11.9999 33.672C11.2299 33.672 10.5969 34.251 10.5099 34.997L10.5079 35.012L10.5069 35.026L10.5009 35.143L10.4999 35.157V35.172V36.172C10.4999 36.941 11.0789 37.575 11.8259 37.662L11.8399 37.663L11.8539 37.664L11.9709 37.671L11.9849 37.672H11.9999H16.9999H17.4999V37.172V34.171ZM25.4999 28.172V27.672H24.9999H18.9999H18.4999V28.172V37.172V37.672H18.9999H24.9999H25.4999V37.172V28.172ZM32.0289 33.672H32.0139H31.9999L26.9999 33.671H26.4999V34.171V37.172V37.672H26.9999H31.9999C32.7689 37.672 33.4029 37.092 33.4899 36.346L33.4909 36.332L33.4919 36.317L33.4989 36.2L33.4999 36.186V36.172V35.172C33.4999 34.402 32.9209 33.768 32.1739 33.682L32.1599 33.68L32.1449 33.679L32.0289 33.672ZM32.0289 28.672H32.0139H31.9999L26.9999 28.671H26.4999V29.171V32.171V32.671H26.9999L31.9999 32.672C32.7689 32.672 33.4029 32.092 33.4899 31.346L33.4909 31.332L33.4919 31.317L33.4989 31.2L33.4999 31.186V31.172V30.172C33.4999 29.402 32.9209 28.768 32.1739 28.682L32.1599 28.68L32.1449 28.679L32.0289 28.672ZM17.4999 29.171V28.671H16.9999L11.9999 28.672C11.2299 28.672 10.5969 29.251 10.5099 29.997L10.5079 30.012L10.5069 30.026L10.5009 30.143L10.4999 30.157V30.172V31.172C10.4999 31.941 11.0789 32.575 11.8259 32.662L11.8399 32.663L11.8539 32.664L11.9709 32.671L11.9849 32.672H11.9999L16.9999 32.671H17.4999V32.171V29.171ZM10.5099 24.997L10.5079 25.012L10.5069 25.026L10.5009 25.143L10.4999 25.157V25.172V26.172C10.4999 26.941 11.0789 27.575 11.8259 27.662L11.8399 27.663L11.8539 27.664L11.9709 27.671L11.9849 27.672H11.9999L17.2679 27.671H17.5559L17.6999 27.421C17.9419 27.005 18.3759 26.716 18.8789 26.676L19.0089 26.672H24.9999C25.5539 26.672 26.0389 26.972 26.2989 27.422L26.4439 27.671H26.7319L31.9999 27.672C32.7689 27.672 33.4029 27.092 33.4899 26.346L33.4909 26.332L33.4919 26.317L33.4989 26.2L33.4999 26.186V26.172V25.172C33.4999 24.343 32.8279 23.672 31.9999 23.672H11.9999C11.2299 23.672 10.5969 24.251 10.5099 24.997ZM28.9389 18.817L28.7929 18.671H28.5859H15.4139H15.2069L15.0599 18.817L12.0599 21.817L11.2069 22.671H12.4139H31.5859H32.7929L31.9389 21.817L28.9389 18.817ZM21.0799 12.815L21.0679 12.825L21.0559 12.835L20.9619 12.918L20.9499 12.928L20.9389 12.939L17.0599 16.817L16.2059 17.671H17.4139H26.5859H27.7929L26.9389 16.817L23.0599 12.939C22.5189 12.398 21.6689 12.357 21.0799 12.815Z"
                  fill="#222222"
                />
                <path
                  d="M33.4999 20.757V13.672H34.4999V22.757V22.964L34.6459 23.111L36.9999 25.464L36.2929 26.172L35.3529 25.232L34.4999 24.377V25.585V26.172C34.4999 26.812 34.2599 27.395 33.8639 27.838L33.5649 28.171L33.8629 28.505C34.2279 28.912 34.4599 29.438 34.4949 30.017L34.4999 30.179V31.172C34.4999 31.812 34.2599 32.395 33.8639 32.838L33.5649 33.171L33.8629 33.505C34.2279 33.912 34.4599 34.438 34.4949 35.017L34.4999 35.179V36.172C34.4999 37.501 33.4629 38.588 32.1539 38.667L31.9929 38.672H11.9999C10.6709 38.672 9.58388 37.635 9.50488 36.326L9.49988 36.164V35.172C9.49988 34.531 9.73988 33.948 10.1359 33.505L10.4349 33.172L10.1359 32.838C9.77188 32.431 9.53988 31.905 9.50488 31.326L9.49988 31.164V30.172C9.49988 29.531 9.73988 28.948 10.1359 28.505L10.4349 28.172L10.1359 27.838C9.78188 27.442 9.55188 26.933 9.50788 26.371L9.49988 26.162V25.585V24.378L8.64588 25.232L7.70688 26.172L6.99988 25.465L20.2319 12.232C21.1669 11.297 22.6599 11.258 23.6409 12.114L23.7729 12.238L32.6459 21.111L33.4999 21.964V20.757ZM17.4999 34.171V33.671H16.9999L11.9999 33.672C11.2299 33.672 10.5969 34.251 10.5099 34.997L10.5079 35.012L10.5069 35.026L10.5009 35.143L10.4999 35.157V35.172V36.172C10.4999 36.941 11.0789 37.575 11.8259 37.662L11.8399 37.663L11.8539 37.664L11.9709 37.671L11.9849 37.672H11.9999H16.9999H17.4999V37.172V34.171ZM25.4999 28.172V27.672H24.9999H18.9999H18.4999V28.172V37.172V37.672H18.9999H24.9999H25.4999V37.172V28.172ZM32.0289 33.672H32.0139H31.9999L26.9999 33.671H26.4999V34.171V37.172V37.672H26.9999H31.9999C32.7689 37.672 33.4029 37.092 33.4899 36.346L33.4909 36.332L33.4919 36.317L33.4989 36.2L33.4999 36.186V36.172V35.172C33.4999 34.402 32.9209 33.768 32.1739 33.682L32.1599 33.68L32.1449 33.679L32.0289 33.672ZM32.0289 28.672H32.0139H31.9999L26.9999 28.671H26.4999V29.171V32.171V32.671H26.9999L31.9999 32.672C32.7689 32.672 33.4029 32.092 33.4899 31.346L33.4909 31.332L33.4919 31.317L33.4989 31.2L33.4999 31.186V31.172V30.172C33.4999 29.402 32.9209 28.768 32.1739 28.682L32.1599 28.68L32.1449 28.679L32.0289 28.672ZM17.4999 29.171V28.671H16.9999L11.9999 28.672C11.2299 28.672 10.5969 29.251 10.5099 29.997L10.5079 30.012L10.5069 30.026L10.5009 30.143L10.4999 30.157V30.172V31.172C10.4999 31.941 11.0789 32.575 11.8259 32.662L11.8399 32.663L11.8539 32.664L11.9709 32.671L11.9849 32.672H11.9999L16.9999 32.671H17.4999V32.171V29.171ZM10.5099 24.997L10.5079 25.012L10.5069 25.026L10.5009 25.143L10.4999 25.157V25.172V26.172C10.4999 26.941 11.0789 27.575 11.8259 27.662L11.8399 27.663L11.8539 27.664L11.9709 27.671L11.9849 27.672H11.9999L17.2679 27.671H17.5559L17.6999 27.421C17.9419 27.005 18.3759 26.716 18.8789 26.676L19.0089 26.672H24.9999C25.5539 26.672 26.0389 26.972 26.2989 27.422L26.4439 27.671H26.7319L31.9999 27.672C32.7689 27.672 33.4029 27.092 33.4899 26.346L33.4909 26.332L33.4919 26.317L33.4989 26.2L33.4999 26.186V26.172V25.172C33.4999 24.343 32.8279 23.672 31.9999 23.672H11.9999C11.2299 23.672 10.5969 24.251 10.5099 24.997ZM28.9389 18.817L28.7929 18.671H28.5859H15.4139H15.2069L15.0599 18.817L12.0599 21.817L11.2069 22.671H12.4139H31.5859H32.7929L31.9389 21.817L28.9389 18.817ZM21.0799 12.815L21.0679 12.825L21.0559 12.835L20.9619 12.918L20.9499 12.928L20.9389 12.939L17.0599 16.817L16.2059 17.671H17.4139H26.5859H27.7929L26.9389 16.817L23.0599 12.939C22.5189 12.398 21.6689 12.357 21.0799 12.815Z"
                  stroke="#222222"
                />
              </svg>
              <div className="type-title ">Cabin</div>
            </button>
            <button
              onClick={() => setType("Camper/RV")}
              className={
                selectedBtn === "Camper/RV"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 6 30 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M38 32H17.874C17.652 32.858 17.15 33.618 16.449 34.161C15.748 34.704 14.887 34.998 14 34.998C13.113 34.998 12.252 34.704 11.551 34.161C10.85 33.618 10.348 32.858 10.126 32H8C7.495 32 7.009 31.81 6.639 31.466C6.269 31.123 6.043 30.653 6.005 30.15L6 30V15.21C6 12.41 8.188 10.12 10.936 10.005L11.154 10H28.846C31.623 10 33.881 12.218 33.996 14.99L34 15.21V30H36V28H38V32ZM14 29C13.47 29 12.961 29.211 12.586 29.586C12.211 29.961 12 30.47 12 31C12 31.53 12.211 32.039 12.586 32.414C12.961 32.789 13.47 33 14 33C14.53 33 15.039 32.789 15.414 32.414C15.789 32.039 16 31.53 16 31C16 30.47 15.789 29.961 15.414 29.586C15.039 29.211 14.53 29 14 29ZM28.846 12H11.154C9.475 12 8.098 13.337 8.005 15.028L8 15.211V30H10.126C10.348 29.142 10.85 28.382 11.551 27.839C12.252 27.296 13.113 27.002 14 27.002C14.887 27.002 15.748 27.296 16.449 27.839C17.15 28.382 17.652 29.142 17.874 30H20V17.167C20 16.022 20.888 15.085 22.012 15.005L22.167 15H26.833C27.978 15 28.915 15.888 28.995 17.012L29 17.167V30H32V15.21C32 13.496 30.68 12.1 29.025 12.005L28.846 12ZM26.833 17H22.167C22.132 17 22.098 17.011 22.069 17.031C22.04 17.052 22.019 17.081 22.008 17.114L22 17.167V30H27V17.167C27 17.132 26.989 17.098 26.969 17.069C26.948 17.041 26.919 17.019 26.886 17.008L26.833 17ZM16 15C16.505 15 16.991 15.19 17.361 15.533C17.73 15.877 17.957 16.347 17.995 16.85L18 17V21C18 21.505 17.81 21.991 17.467 22.361C17.123 22.73 16.653 22.957 16.15 22.995L16 23H12C11.495 23 11.009 22.81 10.639 22.467C10.269 22.123 10.043 21.653 10.005 21.15L10 21V17C10 16.495 10.19 16.009 10.533 15.639C10.877 15.269 11.347 15.043 11.85 15.005L12 15H16ZM16 17H12V21H16V17Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Camper/RV</div>
            </button>
            <button
              onClick={() => setType("Casa particular")}
              className={
                selectedBtn === "Casa particular"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M35 8.5C35.505 8.5 35.991 8.69 36.361 9.033C36.73 9.377 36.957 9.847 36.995 10.35L37 10.5V12.5C37 13.005 36.81 13.491 36.467 13.861C36.123 14.231 35.653 14.457 35.15 14.495L35 14.5V23.5H37V25.5H35V34.5C35 35.005 34.81 35.491 34.467 35.861C34.123 36.23 33.653 36.457 33.15 36.495L33 36.5H11C10.495 36.5 10.009 36.31 9.639 35.966C9.269 35.623 9.043 35.153 9.005 34.65L9 34.5V25.5H7V23.5H9V14.5L8.85 14.495C8.374 14.459 7.926 14.254 7.588 13.917C7.25 13.58 7.043 13.133 7.006 12.657L7 12.5V10.5C7 9.995 7.19 9.509 7.533 9.139C7.877 8.769 8.347 8.543 8.85 8.505L9 8.5H35ZM33 25.5H11V34.5H13V31.5C13 30.456 13.408 29.454 14.136 28.707C14.865 27.96 15.857 27.527 16.9 27.501C17.943 27.475 18.955 27.858 19.72 28.567C20.485 29.277 20.943 30.258 20.995 31.3L21 31.5V34.5H23V31.5C23 30.456 23.408 29.454 24.136 28.707C24.865 27.96 25.857 27.527 26.9 27.501C27.943 27.475 28.955 27.858 29.72 28.567C30.485 29.277 30.943 30.258 30.995 31.3L31 31.5V34.5H33V25.5ZM17 29.5C16.495 29.5 16.009 29.69 15.639 30.033C15.269 30.377 15.043 30.847 15.005 31.35L15 31.5V34.5H19V31.5C19 30.97 18.789 30.461 18.414 30.086C18.039 29.711 17.53 29.5 17 29.5ZM27 29.5C26.495 29.5 26.009 29.69 25.639 30.033C25.27 30.377 25.043 30.847 25.005 31.35L25 31.5V34.5H29V31.5C29 30.97 28.789 30.461 28.414 30.086C28.039 29.711 27.53 29.5 27 29.5ZM33 14.5H11V23.5H13V20.5C13 19.456 13.408 18.454 14.136 17.707C14.865 16.96 15.857 16.527 16.9 16.501C17.943 16.475 18.955 16.858 19.72 17.567C20.485 18.277 20.943 19.258 20.995 20.3L21 20.5V23.5H23V20.5C23 19.456 23.408 18.454 24.136 17.707C24.865 16.96 25.857 16.527 26.9 16.501C27.943 16.475 28.955 16.858 29.72 17.567C30.485 18.277 30.943 19.258 30.995 20.3L31 20.5V23.5H33V14.5ZM17 18.5C16.495 18.5 16.009 18.69 15.639 19.033C15.269 19.377 15.043 19.847 15.005 20.35L15 20.5V23.5H19V20.5C19 19.97 18.789 19.461 18.414 19.086C18.039 18.711 17.53 18.5 17 18.5ZM27 18.5C26.495 18.5 26.009 18.69 25.639 19.033C25.27 19.377 25.043 19.847 25.005 20.35L25 20.5V23.5H29V20.5C29 19.97 28.789 19.461 28.414 19.086C28.039 18.711 27.53 18.5 27 18.5ZM35 10.5H9V12.5H35V10.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Casa particular</div>
            </button>
            <button
              onClick={() => setType("Castle")}
              className={
                selectedBtn === "Castle"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="9 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23 15.5H24C24.513 15.5 24.936 15.886 24.993 16.383L25 16.5V18.5H26V16.5C26 16.027 26.329 15.63 26.771 15.526L26.883 15.507L27 15.5H31C31.513 15.5 31.936 15.886 31.993 16.383L32 16.5V21.5C32 21.658 31.963 21.813 31.892 21.953L31.832 22.055L30 24.802V36.5C30 36.973 29.671 37.37 29.229 37.474L29.117 37.493L29 37.5H15C14.487 37.5 14.064 37.114 14.007 36.617L14 36.5V24.804L12.168 22.055C12.102 21.956 12.055 21.847 12.028 21.733L12.007 21.618L12 21.5V16.5C12 15.987 12.386 15.564 12.883 15.507L13 15.5H17C17.513 15.5 17.936 15.886 17.993 16.383L18 16.5V18.5H19V16.5C19 16.027 19.329 15.63 19.771 15.526L19.883 15.507L20 15.5H21H23ZM16 17.5H14V21.197L15.832 23.945C15.898 24.044 15.945 24.153 15.972 24.267L15.993 24.382L16 24.5V35.5H18V31.5C18 29.358 19.684 27.609 21.8 27.505L22 27.5C24.142 27.5 25.891 29.184 25.995 31.3L26 31.5V35.5H28V27.5H26V25.5H28V24.5C28 24.382 28.021 24.265 28.062 24.155L28.108 24.047L28.168 23.945L30 21.196V17.5H28V19.5C28 19.973 27.671 20.37 27.229 20.474L27.117 20.493L27 20.5H24C23.487 20.5 23.064 20.114 23.007 19.617L23 19.5V17.5H21V19.5C21 19.973 20.671 20.37 20.229 20.474L20.117 20.493L20 20.5H17C16.487 20.5 16.064 20.114 16.007 19.617L16 19.5V17.5ZM22 29.5C20.946 29.5 20.082 30.316 20.005 31.351L20 31.5V35.5H24V31.5C24 30.498 23.264 29.669 22.303 29.523L22.149 29.505L22 29.5ZM26 24.5H23V22.5H26V24.5Z"
                  fill="#222222"
                />
                <path
                  d="M22.25 16.25V8.562"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M27.385 12.504H22.375V8.498H27.385V12.504Z"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="type-title ">Castle</div>
            </button>
            <button
              onClick={() => setType("Cave")}
              className={
                selectedBtn === "Cave"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.1062 9.928C21.2112 9.717 21.3872 9.551 21.6032 9.457C21.8192 9.364 22.0612 9.35 22.2872 9.417L22.4012 9.459L30.4012 12.959C30.5832 13.039 30.7372 13.171 30.8442 13.339L30.9022 13.442L36.9022 25.942C36.9502 26.043 36.9822 26.152 36.9942 26.263L37.0002 26.375V35.375C37.0002 35.62 36.9102 35.856 36.7472 36.039C36.5852 36.223 36.3602 36.339 36.1172 36.368L36.0002 36.375H8.00023C7.86223 36.375 7.72523 36.346 7.59923 36.291C7.47223 36.236 7.35923 36.155 7.26523 36.053C7.17123 35.952 7.10023 35.832 7.05523 35.702C7.00923 35.571 6.99223 35.433 7.00323 35.295L7.01923 35.179L10.0192 20.179C10.0512 20.02 10.1212 19.87 10.2242 19.744C10.3272 19.618 10.4592 19.519 10.6092 19.455L10.7252 19.413L17.3022 17.534L21.1062 9.928ZM22.4692 11.672L18.8942 18.822C18.7872 19.036 18.6072 19.204 18.3872 19.297L18.2752 19.337L11.8612 21.168L11.0192 25.375H14.0002V27.375H10.6192L9.21923 34.375H15.9992L16.0002 32.375C16.0002 30.823 16.6022 29.331 17.6782 28.213C18.7552 27.094 20.2242 26.437 21.7752 26.379L22.0002 26.375C23.5522 26.375 25.0442 26.977 26.1622 28.053C27.2812 29.13 27.9382 30.599 27.9962 32.15L28.0002 32.375V34.375H35.0002V26.603L34.4102 25.375H30.0002V23.375H33.4502L32.0002 20.352V20.375H25.0002V18.375H31.0502L29.2602 14.642L22.4702 11.672H22.4692ZM22.0002 28.375C20.9742 28.375 19.9872 28.77 19.2432 29.477C18.5002 30.184 18.0562 31.15 18.0052 32.175L18.0002 32.375V34.375H26.0002V32.375C26.0002 31.384 25.6322 30.428 24.9682 29.693C24.3032 28.957 23.3892 28.495 22.4032 28.395L22.2002 28.38L22.0002 28.375Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Cave</div>
            </button>
            <button
              onClick={() => setType("Container")}
              className={
                selectedBtn === "Container"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 30 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M38 35H36V33H8V35H6V11C6 10.755 6.09 10.519 6.253 10.336C6.415 10.153 6.64 10.036 6.883 10.007L7 10H37C37.245 10 37.481 10.09 37.664 10.253C37.847 10.415 37.964 10.64 37.993 10.883L38 11V35ZM36 12H8V31H36V12ZM33 29H31V14H33V29ZM13 29H11V14H13V29ZM18 29H16V14H18V29ZM23 29H21V14H23V29ZM28 29H26V14H28V29Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Container</div>
            </button>
            <button
              onClick={() => setType("Cycladic home")}
              className={
                selectedBtn === "Cycladic home"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M33 8.5C34.054 8.5 34.918 9.316 34.995 10.351L35 10.5V34.5C35 35.554 34.184 36.418 33.149 36.494L33 36.5H11C9.946 36.5 9.082 35.684 9.005 34.649L9 34.5V10.5C9 9.446 9.816 8.582 10.851 8.505L11 8.5H33ZM33 10.5H11V34.5H17V21.5C17 18.739 19.239 16.5 22 16.5C24.689 16.5 26.882 18.622 26.995 21.283L27 21.5V34.5H33V10.5ZM25 32.5H19V34.5H25V32.5ZM25 28.5H19V30.5H25V28.5ZM22 18.5C20.402 18.5 19.096 19.749 19.005 21.324L19 21.5V26.5H25V21.5C25 19.843 23.657 18.5 22 18.5ZM22 12.5C22.552 12.5 23 12.948 23 13.5C23 14.052 22.552 14.5 22 14.5C21.448 14.5 21 14.052 21 13.5C21 12.948 21.448 12.5 22 12.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Cycladic home</div>
            </button>
            <button
              onClick={() => setType("Dammuso")}
              className={
                selectedBtn === "Dammuso"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="6 5 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 9.5C24.578 9.5 27.055 10.199 29.213 11.499L29.635 11.764L29.701 11.808L29.983 12.006L30.137 12.12L30.526 12.424C30.665 12.536 30.81 12.657 30.962 12.786C31.449 13.2 32.055 13.447 32.689 13.493L32.901 13.5H36C36.513 13.5 36.936 13.886 36.993 14.383L37 14.5V34.5C37 35.013 36.614 35.436 36.117 35.493L36 35.5H8C7.487 35.5 7.064 35.114 7.007 34.617L7 34.5V14.5C7 13.987 7.386 13.564 7.883 13.507L8 13.5H11.098C11.809 13.5 12.497 13.248 13.038 12.789C13.62 12.296 14.118 11.917 14.539 11.652C16.755 10.253 19.323 9.5 22 9.5ZM13 29.5H9V33.5H13V29.5ZM31 29.5H27V33.5H31V29.5ZM22 22.5C20.402 22.5 19.096 23.749 19.005 25.324L19 25.5V33.5H25V25.5C25 23.962 23.842 22.693 22.35 22.52L22.176 22.505L22 22.5ZM17 29.5H15V33.5H17V29.5ZM35 29.5H33V33.5H35V29.5ZM29 23.5L26.584 23.501C26.813 24.025 26.955 24.597 26.991 25.197L27 25.5V27.5H29V23.5ZM11 23.5H9V27.5H11V23.5ZM17.416 23.501L13 23.5V27.5H17V25.5C17 24.789 17.148 24.113 17.416 23.501ZM35 23.5H31V27.5H35V23.5ZM31 18.5H23L23.001 20.6C23.648 20.732 24.249 20.988 24.779 21.343L25 21.5H31V18.5ZM21 18.5H14V21.5H19C19.581 21.063 20.261 20.75 21 20.6V18.5ZM35 18.5H33V21.5H35V18.5ZM12 18.5H9V21.5H12V18.5ZM22 11.5C19.704 11.5 17.505 12.145 15.607 13.343C15.276 13.552 14.849 13.876 14.331 14.315C13.492 15.025 12.445 15.438 11.352 15.494L11.099 15.5L9 15.499V16.5H35V15.499L32.9 15.5C31.891 15.499 30.91 15.193 30.084 14.628L29.862 14.468L29.665 14.309L29.283 13.991L28.92 13.708C28.76 13.587 28.615 13.485 28.487 13.403C26.568 12.167 24.335 11.5 22 11.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Dammuso</div>
            </button>
            <button
              onClick={() => setType("Dome")}
              className={
                selectedBtn === "Dome"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="5 5 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34 8.5V15.286C35.236 17.336 35.922 19.67 35.993 22.062L36 22.5V34.5C36 35.005 35.81 35.491 35.467 35.861C35.123 36.23 34.653 36.457 34.15 36.495L34 36.5H10C9.495 36.5 9.009 36.31 8.639 35.966C8.269 35.623 8.043 35.153 8.005 34.65L8 34.5V22.5C8 14.768 14.268 8.5 22 8.5C25.918 8.5 29.46 10.11 32 12.703V8.5H34ZM22 10.5C15.475 10.5 10.166 15.709 10.004 22.195L10 22.5V34.5H17V24.5H15V22.5H29V24.5H27V34.5H34V22.5C34 15.873 28.627 10.5 22 10.5ZM25 24.5H19V34.5H25V24.5ZM22 17.5C22.265 17.5 22.52 17.605 22.707 17.793C22.895 17.98 23 18.235 23 18.5C23 18.765 22.895 19.02 22.707 19.207C22.52 19.395 22.265 19.5 22 19.5C21.735 19.5 21.48 19.395 21.293 19.207C21.105 19.02 21 18.765 21 18.5C21 18.235 21.105 17.98 21.293 17.793C21.48 17.605 21.735 17.5 22 17.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Dome</div>
            </button>
            <button
              onClick={() => setType("Earth home")}
              className={
                selectedBtn === "Earth home"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28px"
                height="28px"
                fill="none"
                viewBox="55 -15 50 180"
              >
                <path
                  fill="#222222"
                  d="M159.77,123.57c-1.31-16.74-8.61-31.82-19.77-43.09v-20.6c11.29-1.2,20.11-10.77,20.11-22.37,0-.93-.07-1.88-.22-2.99l-.5-3.79-3.79-.5c-1.11-.15-2.06-.22-2.99-.22-7.06,0-13.37,3.27-17.5,8.38-4.13-5.11-10.44-8.38-17.5-8.38-.93,0-1.88,.07-2.99,.22l-3.79,.5-.5,3.79c-.15,1.11-.22,2.05-.22,2.99,0,11.52,8.71,21.04,19.89,22.34v12.28c-11.1-7.64-24.54-12.12-39-12.12h-22c-3.33,0-6.6,.25-9.81,.71l-3.19-.42c2.52-3.63,4-8.04,4-12.78,0-.94-.07-1.89-.22-2.99l-.51-3.79-3.79-.5c-1.11-.15-2.06-.22-2.99-.22-7.06,0-13.37,3.27-17.5,8.38-4.13-5.11-10.44-8.38-17.5-8.38-.93,0-1.88,.07-2.99,.22l-3.79,.5-.51,3.79c-.15,1.1-.22,2.06-.22,2.99,0,4.75,1.48,9.15,4,12.78l-3.27,.44-.51,3.79c-.15,1.1-.22,2.06-.22,2.99,0,6.39,2.68,12.16,6.97,16.26C7.53,94.6,1.42,108.4,.23,123.57c-.14,.46-.23,.93-.23,1.43,0,.28,.04,.54,.08,.8-.05,1.06-.08,2.12-.08,3.2v31H160v-31c0-1.07-.03-2.14-.08-3.2,.04-.26,.08-.53,.08-.8,0-.5-.1-.98-.23-1.43ZM120.44,40.32c4.63,1.07,8.29,4.73,9.36,9.36-4.63-1.07-8.29-4.73-9.36-9.36Zm29.36,0c-1.07,4.63-4.73,8.29-9.36,9.36,1.07-4.63,4.73-8.29,9.36-9.36Zm-100.11,30c-1.07,4.63-4.73,8.29-9.36,9.36,1.07-4.63,4.73-8.29,9.36-9.36Zm-20,9.36c-4.63-1.07-8.29-4.73-9.36-9.36,4.63,1.07,8.29,4.73,9.36,9.36Zm20-29.36c-1.07,4.63-4.73,8.29-9.36,9.36,1.07-4.63,4.73-8.29,9.36-9.36Zm-20,9.36c-4.63-1.07-8.29-4.73-9.36-9.36,4.63,1.07,8.29,4.73,9.36,9.36Zm25.32,90.32H10v-19.05c1.53,.69,2.81,1.71,4.38,2.96,3.39,2.72,7.62,6.1,15.62,6.1s12.23-3.38,15.62-6.1c2.94-2.35,4.88-3.9,9.38-3.9h0v20Zm40,0h-30v-40c0-8.27,6.73-15,15-15s15,6.73,15,15v40Zm-15-65c-13.79,0-25,11.21-25,25v10h0c-6.95,0-11.05,2.55-14.23,5-.48,.37-.94,.74-1.39,1.1-2.94,2.35-4.88,3.9-9.38,3.9s-6.44-1.55-9.38-3.9c-.45-.36-.91-.73-1.39-1.1-2.21-1.7-4.88-3.45-8.63-4.36,1.73-12.14,7.16-23.09,15.12-31.68,1.37,.43,2.8,.74,4.28,.9v10.14c0,2.76,2.24,5,5,5s5-2.24,5-5v-10.14c10.17-1.13,18.31-9.06,19.77-19.13,3.01-.48,6.09-.73,9.23-.73h22c29.69,0,54.32,22.05,58.4,50.64-3.75,.91-6.42,2.66-8.63,4.36-.48,.37-.94,.74-1.39,1.1-2.94,2.35-4.88,3.9-9.38,3.9s-6.44-1.55-9.38-3.9c-.45-.36-.91-.73-1.39-1.1-3.18-2.45-7.28-5-14.23-5v-10c0-13.79-11.21-25-25-25Zm70,65h-45v-20c4.49,0,6.43,1.55,9.37,3.9,3.39,2.72,7.62,6.1,15.62,6.1s12.23-3.38,15.62-6.1c1.56-1.25,2.85-2.27,4.38-2.96v19.05Zm-65-40c0,2.76-2.24,5-5,5s-5-2.24-5-5,2.24-5,5-5,5,2.24,5,5ZM135,30c8.27,0,15-6.73,15-15s-6.73-15-15-15-15,6.73-15,15,6.73,15,15,15Zm0-20c2.76,0,5,2.24,5,5s-2.24,5-5,5-5-2.24-5-5,2.24-5,5-5Z"
                />
              </svg>
              <div className="type-title ">Earth home</div>
            </button>
            <button
              onClick={() => setType("Farm")}
              className={
                selectedBtn === "Farm"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="6 7 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 8.5C16.914 8.5 18.885 10.401 18.995 12.788L19 13V17.698L24.405 13.696C24.733 13.453 25.172 13.437 25.514 13.642L25.625 13.719L31 18.02V14.5H33V19.62L35.625 21.719L34.375 23.281L33 22.18L32.999 26.5H35C35.513 26.5 35.936 26.886 35.993 27.383L36 27.5V35.5C36 36.013 35.614 36.436 35.117 36.493L35 36.5H8V34.5H15.545L17.295 32.5H8V30.5H19V30.552L20.795 28.5H8V26.5H10V13C10 10.515 12.015 8.5 14.5 8.5ZM26.795 28.5H23.453L18.203 34.5H21.545L26.795 28.5ZM34 30.16L30.203 34.5H34V30.16ZM32.795 28.5H29.453L24.203 34.5H27.545L32.795 28.5ZM31 20.58L24.976 15.761L19 20.187V26.5H21.999L22 22.5C22 21.987 22.386 21.564 22.883 21.507L23 21.5H27C27.513 21.5 27.936 21.886 27.993 22.383L28 22.5L27.999 26.5H30.999L31 20.58ZM14.5 10.5C13.175 10.5 12.09 11.532 12.005 12.836L12 13V26.5H17V13C17 11.619 15.881 10.5 14.5 10.5ZM26 23.5H24V26.5H26V23.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Farm</div>
            </button>
            <button
              onClick={() => setType("Guesthouse")}
              className={
                selectedBtn === "Guesthouse"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M27 37H17V35H27V37ZM25 33H19V31H25V33ZM35 8V11H37V13H35V28C35 28.513 34.614 28.936 34.117 28.993L34 29H10C9.487 29 9.064 28.614 9.007 28.117L9 28V13H7V11H33V8H35ZM33 13H11V27H18V19C18 18.487 18.386 18.064 18.883 18.007L19 18H25C25.513 18 25.936 18.386 25.993 18.883L26 19V27H33V13ZM24 20H20V27H24V20ZM30 15C30.552 15 31 15.448 31 16C31 16.552 30.552 17 30 17C29.448 17 29 16.552 29 16C29 15.448 29.448 15 30 15Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Guesthouse</div>
            </button>
            <button
              onClick={() => setType("Hotel")}
              className={
                selectedBtn === "Hotel"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 6 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34 8.5C35.054 8.5 35.918 9.316 35.995 10.351L36 10.5V34.5C36 35.554 35.184 36.418 34.149 36.494L34 36.5H10C8.946 36.5 8.082 35.684 8.005 34.649L8 34.5V10.5C8 9.446 8.816 8.582 9.851 8.505L10 8.5H34ZM22 13.415L18.914 16.5H10V34.5H18V29.5C18 28.446 18.816 27.582 19.851 27.505L20 27.5H24C25.054 27.5 25.918 28.316 25.995 29.351L26 29.5V34.5H34V16.5H25.086L22 13.415ZM24 29.5H20V34.5H24V29.5ZM30 27.5C30.552 27.5 31 27.948 31 28.5C31 29.052 30.552 29.5 30 29.5C29.448 29.5 29 29.052 29 28.5C29 27.948 29.448 27.5 30 27.5ZM14 27.5C14.552 27.5 15 27.948 15 28.5C15 29.052 14.552 29.5 14 29.5C13.448 29.5 13 29.052 13 28.5C13 27.948 13.448 27.5 14 27.5ZM30 23.5C30.552 23.5 31 23.948 31 24.5C31 25.052 30.552 25.5 30 25.5C29.448 25.5 29 25.052 29 24.5C29 23.948 29.448 23.5 30 23.5ZM14 23.5C14.552 23.5 15 23.948 15 24.5C15 25.052 14.552 25.5 14 25.5C13.448 25.5 13 25.052 13 24.5C13 23.948 13.448 23.5 14 23.5ZM30 19.5C30.552 19.5 31 19.948 31 20.5C31 21.052 30.552 21.5 30 21.5C29.448 21.5 29 21.052 29 20.5C29 19.948 29.448 19.5 30 19.5ZM22 19.5C22.552 19.5 23 19.948 23 20.5C23 21.052 22.552 21.5 22 21.5C21.448 21.5 21 21.052 21 20.5C21 19.948 21.448 19.5 22 19.5ZM14 19.5C14.552 19.5 15 19.948 15 20.5C15 21.052 14.552 21.5 14 21.5C13.448 21.5 13 21.052 13 20.5C13 19.948 13.448 19.5 14 19.5ZM34 14.5V10.5H10V14.5H18.084L20.586 12C21.326 11.26 22.501 11.221 23.287 11.883L23.414 12L25.915 14.5H34Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Hotel</div>
            </button>
            <button
              onClick={() => setType("Houseboat")}
              className={
                selectedBtn === "Houseboat"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="5 5 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.787 7.916C23.219 7.933 23.645 8.089 23.994 8.383L24.121 8.5L30.707 15.086V11.5H32.707V17.086L36.414 20.793L35 22.207L32.707 19.914V28.5H35.707V29.5C35.707 31.298 35.11 33 34.048 34.379L34.319 34.587C34.653 34.82 35.071 34.961 35.515 34.993L35.707 35V37L35.449 36.993C34.602 36.952 33.784 36.667 33.096 36.172L32.762 35.912C32.352 35.637 31.868 35.494 31.374 35.5C30.88 35.494 30.396 35.637 29.986 35.912L29.651 36.172C28.912 36.714 27.989 37 27.041 37C26.091 37 25.169 36.714 24.43 36.172L24.095 35.912C23.685 35.637 23.201 35.494 22.707 35.5C22.213 35.494 21.729 35.637 21.319 35.912L20.985 36.172C20.245 36.714 19.322 37 18.374 37C17.425 37 16.502 36.714 15.764 36.172L15.428 35.912C15.018 35.637 14.534 35.494 14.04 35.5C13.546 35.494 13.062 35.637 12.652 35.912L12.318 36.172C11.629 36.667 10.812 36.952 9.965 36.992L9.707 37V35L9.899 34.993C10.327 34.967 10.74 34.827 11.095 34.588L11.232 34.483L11.366 34.378C10.405 33.13 9.834 31.625 9.726 30.053L9.711 29.758L9.69 28.5H12.707V19.914L10.414 22.207L9 20.793L21.293 8.5C21.663 8.13 22.142 7.935 22.626 7.916H22.788H22.787ZM33.623 30.5H11.79L11.797 30.54C11.995 31.67 12.513 32.719 13.291 33.562C13.539 33.52 13.79 33.5 14.041 33.5C14.989 33.5 15.912 33.786 16.651 34.329L16.986 34.588C17.367 34.853 17.858 35 18.374 35C18.889 35 19.38 34.853 19.762 34.587L20.096 34.328C20.837 33.786 21.759 33.5 22.707 33.5C23.656 33.5 24.579 33.786 25.318 34.328L25.653 34.588C26.033 34.853 26.525 35 27.041 35C27.556 35 28.047 34.853 28.428 34.587L28.763 34.328C29.503 33.786 30.425 33.5 31.373 33.5C31.626 33.5 31.878 33.52 32.123 33.56C32.879 32.741 33.391 31.727 33.6 30.632L33.622 30.5H33.623ZM22.707 9.915L14.707 17.915V28.5H18.707V24.5C18.707 23.995 18.897 23.509 19.24 23.139C19.584 22.769 20.054 22.543 20.557 22.505L20.707 22.5H24.707C25.212 22.5 25.697 22.69 26.068 23.033C26.437 23.377 26.664 23.847 26.702 24.35L26.707 24.5V28.5H30.707V17.914L22.707 9.915ZM24.707 24.5H20.707V28.5H24.707V24.5ZM22.707 14.5C23.503 14.5 24.266 14.816 24.828 15.379C25.391 15.941 25.707 16.704 25.707 17.5C25.707 18.296 25.391 19.059 24.828 19.621C24.266 20.184 23.503 20.5 22.707 20.5C21.911 20.5 21.148 20.184 20.586 19.621C20.023 19.059 19.707 18.296 19.707 17.5C19.707 16.704 20.023 15.941 20.586 15.379C21.148 14.816 21.911 14.5 22.707 14.5ZM22.707 16.5C22.442 16.5 22.187 16.605 22 16.793C21.812 16.98 21.707 17.235 21.707 17.5C21.707 17.765 21.812 18.02 22 18.207C22.187 18.395 22.442 18.5 22.707 18.5C22.972 18.5 23.227 18.395 23.414 18.207C23.602 18.02 23.707 17.765 23.707 17.5C23.707 17.235 23.602 16.98 23.414 16.793C23.227 16.605 22.972 16.5 22.707 16.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Houseboat</div>
            </button>
            <button
              onClick={() => setType("Kezhan")}
              className={
                selectedBtn === "Kezhan"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="25px"
                viewBox="5 5 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 10.5V8.5H31V10.5H27L27.001 12.535C27.286 12.588 27.557 12.704 27.794 12.873L27.932 12.981L34.118 18.285C35.169 17.862 35.926 16.861 35.995 15.676L36 15.5V14.5H38V15.5C38 17.55 36.766 19.312 35.001 20.083L35 34.5C35 35.554 34.184 36.418 33.149 36.494L33 36.5H11C9.946 36.5 9.082 35.684 9.005 34.649L9 34.5V20.084C7.296 19.339 6.088 17.674 6.005 15.717L6 15.5V14.5H8V15.5C8 16.762 8.779 17.841 9.882 18.285L15.787 13.222C16.14 12.92 16.556 12.706 17 12.593V10.5H13ZM33 20.5H11V34.5H17V24.5C17 23.446 17.816 22.582 18.851 22.505L19 22.5H25C26.054 22.5 26.918 23.316 26.995 24.351L27 24.5V34.5H33V20.5ZM25 24.5H19V34.5H25V24.5ZM26.63 14.5H17.74C17.549 14.5 17.363 14.555 17.203 14.656L17.089 14.741L12.702 18.5H31.297L26.63 14.5ZM25 10.5H19V12.5H25V10.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Kezhan</div>
            </button>
            <button
              onClick={() => setType("Minsu")}
              className={
                selectedBtn === "Minsu"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="6 6 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.599 8.5C10.599 9.554 11.414 10.418 12.449 10.495L12.599 10.5H32.599C33.653 10.5 34.516 9.684 34.593 8.649L34.599 8.5H36.599C36.599 10.141 35.61 11.552 34.196 12.168L37.968 18.205C38.407 18.908 38.194 19.833 37.492 20.272C37.301 20.391 37.087 20.466 36.865 20.491L36.696 20.5H36.599V34.5C36.599 35.554 35.783 36.418 34.748 36.494L34.599 36.5H10.599C9.545 36.5 8.681 35.684 8.604 34.649L8.599 34.5V20.5H8.5C7.672 20.5 7 19.828 7 19C7 18.775 7.051 18.554 7.147 18.352L7.229 18.205L11.002 12.169C9.645 11.577 8.68 10.255 8.604 8.7L8.599 8.5H10.599ZM17.597 30.5H10.597L10.599 34.5H17.597V30.5ZM25.599 25.5H19.599L19.597 34.5H25.597L25.599 25.5ZM27.597 34.5H34.599L34.597 30.5H27.597V34.5ZM34.599 20.5H10.599L10.597 28.5H17.597L17.599 25.5C17.599 24.446 18.414 23.582 19.449 23.505L19.599 23.5H25.599C26.653 23.5 27.516 24.316 27.593 25.351L27.599 25.5L27.597 28.5H34.597L34.599 20.5ZM32.044 12.5H13.151L9.401 18.5H35.794L32.044 12.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Minsu</div>
            </button>
            <button
              onClick={() => setType("Raid")}
              className={
                selectedBtn === "Raid"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.947 9.142L24.126 9.24L34.109 15.139L33.091 16.861L31.6 15.979V21C31.6 21.079 31.591 21.155 31.573 21.229L38.2 26.2L37 27.8L35.6 26.749V36C35.6 36.512 35.214 36.935 34.716 36.993L34.6 37H10.6C10.087 37 9.664 36.614 9.607 36.116L9.6 36V26.749L8.2 27.8L7 26.2L13.626 21.229L13.607 21.116L13.6 21V15.979L12.109 16.861L11.091 15.139L21.074 9.24C21.956 8.718 23.039 8.686 23.947 9.142ZM15.6 26.999L11.6 27V35L15.6 34.999V26.999ZM27.6 27H17.6V35L19.6 34.999V30C19.6 29.487 19.986 29.064 20.483 29.006L20.6 29H24.6C25.113 29 25.535 29.386 25.593 29.883L25.6 30V34.999L27.6 35V27ZM33.6 27L29.6 26.999V34.999L33.6 35V27ZM23.6 31H21.6V35H23.6V31ZM33.267 24.999L29.267 22L27.365 21.999L29.165 24.999H33.267ZM11.933 24.999H16.034L17.834 21.999L15.933 22L11.933 24.999ZM25.035 22H20.166L18.366 24.999H26.834L25.035 22ZM18.6 15.999L15.6 16V20L18.6 19.999V15.999ZM24.6 15.999H20.6V19.999H24.6V15.999ZM29.6 16L26.6 15.999V19.999L29.6 20V16ZM22.212 10.901L22.091 10.962L16.951 13.999H28.248L23.109 10.962C22.834 10.8 22.501 10.779 22.212 10.901Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Raid</div>
            </button>
            <button
              onClick={() => setType("Ryokan")}
              className={
                selectedBtn === "Ryokan"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.6485 8.185L34.0655 12.98L34.1005 12.974C34.4695 12.881 34.7605 12.544 34.8065 12.118L34.8125 12H36.8125C36.8125 13.648 35.5145 15 33.8925 15C33.7975 15 33.7045 14.987 33.6135 14.96L33.4815 14.911L31.8125 14.158L31.8115 18H33.8125C34.3645 18 34.8125 18.448 34.8125 19C34.8125 20.679 36.0635 21.99 38.8125 22.945V25H35.8125V35C35.8125 36.054 34.9965 36.918 33.9615 36.994L33.8125 37H11.8125C10.7585 37 9.8945 36.184 9.8175 35.149L9.8125 35V25H6.8125V22.945C9.5615 21.99 10.8125 20.679 10.8125 19C10.8125 18.487 11.1985 18.064 11.6955 18.007L11.8125 18H13.8115L13.8125 14.189L12.5895 14.706L12.0795 14.915L11.9195 14.976L11.8735 14.99L11.7325 15C10.1685 15 8.9055 13.743 8.8175 12.175L8.8125 12H10.8125C10.8125 12.481 11.1215 12.872 11.5245 12.974L11.5585 12.98L21.9765 8.185C22.5065 7.941 23.1175 7.941 23.6485 8.185ZM33.8125 25H11.8125V35H16.8115L16.8125 29C16.8125 27.946 17.6285 27.082 18.6635 27.005L18.8125 27H26.8125C27.8665 27 28.7305 27.816 28.8065 28.851L28.8125 29L28.8115 35H33.8125V25ZM21.8125 29H18.8125L18.8115 35H21.8115L21.8125 29ZM26.8125 29H23.8125L23.8115 35H26.8115L26.8125 29ZM32.9065 20H12.7175L12.6845 20.167C12.4655 21.123 11.9695 21.969 11.2105 22.704L10.9975 22.901L10.8805 23H34.7435L34.6275 22.901C33.8215 22.186 33.2755 21.361 33.0075 20.425L32.9405 20.167L32.9065 20ZM18.8125 15H15.8125V18H18.8125V15ZM24.8125 15H20.8125V18H24.8125V15ZM29.8125 15H26.8125V18H29.8125V15ZM22.8135 10.097L16.4275 13H29.2465L22.8135 10.097Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Ryokan</div>
            </button>
            <button
              onClick={() => setType("Shepherd's hut")}
              className={
                selectedBtn === "Shepherd's hut"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="10 -20 160 200"
                width="28px"
                height="28px"
              >
                <path
                  fill="#222222"
                  d="M135,20V5c0-2.76-2.24-5-5-5s-5,2.24-5,5v15H25C11.21,20,0,31.21,0,45v10c0,2.76,2.24,5,5,5h5V125c0,2.76,2.24,5,5,5h7.71c-1.71,2.95-2.71,6.36-2.71,10,0,11.03,8.97,20,20,20s20-8.97,20-20c0-3.64-1-7.05-2.71-10h22.71v25c0,2.76,2.24,5,5,5s5-2.24,5-5v-5h20v5c0,2.76,2.24,5,5,5s5-2.24,5-5v-25h25c2.76,0,5-2.24,5-5V60h5c2.76,0,5-2.24,5-5v-10c0-13.79-11.21-25-25-25ZM40,150c-5.51,0-10-4.49-10-10s4.49-10,10-10,10,4.49,10,10-4.49,10-10,10Zm-20-30V60h60v60H20ZM90,60h20v40h-20V60Zm0,50h20v10h-20v-10Zm0,30v-10h20v10h-20Zm50-20h-20V60h20v60Zm10-70H10v-5c0-8.27,6.73-15,15-15h110c8.27,0,15,6.73,15,15v5Z"
                />
              </svg>
              <div className="type-title ">Shepherd's hut</div>
            </button>
            <button
              onClick={() => setType("Tent")}
              className={
                selectedBtn === "Tent"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M28.0061 14.228C28.0061 14.297 28.0051 14.366 28.0041 14.435L28.0031 14.515V14.527V14.539L28.0081 14.802V14.811V14.82L28.0361 15.296L28.0381 15.348L28.0531 15.399C28.2561 16.143 28.6931 16.789 29.4021 17.251C30.0571 17.677 30.9171 17.928 31.9841 17.986V18.987C30.6351 18.917 29.5721 18.565 28.7811 18.031L28.0011 17.504V18.445V21.5V22H28.5011H29.5011C29.6601 22 29.8081 22.076 29.9021 22.201L29.9491 22.276L36.9411 35.263C37.1091 35.574 36.9091 35.949 36.5731 35.995L36.4881 36H8.50114C8.14814 36 7.91214 35.646 8.03115 35.329L8.06814 35.251L15.0611 22.263C15.1431 22.111 15.2771 22.027 15.4241 22.006L15.4621 22H26.5011H27.0011V21.5L27.0031 18.446V17.505L26.2231 18.031C25.4321 18.565 24.3701 18.917 23.0211 18.987V17.986C24.0451 17.93 24.8771 17.697 25.5211 17.302C26.2771 16.839 26.7421 16.173 26.9521 15.399L26.9651 15.353L26.9691 15.306L26.9841 15.122V15.114V15.106L26.9971 14.814V14.8L27.0011 14.556V14.548L27.0031 13.458V12.366L26.1761 13.079C25.3941 13.753 24.3511 14.195 23.0211 14.284V13.281C24.0451 13.199 24.8871 12.863 25.5381 12.297C26.2871 11.645 26.7341 10.732 26.9451 9.688L26.9471 9.679L26.9491 9.67L26.9691 9.541L26.9711 9.533V9.526C26.9881 9.399 26.9991 9.267 27.0031 9.143V9.122V9.102L26.9991 9.023V9H28.0011V9.216H28.0061C28.0111 9.321 28.0211 9.426 28.0341 9.526V9.533L28.0361 9.541L28.0571 9.67L28.0591 9.679L28.0601 9.688C28.2631 10.696 28.6861 11.582 29.3911 12.229C30.0501 12.834 30.9181 13.196 31.9841 13.281V14.284C30.6531 14.195 29.6091 13.751 28.8271 13.077L28.0011 12.363V13.456V13.784V14.228H28.0061ZM15.0011 26.465L14.0601 26.228L9.73615 34.263L9.33814 35H10.1761H14.5011H15.0011V34.5V26.465ZM34.8271 34.999H35.6631L35.2661 34.262L29.3441 23.262L29.2021 22.999H28.9041L17.1761 23H16.3381L16.7341 23.737L22.6571 34.737L22.7991 35H23.0981L34.8271 34.999ZM16.9411 26.231L16.0011 26.468V34.5V35H16.5011H20.8271H21.6631L21.2661 34.263L16.9411 26.231ZM14.5011 11C16.4341 11 18.0011 12.567 18.0011 14.5C18.0011 16.433 16.4341 18 14.5011 18C12.5681 18 11.0011 16.433 11.0011 14.5C11.0011 12.567 12.5681 11 14.5011 11ZM14.5011 12C13.1201 12 12.0011 13.119 12.0011 14.5C12.0011 15.881 13.1201 17 14.5011 17C15.8821 17 17.0011 15.881 17.0011 14.5C17.0011 13.119 15.8821 12 14.5011 12Z"
                  fill="#222222"
                />
                <path
                  d="M28.0061 14.228C28.0061 14.297 28.0051 14.366 28.0041 14.435L28.0031 14.515V14.527V14.539L28.0081 14.802V14.811V14.82L28.0361 15.296L28.0381 15.348L28.0531 15.399C28.2561 16.143 28.6931 16.789 29.4021 17.251C30.0571 17.677 30.9171 17.928 31.9841 17.986V18.987C30.6351 18.917 29.5721 18.565 28.7811 18.031L28.0011 17.504V18.445V21.5V22H28.5011H29.5011C29.6601 22 29.8081 22.076 29.9021 22.201L29.9491 22.276L36.9411 35.263C37.1091 35.574 36.9091 35.949 36.5731 35.995L36.4881 36H8.50114C8.14814 36 7.91214 35.646 8.03115 35.329L8.06814 35.251L15.0611 22.263C15.1431 22.111 15.2771 22.027 15.4241 22.006L15.4621 22H26.5011H27.0011V21.5L27.0031 18.446V17.505L26.2231 18.031C25.4321 18.565 24.3701 18.917 23.0211 18.987V17.986C24.0451 17.93 24.8771 17.697 25.5211 17.302C26.2771 16.839 26.7421 16.173 26.9521 15.399L26.9651 15.353L26.9691 15.306L26.9841 15.122V15.114V15.106L26.9971 14.814V14.8L27.0011 14.556V14.548L27.0031 13.458V12.366L26.1761 13.079C25.3941 13.753 24.3511 14.195 23.0211 14.284V13.281C24.0451 13.199 24.8871 12.863 25.5381 12.297C26.2871 11.645 26.7341 10.732 26.9451 9.688L26.9471 9.679L26.9491 9.67L26.9691 9.541L26.9711 9.533V9.526C26.9881 9.399 26.9991 9.267 27.0031 9.143V9.122V9.102L26.9991 9.023V9H28.0011V9.216H28.0061C28.0111 9.321 28.0211 9.426 28.0341 9.526V9.533L28.0361 9.541L28.0571 9.67L28.0591 9.679L28.0601 9.688C28.2631 10.696 28.6861 11.582 29.3911 12.229C30.0501 12.834 30.9181 13.196 31.9841 13.281V14.284C30.6531 14.195 29.6091 13.751 28.8271 13.077L28.0011 12.363V13.456V13.784V14.228H28.0061ZM15.0011 26.465L14.0601 26.228L9.73615 34.263L9.33814 35H10.1761H14.5011H15.0011V34.5V26.465ZM34.8271 34.999H35.6631L35.2661 34.262L29.3441 23.262L29.2021 22.999H28.9041L17.1761 23H16.3381L16.7341 23.737L22.6571 34.737L22.7991 35H23.0981L34.8271 34.999ZM16.9411 26.231L16.0011 26.468V34.5V35H16.5011H20.8271H21.6631L21.2661 34.263L16.9411 26.231ZM14.5011 11C16.4341 11 18.0011 12.567 18.0011 14.5C18.0011 16.433 16.4341 18 14.5011 18C12.5681 18 11.0011 16.433 11.0011 14.5C11.0011 12.567 12.5681 11 14.5011 11ZM14.5011 12C13.1201 12 12.0011 13.119 12.0011 14.5C12.0011 15.881 13.1201 17 14.5011 17C15.8821 17 17.0011 15.881 17.0011 14.5C17.0011 13.119 15.8821 12 14.5011 12Z"
                  stroke="#222222"
                />
              </svg>
              <div className="type-title ">Tent</div>
            </button>
            <button
              onClick={() => setType("Tiny home")}
              className={
                selectedBtn === "Tiny home"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M36.8125 7.606L37.7065 9.394L35.2595 10.618V35.5C35.2595 36.554 34.4435 37.418 33.4085 37.494L33.2595 37.5H11.2595C10.2055 37.5 9.3415 36.684 9.2655 35.649L9.2595 35.5V23.618L7.7065 24.394L6.8125 22.606L9.2595 21.383V13.5H11.2595V20.383L36.8125 7.606ZM33.2595 11.618L11.2595 22.618V35.5H17.2595V25.5C17.2595 24.446 18.0755 23.582 19.1105 23.505L19.2595 23.5H25.2595C26.3135 23.5 27.1775 24.316 27.2545 25.351L27.2595 25.5V35.5H33.2595V11.618ZM25.2595 25.5H19.2595V35.5H25.2595V25.5ZM30.2595 17.5C30.8115 17.5 31.2595 17.948 31.2595 18.5C31.2595 19.052 30.8115 19.5 30.2595 19.5C29.7075 19.5 29.2595 19.052 29.2595 18.5C29.2595 17.948 29.7075 17.5 30.2595 17.5Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Tiny home</div>
            </button>
            <button
              onClick={() => setType("Tower")}
              className={
                selectedBtn === "Tower"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7.5 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.625 37V35H14.624L14.625 16H12.625C11.65 16 11.27 14.765 12.015 14.206L12.111 14.143L22.111 8.143C22.246 8.06201 22.399 8.01401 22.556 8.00301C22.714 7.992 22.872 8.018 23.017 8.08001L23.139 8.143L33.139 14.143C33.976 14.644 33.666 15.898 32.739 15.994L32.625 16H30.625L30.624 35H36.625V37H8.625ZM28.624 35L28.625 16H16.625L16.624 35H18.625V33C18.625 31.956 19.033 30.954 19.761 30.207C20.49 29.46 21.482 29.027 22.525 29.001C23.568 28.975 24.58 29.358 25.345 30.067C26.11 30.777 26.568 31.758 26.62 32.8L26.625 33V35H28.624ZM22.625 31C22.12 31 21.634 31.19 21.264 31.533C20.895 31.877 20.668 32.347 20.63 32.85L20.625 33V35H24.625V33C24.625 32.47 24.414 31.961 24.039 31.586C23.664 31.211 23.155 31 22.625 31ZM22.625 20C22.89 20 23.145 20.105 23.332 20.293C23.52 20.48 23.625 20.735 23.625 21C23.625 21.265 23.52 21.52 23.332 21.707C23.145 21.895 22.89 22 22.625 22C22.36 22 22.105 21.895 21.918 21.707C21.73 21.52 21.625 21.265 21.625 21C21.625 20.735 21.73 20.48 21.918 20.293C22.105 20.105 22.36 20 22.625 20ZM22.625 10.166L16.234 14H29.015L22.625 10.166Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Tower</div>
            </button>
            <button
              onClick={() => setType("Treehouse")}
              className={
                selectedBtn === "Treehouse"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.361 8.067L23.474 8.12L36.474 15.12L35.526 16.88L33 15.52V24.999L37 25V27L32.37 26.999L26 32.459V37H24V35L22 34.999V37H20V32.46L13.629 26.999L9 27V25L13 24.999V15.519L10.474 16.88L9.526 15.12L22.526 8.12C22.785 7.98 23.09 7.963 23.361 8.067ZM22 30.999V32.999L24 33V31L22 30.999ZM20 26.999H16.702L20 29.826V26.999ZM29.297 26.999H26V29.825L29.297 26.999ZM24 26.999H22V28.999L24 29V26.999ZM24 20H22V25H24V20ZM23 10.135L15 14.442V24.999H20V19C20 18.487 20.386 18.064 20.883 18.007L21 18H25C25.513 18 25.936 18.386 25.993 18.883L26 19V24.999H31V14.443L23 10.135ZM23 13C23.552 13 24 13.448 24 14C24 14.552 23.552 15 23 15C22.448 15 22 14.552 22 14C22 13.448 22.448 13 23 13Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Treehouse</div>
            </button>
            <button
              onClick={() => setType("Trullo")}
              className={
                selectedBtn === "Trullo"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.7836 36.501C13.2786 36.501 12.7926 36.31 12.4226 35.966C12.0526 35.623 11.8266 35.153 11.7886 34.65L11.7836 34.501V25.501H9.99964C9.63064 25.501 9.26764 25.399 8.95364 25.205C8.63864 25.012 8.38364 24.735 8.21664 24.406C8.04864 24.076 7.97664 23.707 8.00664 23.339C8.03664 22.971 8.16764 22.618 8.38564 22.32L8.49964 22.177L16.1296 13.527L16.1126 13.509L16.2546 13.387L19.0346 10.238C19.4926 9.72003 20.0526 9.30103 20.6796 9.01003C21.3076 8.71903 21.9886 8.56203 22.6796 8.54803C23.3716 8.53403 24.0576 8.66303 24.6966 8.92803C25.3356 9.19203 25.9126 9.58603 26.3916 10.085L26.5326 10.238L29.3106 13.387L29.4546 13.509L29.4366 13.529L37.0666 22.177C37.3976 22.552 37.5766 23.038 37.5666 23.538C37.5576 24.039 37.3606 24.517 37.0156 24.88L36.8906 25.001C36.5716 25.282 36.1726 25.453 35.7496 25.492L35.5676 25.501H33.7836V34.501C33.7836 35.006 33.5936 35.492 33.2506 35.861C32.9066 36.231 32.4366 36.458 31.9336 36.496L31.7836 36.501H13.7836ZM31.7836 25.501H13.7836V34.501H18.7836V31.501C18.7836 30.475 19.1776 29.488 19.8856 28.744C20.5926 28.001 21.5586 27.556 22.5836 27.505L22.7836 27.501C23.8096 27.501 24.7966 27.894 25.5406 28.602C26.2836 29.309 26.7276 30.276 26.7786 31.301L26.7836 31.501V34.501H31.7836V25.501ZM22.7836 29.501C22.2786 29.501 21.7926 29.69 21.4226 30.033C21.0526 30.377 20.8266 30.847 20.7886 31.35L20.7836 31.501V34.501H24.7836V31.501C24.7836 31.023 24.6126 30.56 24.3016 30.197C23.9896 29.835 23.5586 29.596 23.0866 29.524L22.9326 29.505L22.7836 29.501ZM26.7836 19.501C26.2816 19.501 25.8036 19.676 25.4546 19.992C24.7206 20.647 23.7686 21.007 22.7846 21.001C21.7996 21.007 20.8476 20.648 20.1126 19.992C19.7446 19.67 19.2716 19.495 18.7826 19.501C18.2946 19.495 17.8216 19.671 17.4546 19.992C16.7206 20.648 15.7686 21.009 14.7836 21.003C14.0516 21.005 13.3326 20.807 12.7046 20.432L9.99964 23.501H35.5676L32.8606 20.432C32.2406 20.805 31.5206 21.001 30.7836 21.001C29.7996 21.007 28.8476 20.647 28.1136 19.992C27.7466 19.669 27.2726 19.495 26.7836 19.501ZM26.7836 14.501C26.2946 14.495 25.8206 14.669 25.4536 14.992C24.7186 15.647 23.7676 16.007 22.7836 16.001C21.7996 16.007 20.8476 15.647 20.1126 14.992C19.7456 14.669 19.2716 14.495 18.7826 14.501C18.3576 14.501 17.9506 14.626 17.6236 14.857L14.0776 18.88C14.2986 18.96 14.5376 19.001 14.7836 19.001C15.2866 19.001 15.7636 18.825 16.1126 18.509C16.8476 17.854 17.7986 17.495 18.7826 17.501C19.7726 17.501 20.7286 17.852 21.4546 18.509C21.8046 18.825 22.2816 19.001 22.7846 19.001C23.2866 19.001 23.7636 18.825 24.1126 18.509C24.8476 17.854 25.7986 17.495 26.7836 17.501C27.7736 17.501 28.7296 17.852 29.4556 18.509C29.8056 18.825 30.2816 19.001 30.7846 19.001C31.0306 19.001 31.2696 18.959 31.4906 18.88L27.9436 14.856C27.6026 14.621 27.1976 14.498 26.7836 14.501ZM20.6636 11.423L20.5336 11.561L19.6276 12.587C20.2206 12.709 20.7786 12.967 21.2556 13.341L21.4546 13.509C21.8046 13.825 22.2806 14.001 22.7846 14.001C23.2236 14.001 23.6446 13.867 23.9756 13.621L24.1126 13.509C24.6286 13.045 25.2596 12.727 25.9396 12.587L25.0336 11.561L24.9046 11.425L24.7686 11.296L24.6226 11.177C24.0726 10.75 23.3906 10.528 22.6946 10.548C21.9976 10.569 21.3306 10.831 20.8066 11.29L20.6636 11.423Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Trullo</div>
            </button>
            <button
              onClick={() => setType("Windmill")}
              className={
                selectedBtn === "Windmill"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="13 2 31 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 39.997H37"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-miterlimit="10"
                />
                <path
                  d="M14.875 39.5373L19.184 22"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M30.733 39.762L26.426 22.1151L26.4427 22.1833"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.0811 34.4861H29.1381"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-miterlimit="10"
                />
                <path
                  d="M31.675 8.83L28.845 6L22.776 12.069L16.705 6L13.875 8.83L19.944 14.899L13.875 20.97L16.705 23.8L22.776 17.729L28.845 23.8L31.675 20.97L25.606 14.899L31.675 8.83Z"
                  stroke="#222222"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="type-title ">Windmill</div>
            </button>
            <button
              onClick={() => setType("Yurt")}
              className={
                selectedBtn === "Yurt"
                  ? "btn-type-apt btn-type-selected"
                  : "btn-type-apt"
              }
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.737 9.27898C22.102 9.10898 22.497 9.01498 22.899 9.00098C23.301 8.98798 23.702 9.05498 24.077 9.19898L24.263 9.27898L36.843 15.119C37.165 15.269 37.441 15.502 37.643 15.794C37.846 16.086 37.967 16.425 37.994 16.779L38 16.934V19.796C38 19.958 37.961 20.118 37.885 20.262C37.809 20.406 37.7 20.529 37.566 20.621C37.854 21.336 38 22.063 38 22.796C38 23.726 37.765 24.643 37.306 25.544L37.164 25.809L37.256 25.992C37.715 26.959 37.958 28.107 37.995 29.43L38 29.796C38 31.59 37.642 33.381 36.929 35.165C36.863 35.332 36.753 35.478 36.61 35.587C36.468 35.697 36.299 35.766 36.121 35.788L36 35.796H10C9.814 35.796 9.632 35.743 9.474 35.645C9.317 35.548 9.189 35.408 9.106 35.242C8.364 33.758 8 31.941 8 29.796C8 28.115 8.22 26.814 8.71 25.889L8.797 25.736L8.694 25.544C8.281 24.733 8.049 23.908 8.007 23.074L8 22.796C8 22.063 8.146 21.335 8.433 20.619C8.317 20.539 8.219 20.436 8.146 20.315C8.073 20.195 8.026 20.061 8.008 19.921L8 19.796V16.934C8 16.579 8.095 16.23 8.274 15.923C8.453 15.617 8.711 15.364 9.02 15.19L9.158 15.121L21.737 9.27898ZM35.826 31.796H10.136C10.228 32.432 10.368 33.013 10.554 33.542L10.65 33.796H35.304L35.38 33.579C35.575 32.983 35.724 32.389 35.827 31.796H35.826ZM26 20.796H20V29.796H26V20.796ZM35.44 20.796H28V29.796H36C36 28.566 35.803 27.569 35.423 26.796H30V24.796H35.44C35.817 24.112 36 23.448 36 22.796C36 22.144 35.817 21.48 35.44 20.796ZM18 20.796H10.56C10.184 21.481 10 22.146 10 22.796C10 23.446 10.183 24.112 10.56 24.796H16V26.796H10.493C10.187 27.346 10 28.35 10 29.796H18V20.796ZM23 22.796C23.265 22.796 23.52 22.901 23.707 23.089C23.895 23.276 24 23.531 24 23.796C24 24.061 23.895 24.316 23.707 24.503C23.52 24.691 23.265 24.796 23 24.796C22.735 24.796 22.48 24.691 22.293 24.503C22.105 24.316 22 24.061 22 23.796C22 23.531 22.105 23.276 22.293 23.089C22.48 22.901 22.735 22.796 23 22.796ZM23.421 11.093C23.194 10.987 22.935 10.972 22.696 11.048L22.579 11.093L10 16.934V18.796H36V16.934L23.421 11.093Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Yurt</div>
            </button>
          </div>
        </section>
      )}
      {sectionProgress === 3 && (
        <section className="new-stay-container step-3">
          <div className="fw600 fs22"> Step 3</div>
          <div className="step-3-content">
            <div className="step-3-title fs32 fw600">
              What type of place will guests have?
            </div>
            <div className="btns-container  flex column">
              
              <button onClick={()=> setStayPlace('An entire place')} className={
                (selectedStayPlace === "An entire place"?"btn-type-selected":" ") +" btn-opt flex justify-between align-center"}>
                <div className="btn-describe flex column">
                  <div className="btn-title ">An entire place</div>
                  <div className="btn-content ">
                    Guests have the whole place to themselves.
                  </div>
                </div>

                <svg
                  width="2rem"
                  height="2rem"
                  viewBox="7 6 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.155 8.78099L24.33 8.94499L37.402 21.787L36 23.213L34.2 21.445L34.201 35C34.201 36.054 33.385 36.918 32.35 36.994L32.201 37H12.201C11.147 37 10.283 36.184 10.206 35.149L10.201 35L10.2 21.446L8.402 23.213L7 21.787L20.058 8.95799C21.171 7.82199 22.966 7.75899 24.155 8.78099ZM21.569 10.285L21.473 10.372L12.2 19.481L12.201 35L17.2 34.999L17.201 25C17.201 23.946 18.017 23.082 19.052 23.005L19.201 23H25.201C26.255 23 27.119 23.816 27.196 24.851L27.201 25L27.2 34.999L32.201 35L32.2 19.48L22.901 10.344C22.537 9.98699 21.969 9.96499 21.569 10.285ZM25.201 25H19.201L19.2 34.999H25.2L25.201 25Z"
                    fill="#222222"
                  />
                </svg>
              </button>
              <button onClick={()=> setStayPlace('A room')} className={
                (selectedStayPlace === "A room"?"btn-type-selected":" ") +" btn-opt flex justify-between align-center"}>
                <div className="btn-describe flex column">
                  <div className="btn-title ">A room</div>
                  <div className="btn-content ">
                  Guests have their own room in a home, plus access to shared spaces.
                  </div>
                </div>

                <LuDoorOpen size="2rem" />
              </button>
              <button onClick={()=> setStayPlace('A shared room')} className={
                (selectedStayPlace === "A shared room"?"btn-type-selected":" ") +" btn-opt flex justify-between align-center"}>
                <div className="btn-describe flex column">
                  <div className="btn-title ">A shared room</div>
                  <div className="btn-content ">
                  Guests sleep in a room or common area that may be shared with you or others.
                  </div>
                </div>

                <svg
                  width="2rem"
                  height="2rem"
                  viewBox="7 6 31 31"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.155 8.78099L24.33 8.94499L37.402 21.787L36 23.213L34.2 21.445L34.201 35C34.201 36.054 33.385 36.918 32.35 36.994L32.201 37H12.201C11.147 37 10.283 36.184 10.206 35.149L10.201 35L10.2 21.446L8.402 23.213L7 21.787L20.058 8.95799C21.171 7.82199 22.966 7.75899 24.155 8.78099ZM21.569 10.285L21.473 10.372L12.2 19.481L12.201 35L17.2 34.999L17.201 25C17.201 23.946 18.017 23.082 19.052 23.005L19.201 23H25.201C26.255 23 27.119 23.816 27.196 24.851L27.201 25L27.2 34.999L32.201 35L32.2 19.48L22.901 10.344C22.537 9.98699 21.969 9.96499 21.569 10.285ZM25.201 25H19.201L19.2 34.999H25.2L25.201 25Z"
                    fill="#222222"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
      )}
      {sectionProgress === 4 && (
        <section className="new-stay-container step-4">
          <div className="fw600 fs22"> Step 4</div>
          <div className="step-4-title fs30 fw600">Where's your place located?</div>
          <p className="fs18">
          Your address is only shared with guests after they’ve made a reservation.
          </p>
          <div className="loc-step-container">
          <label className="flex column">
              <span>Continent :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.area}
                onChange={handleChange}
                type="text"
                name="area"
                placeholder="Europe"
              />
            </label>
            <label className="flex column">
              <span>Country :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.country}
                onChange={handleChange}
                type="text"
                name="country"
                placeholder="Italy"
              />
            </label>
            <label className="flex column">
              <span>City :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.city}
                onChange={handleChange}
                type="text"
                name="city"
                placeholder="Milano"
              />
            </label>
            <label className="flex column">
              <span>Address :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.address}
                onChange={handleChange}
                type="text"
                name="address"
                placeholder="Via Brera 74"
              />
            </label>
          </div>
          <div className="map-new-stay">
          <SimpleMap lat={cords.lat} lng={cords.lng} marker={"Your Stay"} />
          </div>
        </section>
      )}
      {sectionProgress === 5 && (
        <section className="new-stay-container step-5">
          <div className="fw600 fs22"> Step 5</div>
          <div className="step-5-title fs28 fw600">Share some basics about your place</div>
          <p className="fs18">
          You'll add more details later, like bed types.
          </p>
          <div className="basics-step-container">
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Guests</div>
              <div className="basic-btns flex align-center">
                <button className={`btn-basic ${valueGuests===0?"basic-not-allowed":""}`} onClick={()=>setBasic('guests', -1)}><i className="fa-solid fa-minus"></i></button>
                <div className="basic-value">{valueGuests}</div>
                <button className="btn-basic" onClick={()=>setBasic('guests', 1)}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Bedrooms</div>
              <div className="basic-btns flex align-center">
                <button className={`btn-basic ${valueBedrooms===0?"basic-not-allowed":""}`} onClick={()=>setBasic('bedrooms', -1)}><i className="fa-solid fa-minus"></i></button>
                <div className="basic-value">{valueBedrooms}</div>
                <button className="btn-basic" onClick={()=>setBasic('bedrooms', 1)}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Beds</div>
              <div className="basic-btns flex align-center">
                <button className={`btn-basic ${valueBeds===0?"basic-not-allowed":""}`} onClick={()=>setBasic('beds', -1)}><i className="fa-solid fa-minus"></i></button>
                <div className="basic-value">{valueBeds}</div>
                <button className="btn-basic" onClick={()=>setBasic('beds', 1)}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>
            <div className="basic basic-last flex justify-between align-center fs18">
              <div className="basic-title ">Bathrooms</div>
              <div className="basic-btns flex align-center">
                <button className={`btn-basic ${valueBathrooms===0?"basic-not-allowed":""}`} onClick={()=>setBasic('bathrooms', -1)}><i className="fa-solid fa-minus"></i></button>
                <div className="basic-value">{valueBathrooms}</div>
                <button className="btn-basic" onClick={()=>setBasic('bathrooms', 1)}><i className="fa-solid fa-plus"></i></button>
              </div>
            </div>
            
          </div>
        </section>
      )}
      {sectionProgress === 6 && (
        <section className="new-stay-container step-1">
          <div className="fw600 fs22"> Step 6</div>
          <div className="step-6-title fs30 fw600">Make your place stand out</div>
          <p className="fs18">
          In this step, you’ll add some of the amenities your place offers, plus 5 or more photos. Then, you’ll create a title and description.
          </p>
          <div className="video-step-container">
            <video
              className="video-step"
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              muted
              autoPlay
            >
              <source src="https://stream.media.muscache.com/H0101WTUG2qWbyFhy02jlOggSkpsM9H02VOWN52g02oxhDVM.mp4?v_q=high" type="video/mp4" />
            </video>
          </div>
        </section>
      )}
      {sectionProgress === 7 && (
        <section className="new-stay-container step-7">
          <div className="fw600 fs22"> Step 7</div>
          <div className="step-6-title fs30 fw600">Tell guests what your place has to offer</div>
          <p className="fs18">
          You can add more amenities after you publish your listing.
          </p>
          <div className="video-step-container">
            
          </div>
        </section>
      )}
      <section className="footer flex column">
        <div>
          <div className={"progress-" + sectionProgress}>------------</div>
        </div>

        {sectionProgress !== 1 && (
          <button className="btn-back-level" onClick={() => changeSection(-1)}>
            Back
          </button>
        )}
        <button className="btn-next-level" onClick={() => changeSection(1)}>
          Next
        </button>
      </section>
    </section>
  )
  return (
    <section className="edit-main-container">
      <h1>Edit / Add Stay</h1>

      <form className="edit-form-container">
        <section className="flex column">
          <div className="flex justify-between">
            <label className="flex column">
              <span>Title :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.name}
                onChange={handleChange}
                type="text"
                name="name"
                placeholder="The Island House"
              />
            </label>
            <label className="flex column">
              <span>Discount :</span>
              <select onChange={handleChange} type="number" name="discount">
                <option value="0">No discount</option>
                <option value="10">10%</option>
                <option value="15">15%</option>
                <option value="20">20%</option>
              </select>
            </label>
            <label onChange={handleChange} className="flex column">
              <span>Type of place :</span>
              <select name="stayPlace">
                <option value="An entire place">An entire place</option>
                <option value="private room">A private room</option>
                <option value="shared room">A shared room</option>
              </select>
            </label>

            <label onChange={handleChange} className="flex column">
              <span>Price per night:</span>
              <input
                className="edit-input price-input"
                value={stayToEdit.price}
                min="0"
                onChange={handleChange}
                type="number"
                name="price"
                placeholder="300"
              />
            </label>
          </div>
        </section>
        <section className="flex column">
          <div className="flex justify-between">
            <label className="flex column">
              <span>Type :</span>
              <select onChange={handleChange} name="type">
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Barn">Barn</option>
                <option value="Bed & breakfast">Bed & breakfast</option>
                <option value="Boat">Boat</option>
                <option value="Cabin">Cabin</option>
                <option value="Camper/RV">Camper/RV</option>
                <option value="Casa particular">Casa particular</option>
                <option value="Castle">Castle</option>
                <option value="Cave">Cave</option>
                <option value="Container">Container</option>
                <option value="Cycladic home">Cycladic home</option>
                <option value="Dammuso">Dammuso</option>
                <option value="Dome">Dome</option>
                <option value="Earth home">Earth home</option>
                <option value="Farm">Farm</option>
                <option value="Guesthouse">Guesthouse</option>
                <option value="Hotel">Hotel</option>
                <option value="Houseboat">Houseboat</option>
                <option value="Kezhan">Kezhan</option>
                <option value="Minsu">Minsu</option>
                <option value="Raid">Raid</option>
                <option value="Ryokan">Ryokan</option>
                <option value="Shepherd's hut">Shepherd's hut</option>
                <option value="Tent">Tent</option>
                <option value="Tiny home">Tiny home</option>
                <option value="Tower">Tower</option>
                <option value="Treehouse">Treehouse</option>
                <option value="Trullo">Trullo</option>
                <option value="Windmill">Windmill</option>
                <option value="Yurt">Yurt</option>
              </select>
            </label>
            <label className="flex column">
              <span>Amenities :</span>
              <select onChange={handleChange} name="amenities" multiple>
                <option value="Wifi">Wifi</option>
                <option value="TV">TV</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Washer">Washer</option>
                <option value="Free parking on premises">
                  Free parking on premises
                </option>
                <option value="Paid parking on premises">
                  Paid parking on premises
                </option>
                <option value="Air conditioning">Air conditioning</option>
                <option value="Dedicated workspace">Dedicated workspace</option>
                <option value="Pool">Pool</option>
                <option value="Hot tub">Hot tub</option>
                <option value="Patio">Patio</option>
                <option value="BBQ grill">BBQ grill</option>
                <option value="Outdoor dining area">Outdoor dining area</option>
                <option value="Fire pit">Fire pit</option>
                <option value="Pool table">Pool table</option>
                <option value="Indoor fireplace">Indoor fireplace</option>
                <option value="Piano">Piano</option>
                <option value="Exercise equipment">Exercise equipment</option>
                <option value="Lake access">Lake access</option>
                <option value="Beach access">Beach access</option>
                <option value="Ski-in/Ski-out">Ski-in/Ski-out</option>
                <option value="Outdoor shower">Outdoor shower</option>
                <option value="Smoke alarm">Smoke alarm</option>
                <option value="First aid kit">First aid kit</option>
                <option value="Fire extinguisher">Fire extinguisher</option>
                <option value="Carbon monoxide alarm">
                  Carbon monoxide alarm
                </option>
                <option value="Smoke allowed">Smoke allowed</option>
              </select>
            </label>

            <label className="flex column">
              <span>Highlights </span>
              <select onChange={handleChange} name="highlights" multiple>
                <option value="Peaceful">Peaceful</option>
                <option value="Unique">Unique</option>
                <option value="Family-friendly">Family-friendly</option>
                <option value="Stylish">Stylish</option>
                <option value="Central">Central</option>
                <option value="Spacious">Spacious</option>
              </select>
            </label>
          </div>
        </section>
        <section className="flex column">
          <span>Location</span>
          <div className="flex justify-between">
            <label className="flex column">
              <span>Continent :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.area.value}
                onChange={handleChange}
                type="text"
                name="area"
                placeholder="Europe"
              />
            </label>
            <label className="flex column">
              <span>Country :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.country.value}
                onChange={handleChange}
                type="text"
                name="country"
                placeholder="Italy"
              />
            </label>
            <label className="flex column">
              <span>City :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.city.value}
                onChange={handleChange}
                type="text"
                name="city"
                placeholder="Milano"
              />
            </label>
            <label className="flex column">
              <span>Address :</span>
              <input
                className="edit-input name-input"
                value={stayToEdit.loc.address.value}
                onChange={handleChange}
                type="text"
                name="address"
                placeholder="Via Brera 74"
              />
            </label>
          </div>
        </section>

        <section className="flex column">
          <span>Stay Details</span>
          <div className="flex justify-between">
            <label className="flex column">
              <span>Capacity :</span>
              <input
                className="edit-input price-input"
                value={stayToEdit.stayDetail.capacity.value}
                min="0"
                onChange={handleChange}
                type="number"
                name="capacity"
                placeholder="2"
              />
            </label>
            <label className="flex column">
              <span>Rooms :</span>
              <input
                className="edit-input price-input"
                value={stayToEdit.stayDetail.rooms.value}
                min="0"
                onChange={handleChange}
                type="number"
                name="rooms"
                placeholder="1"
              />
            </label>
            <label className="flex column">
              <span>Beds :</span>
              <input
                className="edit-input price-input"
                value={stayToEdit.stayDetail.beds.value}
                min="0"
                onChange={handleChange}
                type="number"
                name="beds"
                placeholder="1"
              />
            </label>
            <label className="flex column">
              <span>Bathrooms :</span>
              <input
                className="edit-input price-input"
                value={stayToEdit.stayDetail.bathrooms.value}
                min="0"
                onChange={handleChange}
                type="number"
                name="bathrooms"
                placeholder="1"
              />
            </label>
          </div>
        </section>
        <section></section>

        <button onClick={onSave}>Save</button>
      </form>
    </section>
  )
}
