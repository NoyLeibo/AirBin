import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { stayService } from "../services/stay.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { addStay,updateStay, } from "../store/stay.actions.js"
import SimpleMap from "../cmps/GoogleMap"
import "@fortawesome/fontawesome-free/css/all.min.css"
import {ImgUploader} from '../cmps/ImgUploader.jsx'
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

import { FaPeopleGroup } from "react-icons/fa6"
import { LuDoorOpen } from "react-icons/lu"
import { GiCampfire } from "react-icons/gi"
import { CiCalendar } from "react-icons/ci"
import { GoChecklist } from "react-icons/go"
import { GoPencil } from "react-icons/go"
import { IoCafeOutline } from "react-icons/io5"

export function StayEdit() {
  const isLoading = useSelector((storeState) => storeState.stayModule.isLoading)
  const [stayToEdit, setStayToEdit] = useState(stayService.getEmptyStay())
  const apiKey = "AIzaSyB0dUlJsQSAuB636Yc1NGBUaJbwvYjfS1s"

  const [sectionProgress, setSectionProgress] = useState(0)
  const [selectedBtn, setSelectedBtn] = useState("")
  const [selectedBtnAment, setSelectedBtnAment] = useState(stayToEdit.amenities)
  const [selectedRoomType, setSelectedBtnRoomType] = useState("")
  const [cords, setCords] = useState({ lat: 32.109333, lng: 34.855499 })
  const [valueGuests, setValueGuests] = useState(stayToEdit.capacity)
  const [valueBedrooms, setValueBedrooms] = useState(stayToEdit.rooms)
  const [valueBeds, setValueBeds] = useState(stayToEdit.beds|| 0)
  const [valueBathrooms, setValueBathrooms] = useState(stayToEdit.bathrooms)
  
  const { stayId } = useParams()
  const navigate = useNavigate()
  const user = useSelector((storeState) => storeState.userModule.user)
  // console.log(stayToEdit, cords, valueGuests, "startttt")
  // console.log(stayToEdit.imgUrls)

  useEffect(() => {
    document.documentElement.style.setProperty("--main-layout-width", "1500px")
    if (!stayId){
      setHost()
      return 
    } 
    stayService.getById(stayId).then((stay) => {
      setStayToEdit(stay)
    })
  }, [])

  function setHost(){
    stayToEdit.host._id=user._id
    stayToEdit.host.fullname=user.fullname
    stayToEdit.host.thumbnailUrl=user.imgUrl
    setStayToEdit(stayToEdit)
  }
console.log(user,'user' ,stayToEdit);
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
    } else {
      setStayToEdit((prevStay) => ({
        ...prevStay,
        [field]: newValue,
      }))
    }
    if (
      stayToEdit.loc.country &&
      stayToEdit.loc.city &&
      stayToEdit.loc.address
    ) {
      let stayAddress =
        stayToEdit.loc.country +
        " " +
        stayToEdit.loc.city +
        " " +
        stayToEdit.loc.address
      getLatLngFromAddress(stayAddress)
    }
    // console.log(ev.target, field, newValue)
  }

  async function onSave() {
    
    const newStay = { ...stayToEdit }
    // console.log(newStay);
  
    try {
      if(newStay._id){
        await updateStay(newStay)
      }else{
        await addStay(newStay)
      }
      // console.log('success');
      showSuccessMsg("Stay saved successfully")
      navigate("/")
    } catch (err) {
      // console.log('err',err);
      showErrorMsg("Cannot save Stay, please try again")
    }
  }
  function addImgStay(imgUrl) {
    stayToEdit.imgUrls.push(imgUrl)
    setStayToEdit(stayToEdit)
  }

  function deleteImgStay(idmImg){

    stayToEdit.imgUrls.splice(idmImg, 1)
    setStayToEdit({ ...stayToEdit, imgUrls: stayToEdit.imgUrls })
  }
  function changeSection(diff) {
    const step = diff + sectionProgress
    setSectionProgress(step)
  }

  function setType(type) {
    // console.log(stayToEdit.type, type, selectedBtn)
    if (stayToEdit.type === type) {
      // console.log("unset")
      stayToEdit.type = ""
      setStayToEdit(stayToEdit)
      setSelectedBtn("")
    } else {
      // console.log("set")
      stayToEdit.type = type
      setStayToEdit(stayToEdit)
      setSelectedBtn(type)
    }
  }

  function setAmenities(Amenitie) {
    // console.log(stayToEdit.amenities, Amenitie, selectedBtnAment)

    const isAmenitieSelected = stayToEdit.amenities.includes(Amenitie)

    if (isAmenitieSelected) {
      const idxAmen = stayToEdit.amenities.findIndex((amt) => amt === Amenitie)
      stayToEdit.amenities.splice(idxAmen, 1)
      // console.log("unset", selectedBtnAment, idxAmen, stayToEdit.amenities)
    } else {
      stayToEdit.amenities.push(Amenitie)
      // console.log("set", selectedBtnAment, stayToEdit.amenities)
    }
    setStayToEdit({ ...stayToEdit, amenities: stayToEdit.amenities })
    setSelectedBtnAment(stayToEdit.amenities)

    // console.log(selectedBtnAment.includes("Wifi"))
  }

  function setRoomType(roomType) {
    // console.log(stayToEdit.roomType, roomType, selectedBtn)
    if (stayToEdit.roomType === roomType) {
      // console.log("unset")
      stayToEdit.roomType = ""
      setStayToEdit(stayToEdit)
      setSelectedBtnRoomType("")
    } else {
      // console.log("set")
      stayToEdit.roomType = roomType
      setStayToEdit(stayToEdit)
      setSelectedBtnRoomType(roomType)
    }
  }

  function setBasic(type, diff) {
    if (type === "guests") {
      if (stayToEdit.capacity >= 0 && diff === 1) {
        stayToEdit.capacity = stayToEdit.capacity + diff
        setValueGuests(stayToEdit.capacity)
        setStayToEdit(stayToEdit)
      } else if (stayToEdit.capacity > 0) {
        stayToEdit.capacity = stayToEdit.capacity + diff
        setValueGuests(stayToEdit.capacity)
        setStayToEdit(stayToEdit)
      }
    }
    if (type === "bedrooms") {
      if (stayToEdit.rooms >= 0 && diff === 1) {
        stayToEdit.rooms = stayToEdit.rooms + diff
        setValueBedrooms(stayToEdit.rooms)
        setStayToEdit(stayToEdit)
      } else if (stayToEdit.rooms > 0) {
        stayToEdit.rooms = stayToEdit.rooms + diff
        setValueBedrooms(stayToEdit.rooms)
        setStayToEdit(stayToEdit)
      }
    }
    if (type === "beds") {
      if (stayToEdit.beds >= 0 && diff === 1) {
        stayToEdit.beds = stayToEdit.beds + diff
        setValueBeds(stayToEdit.beds)
        setStayToEdit(stayToEdit)
      } else if (stayToEdit.beds > 0) {
        stayToEdit.beds = stayToEdit.beds + diff
        setValueBeds(stayToEdit.beds)
        setStayToEdit(stayToEdit)
      }
    }
    if (type === "bathrooms") {
      if (stayToEdit.bathrooms >= 0 && diff === 1) {
        stayToEdit.bathrooms = stayToEdit.bathrooms + diff
        setValueBathrooms(stayToEdit.bathrooms)
        setStayToEdit(stayToEdit)
      } else if (stayToEdit.bathrooms > 0) {
        stayToEdit.bathrooms = stayToEdit.bathrooms + diff
        setValueBathrooms(stayToEdit.bathrooms)
        setStayToEdit(stayToEdit)
      }
    }
  }

  const getLatLngFromAddress = (address) => {
    // console.log(address);
    const encodedAddress = encodeURIComponent(address)
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location
          // console.log(`Latitude: ${lat}, Longitude: ${lng}`)
          stayToEdit.loc.lat = lat
          stayToEdit.loc.lng = lng
          // setStayToEdit(stayToEdit)
          cords.lat = lat
          cords.lng = lng
          setCords(cords)
        } else {
          // console.log("No results found")
        }
      })
      .catch((error) => {
        console.error("There was a problem fetching the data:", error)
      })
  }

  if (isLoading) {
    // console.log("no stay to edit")
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
      {sectionProgress === 0 && (
        <section className="new-stay-container step-0">
          <div className="step-0-title fs32 fw600">It’s easy to get started on Airbnb</div>
          <div className="steps-container">
            <div className="level-container flex">
              <div className="fs22 fw600 ">1</div>
              <div className="level-content">
                <div className="level-title fs22 fw600">
                     Tell us about your place 
                </div>
                <div className="level-txt graytxt fs18">
                Share some basic info, like where it is and how many guests can stay.
                </div>
              </div>
              <img src="https://a0.muscache.com/4ea/air/v2/pictures/da2e1a40-a92b-449e-8575-d8208cc5d409.jpg"/>
            </div>
            <div className="level-container flex">
              <div className="fs22 fw600 ">2</div>
              <div className="level-content">
                <div className="level-title fs22 fw600">
                Make it stand out 
                </div>
                <div className="level-txt graytxt fs18">
                Add 5 or more photos plus a title and description we’ll help you out.
                </div>
              </div>
              <img src="https://a0.muscache.com/4ea/air/v2/pictures/bfc0bc89-58cb-4525-a26e-7b23b750ee00.jpg"/>
            </div>
            <div className="level-container last flex">
              <div className="fs22 fw600 ">3</div>
              <div className="level-content">
                <div className="level-title fs22 fw600">
                Finish up and publish
                </div>
                <div className="level-txt graytxt fs18">
                Choose if you'd like to start with an experienced guest, set a starting price, and publish your listing.
                </div>
              </div>
              <img src="https://a0.muscache.com/4ea/air/v2/pictures/c0634c73-9109-4710-8968-3e927df1191c.jpg"/>
            </div>
          </div>

        </section>
      )}
      {sectionProgress === 1 && (
        <section className="new-stay-container step-1">
          <div className="fw600 fs22"> Step 1</div>
          <div className="step-1-title">Tell us about your place</div>
          <div className="fs18">
            In this step, we'll ask you which type of property you have and if
            guests will book the entire place or just a room. Then let us know
            the location and how many guests can stay.
          </div>
          <div className="video-step-container">
            <video
              className="video-step"
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              muted
              autoPlay
            >
              <source
                src="https://stream.media.muscache.com/zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek.mp4?v_q=high"
                type="video/mp4"
              />
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
                <path d="M16 24.125V35" stroke="#222222" strokeWidth="2" />
                <path
                  d="M28.004 35.996H27.269H15.998V24.016H28.004V34.63V35.996Z"
                  stroke="#222222"
                  strokeWidth="1.998"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15.998 24.017L28.004 35.997"
                  stroke="#222222"
                  strokeWidth="1.998"
                  strokeMiterlimit="10"
                />
                <path
                  d="M28.004 24.017L15.998 35.997"
                  stroke="#222222"
                  strokeWidth="1.998"
                  strokeMiterlimit="10"
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M27.385 12.504H22.375V8.498H27.385V12.504Z"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M14.875 39.5373L19.184 22"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M30.733 39.762L26.426 22.1151L26.4427 22.1833"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.0811 34.4861H29.1381"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeMiterlimit="10"
                />
                <path
                  d="M31.675 8.83L28.845 6L22.776 12.069L16.705 6L13.875 8.83L19.944 14.899L13.875 20.97L16.705 23.8L22.776 17.729L28.845 23.8L31.675 20.97L25.606 14.899L31.675 8.83Z"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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
              <button
                onClick={() => setRoomType("An entire place")}
                className={
                  (selectedRoomType === "An entire place"
                    ? "btn-type-selected"
                    : " ") + " btn-opt flex justify-between align-center"
                }
              >
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
              <button
                onClick={() => setRoomType("A room")}
                className={
                  (selectedRoomType === "A room" ? "btn-type-selected" : " ") +
                  " btn-opt flex justify-between align-center"
                }
              >
                <div className="btn-describe flex column">
                  <div className="btn-title ">A room</div>
                  <div className="btn-content ">
                    Guests have their own room in a home, plus access to shared
                    spaces.
                  </div>
                </div>

                <LuDoorOpen size="2rem" />
              </button>
              <button
                onClick={() => setRoomType("A shared room")}
                className={
                  (selectedRoomType === "A shared room"
                    ? "btn-type-selected"
                    : " ") + " btn-opt flex justify-between align-center"
                }
              >
                <div className="btn-describe flex column">
                  <div className="btn-title ">A shared room</div>
                  <div className="btn-content ">
                    Guests sleep in a room or common area that may be shared
                    with you or others.
                  </div>
                </div>
                <FaPeopleGroup size="28" />
              </button>
            </div>
          </div>
        </section>
      )}
      {sectionProgress === 4 && (
        <section className="new-stay-container step-4">
          <div className="fw600 fs22"> Step 4</div>
          <div className="step-4-title fs30 fw600">
            Where's your place located?
          </div>
          <p className="fs18">
            Your address is only shared with guests after they’ve made a
            reservation.
          </p>
          <div className="loc-step-container">
            <label className="flex column">
              <span>Continent</span>
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
              <span>Country</span>
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
              <span>City</span>
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
              <span>Address</span>
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
          <div className="step-5-title fs28 fw600">
            Share some basics about your place
          </div>
          <p className="fs18">You'll add more details later, like bed types.</p>
          <div className="basics-step-container">
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Guests</div>
              <div className="basic-btns flex align-center">
                <button
                  className={`btn-basic ${
                    valueGuests === 0 ? "basic-not-allowed" : ""
                  }`}
                  onClick={() => setBasic("guests", -1)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <div className="basic-value">{valueGuests}</div>
                <button
                  className="btn-basic"
                  onClick={() => setBasic("guests", 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Bedrooms</div>
              <div className="basic-btns flex align-center">
                <button
                  className={`btn-basic ${
                    valueBedrooms === 0 ? "basic-not-allowed" : ""
                  }`}
                  onClick={() => setBasic("bedrooms", -1)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <div className="basic-value">{valueBedrooms}</div>
                <button
                  className="btn-basic"
                  onClick={() => setBasic("bedrooms", 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="basic flex justify-between align-center fs18">
              <div className="basic-title ">Beds</div>
              <div className="basic-btns flex align-center">
                <button
                  className={`btn-basic ${
                    valueBeds === 0 ? "basic-not-allowed" : ""
                  }`}
                  onClick={() => setBasic("beds", -1)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <div className="basic-value">{valueBeds}</div>
                <button
                  className="btn-basic"
                  onClick={() => setBasic("beds", 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <div className="basic basic-last flex justify-between align-center fs18">
              <div className="basic-title ">Bathrooms</div>
              <div className="basic-btns flex align-center">
                <button
                  className={`btn-basic ${
                    valueBathrooms === 0 ? "basic-not-allowed" : ""
                  }`}
                  onClick={() => setBasic("bathrooms", -1)}
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <div className="basic-value">{valueBathrooms}</div>
                <button
                  className="btn-basic"
                  onClick={() => setBasic("bathrooms", 1)}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      {sectionProgress === 6 && (
        <section className="new-stay-container step-6">
          <div className="fw600 fs22"> Step 6</div>
          <div className="step-6-title fs30 fw600">
            Make your place stand out
          </div>
          <div className="fs18">
            In this step, you’ll add some of the amenities your place offers,
            plus 5 or more photos. Then, you’ll create a title and description.
          </div>
          <div className="video-step-container">
            <video
              className="video-step"
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              muted
              autoPlay
            >
              <source
                src="https://stream.media.muscache.com/H0101WTUG2qWbyFhy02jlOggSkpsM9H02VOWN52g02oxhDVM.mp4?v_q=high"
                type="video/mp4"
              />
            </video>
          </div>
        </section>
      )}
      {sectionProgress === 7 && (
        <section className="new-stay-container step-7">
          <div className="fw600 fs22"> Step 7</div>
          <div className="step-6-title fs30 fw600">
            Tell guests what your place has to offer
          </div>
          <p className="fs18">
            You can add more amenities after you publish your listing.
          </p>
          <div className="btns-container-new-stay">
            <button
              onClick={() => setAmenities("Wifi")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Wifi") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.3877 30.1472C20.3877 29.034 21.2906 28.1311 22.4038 28.1311C23.517 28.1311 24.4199 29.034 24.4199 30.1472C24.4199 31.2604 23.517 32.1619 22.4038 32.1619C21.2906 32.1619 20.3877 31.2604 20.3877 30.1472ZM26.4345 30.1472C26.4345 27.9208 24.6302 26.1164 22.4038 26.1164C20.1774 26.1164 18.373 27.9208 18.373 30.1472C18.373 32.3736 20.1774 34.1779 22.4038 34.1779C24.6302 34.1779 26.4345 32.3736 26.4345 30.1472Z"
                  fill="#222222"
                />
                <path
                  d="M30.5088 26.073C29.017 23.1091 25.948 21.0776 22.4038 21.0776C18.8595 21.0776 15.7906 23.1105 14.2988 26.073L15.8242 27.5983C16.8463 24.9626 19.4063 23.0923 22.4038 23.0923C25.4013 23.0923 27.9613 24.9626 28.9834 27.5983L30.5088 26.073Z"
                  fill="#222222"
                />
                <path
                  d="M34.1904 22.3913C31.6668 18.5639 27.3304 16.0389 22.4038 16.0389C17.4772 16.0389 13.1408 18.5653 10.6172 22.3913L12.0781 23.8508C14.2021 20.3752 18.0324 18.0549 22.4038 18.0549C26.7766 18.0549 30.6069 20.3752 32.7309 23.8522L34.1904 22.3913Z"
                  fill="#222222"
                />
                <path
                  d="M37.8075 18.7742C34.3208 14.0592 28.7184 11.0001 22.4038 11.0001C16.0892 11.0001 10.4868 14.0592 7 18.7742L8.44406 20.2154C11.5495 15.858 16.6444 13.0161 22.4038 13.0161C28.1632 13.0161 33.2595 15.858 36.3649 20.2168L37.8075 18.7742Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Wifi</div>
            </button>
            <button
              onClick={() => setAmenities("Tv")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Tv") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.862 31.5215H25.793V33.4985H19.862V31.5215ZM15.908 33.4985V35.4755H29.747V33.4985H27.77V31.5215L28.8402 31.5175L29.0551 31.5123C31.6858 31.4002 31.5421 30.3182 28.8837 30.3182L16.4787 30.3274C13.848 30.4394 13.9903 31.5215 16.6487 31.5215H17.885V33.4985H15.908Z"
                  fill="#222222"
                />
                <path
                  d="M12.9425 11.7515H32.7125L32.8865 11.7568C34.443 11.8464 35.678 13.138 35.678 14.717V26.579L35.6727 26.753C35.5831 28.3095 34.2915 29.5445 32.7125 29.5445H12.9425L12.7685 29.5392C11.212 29.4496 9.977 28.158 9.977 26.579V14.717L9.98227 14.543C10.0719 12.9865 11.3635 11.7515 12.9425 11.7515ZM27.77 31.5215H32.7125L32.9273 31.5175C35.5581 31.4055 37.655 29.2374 37.655 26.579V14.717L37.651 14.5022C37.539 11.8714 35.3709 9.7745 32.7125 9.7745H12.9425L12.7277 9.77845C10.0969 9.89048 8 12.0586 8 14.717V26.579L8.00395 26.7938C8.11598 29.4246 10.2841 31.5215 12.9425 31.5215H17.885H27.77Z"
                  fill="#222222"
                />
              </svg>
              <div className="type-title ">Tv</div>
            </button>
            <button
              onClick={() => setAmenities("Kitchen")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Kitchen") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 9.5H35C35.552 9.5 36 9.948 36 10.5V34.5C36 35.052 35.552 35.5 35 35.5H11C10.448 35.5 10 35.052 10 34.5V10.5C10 9.948 10.448 9.5 11 9.5Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path d="M36 17.5H10" stroke="#222222" strokeWidth="2" />
                <path
                  d="M32 12.5C32.552 12.5 33 12.948 33 13.5C33 14.052 32.552 14.5 32 14.5C31.448 14.5 31 14.052 31 13.5C31 12.948 31.448 12.5 32 12.5Z"
                  fill="#222222"
                />
                <path
                  d="M26 12.5C26.552 12.5 27 12.948 27 13.5C27 14.052 26.552 14.5 26 14.5C25.448 14.5 25 14.052 25 13.5C25 12.948 25.448 12.5 26 12.5Z"
                  fill="#222222"
                />
                <path
                  d="M20 12.5C20.552 12.5 21 12.948 21 13.5C21 14.052 20.552 14.5 20 14.5C19.448 14.5 19 14.052 19 13.5C19 12.948 19.448 12.5 20 12.5Z"
                  fill="#222222"
                />
                <path
                  d="M14 12.5C14.552 12.5 15 12.948 15 13.5C15 14.052 14.552 14.5 14 14.5C13.448 14.5 13 14.052 13 13.5C13 12.948 13.448 12.5 14 12.5Z"
                  fill="#222222"
                />
                <path
                  d="M14 21.5H32V31.5H14V21.5Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path d="M36 17.5H10" stroke="#222222" strokeWidth="2" />
              </svg>

              <div className="type-title ">Kitchen</div>
            </button>
            <button
              onClick={() => setAmenities("Washer")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Washer") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_2_1380)">
                  <path
                    d="M55.8141 59.875C55.8141 57.151 55.8141 54.415 55.8141 51.604C55.8141 48.793 55.8141 45.905 55.8141 42.875C55.8141 39.78 56.2261 35.917 56.4321 32.509C56.6381 29.101 56.6371 26.149 55.8141 24.875C55.7481 24.774 55.0751 24.774 54.3791 24.799C53.6841 24.824 52.9661 24.875 52.8141 24.875C48.7041 24.875 48.0151 23.171 45.8141 21.875C43.4831 20.502 42.6641 19.829 39.8141 19.875C33.9331 19.97 31.5791 24.976 26.8141 24.875C21.9711 24.773 18.1401 18.732 13.8141 18.875C9.89213 19.005 6.18913 24.852 1.81413 24.875C-3.36788 24.903 -5.94787 18.856 -10.1859 20.875C-8.45887 34.259 -12.6889 46.588 -10.1859 52.875C-9.66587 54.181 -6.97687 55.681 -5.18587 56.875C-2.65987 58.56 -0.798875 59.883 1.81413 59.875C6.42513 59.861 9.37113 53.817 14.8141 53.875C18.6921 53.916 23.3351 59.983 27.8141 59.875C33.1761 59.745 34.9671 53.69 40.8141 53.875C46.4791 54.055 48.5351 61.867 55.8141 59.875Z"
                    stroke="#222222"
                    strokeWidth="2"
                  />
                  <path
                    d="M10.8141 9.875H34.8141C35.3661 9.875 35.8141 10.323 35.8141 10.875V34.875C35.8141 35.427 35.3661 35.875 34.8141 35.875H10.8141C10.2621 35.875 9.81415 35.427 9.81415 34.875V10.875C9.81415 10.323 10.2621 9.875 10.8141 9.875Z"
                    stroke="#222222"
                    strokeWidth="2"
                  />
                  <path
                    d="M22.8141 14.875C27.2321 14.875 30.8141 18.457 30.8141 22.875C30.8141 27.293 27.2321 30.875 22.8141 30.875C18.3961 30.875 14.8141 27.293 14.8141 22.875C14.8141 18.457 18.3961 14.875 22.8141 14.875Z"
                    stroke="#222222"
                    strokeWidth="2"
                  />
                  <path
                    d="M13.8141 12.875C14.3661 12.875 14.8141 13.323 14.8141 13.875C14.8141 14.427 14.3661 14.875 13.8141 14.875C13.2621 14.875 12.8141 14.427 12.8141 13.875C12.8141 13.323 13.2621 12.875 13.8141 12.875Z"
                    fill="#222222"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2_1380">
                    <rect width="45" height="45" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <div className="type-title ">Washer</div>
            </button>
            <button
              onClick={() => setAmenities("Free parking on premises")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Free parking on premises") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="7 7 31 31"
                fill="none"
                stroke="#222222"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 29.6256H36V32.6256C36 33.1776 35.552 33.6256 35 33.6256H33C32.448 33.6256 32 33.1776 32 32.6256V29.6256Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M10 29.6256H14V32.6256C14 33.1776 13.552 33.6256 13 33.6256H11C10.448 33.6256 10 33.1776 10 32.6256V29.6256Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M14 19.6256H32C34.209 19.6256 36 21.4166 36 23.6256V28.6256C36 29.1776 35.552 29.6256 35 29.6256H11C10.448 29.6256 10 29.1776 10 28.6256V23.6256C10 21.4166 11.791 19.6256 14 19.6256Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M32 23.6256C32.552 23.6256 33 24.0736 33 24.6256C33 25.1776 32.552 25.6256 32 25.6256C31.448 25.6256 31 25.1776 31 24.6256C31 24.0736 31.448 23.6256 32 23.6256Z"
                  fill="#222222"
                />
                <path
                  d="M14 23.6256C14.552 23.6256 15 24.0736 15 24.6256C15 25.1776 14.552 25.6256 14 25.6256C13.448 25.6256 13 25.1776 13 24.6256C13 24.0736 13.448 23.6256 14 23.6256Z"
                  fill="#222222"
                />
                <path
                  d="M15.693 11.6256H30.307C30.724 11.6256 31.097 11.8846 31.243 12.2746L34 19.6256H12L14.757 12.2746C14.903 11.8846 15.276 11.6256 15.693 11.6256Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path d="M9 16.6256H12V18.6256H9V16.6256Z" fill="#222222" />
                <path d="M34 16.6256H37V18.6256H34V16.6256Z" fill="#222222" />
                <path d="M17 24.6256H29" strokeWidth="2" />
              </svg>

              <div className="type-title ">Free parking on premises</div>
            </button>
            <button
              onClick={() => setAmenities("Paid parking on premises")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Paid parking on premises") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg
                width="28px"
                height="28px"
                viewBox="10 12 35 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.6915 13.25C29.3185 13.25 34.6915 19.112 34.6915 24.974C34.6915 29.77 33.0635 34.529 29.8065 39.25H15.5765C12.3195 34.529 10.6915 29.77 10.6915 24.974C10.6915 18.499 16.0645 13.25 22.6915 13.25Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M22.6915 29.875C24.0035 29.875 25.0665 30.938 25.0665 32.25C25.0665 33.562 24.0035 34.625 22.6915 34.625C21.3795 34.625 20.3165 33.562 20.3165 32.25C20.3165 30.938 21.3795 29.875 22.6915 29.875Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M30.6915 25.25C30.6915 20.832 27.1095 17.25 22.6915 17.25C18.2735 17.25 14.6915 20.832 14.6915 25.25C25.3585 25.25 30.6915 25.25 30.6915 25.25Z"
                  stroke="#222222"
                  strokeWidth="2"
                />
                <path
                  d="M22.6915 25.25L25.6915 21.25"
                  stroke="#222222"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.6915 40.25V44.25"
                  stroke="#222222"
                  strokeWidth="2"
                />
              </svg>
              <div className="type-title ">Paid parking on premises</div>
            </button>
            <button
              onClick={() => setAmenities("Air conditioning")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Air conditioning") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.0261 7.548V11.578L27.0521 9.253L28.0521 10.986L23.0261 13.887V20.815L29.0261 17.351V11.548H31.0261V16.196L34.5171 14.182L35.5171 15.914L32.0261 17.929L36.0521 20.253L35.0521 21.986L30.0261 19.083L24.0261 22.547L30.0271 26.012L35.0521 23.11L36.0521 24.842L32.0261 27.166L35.5171 29.182L34.5171 30.914L31.0261 28.899V33.548H29.0261V27.744L23.0261 24.279V31.208L28.0521 34.11L27.0521 35.842L23.0261 33.517V37.548H21.0261V33.517L17.0001 35.842L16.0001 34.11L21.0261 31.208V24.279L15.0261 27.743V33.548H13.0261V28.898L9.53606 30.914L8.53606 29.182L12.0251 27.166L8.00006 24.842L9.00006 23.11L14.0251 26.011L20.0251 22.547L14.0261 19.083L9.00006 21.986L8.00006 20.253L12.0261 17.929L8.53606 15.914L9.53606 14.182L13.0261 16.196V11.548H15.0261V17.351L21.0261 20.815V13.887L16.0001 10.986L17.0001 9.253L21.0261 11.578V7.548H23.0261Z" fill="#222222"/>
            </svg>
              <div className="type-title ">Air conditioning</div>
            </button>
            <button
              onClick={() => setAmenities("Dedicated workspace")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Dedicated workspace") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 22.375H38" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M11 36.375V22.375" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M35 36.375V22.375" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M11 22.375H35V30.375C35 32.032 33.657 33.375 32 33.375H14C12.343 33.375 11 32.032 11 30.375V22.375Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M31 21.375V15.375" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M29 9.375H33L35 16.375H27L29 9.375Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M14 17.375H19V22.375H14V17.375Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M15.792 17.403L14 13.375" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
              <div className="type-title ">Dedicated workspace</div>
            </button>
            <div className="sub-title fs22 fw600">
            Do you have any standout amenities?
          </div>
            <button
              onClick={() => setAmenities("Pool")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Pool") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            ><svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.125 20.375H29.125" stroke="#222222" strokeWidth="2"/>
            <path d="M10.125 16.375H34.125" stroke="#222222" strokeWidth="2"/>
            <path d="M29.125 23.375V13.375C29.125 11.718 27.782 10.375 26.125 10.375C24.468 10.375 23.125 11.718 23.125 13.375M23.125 23.375V13.375C23.125 11.718 21.782 10.375 20.125 10.375C18.468 10.375 17.125 11.718 17.125 13.375" stroke="#222222" strokeWidth="2"/>
            <mask id="mask0_2_1368" mask-type="alpha" maskUnits="userSpaceOnUse" x="2" y="18" width="41" height="21">
            <path d="M42.018 18.2505V38.3975H2V18.2505H42.018Z" fill="#000000"/>
            </mask>
            <g mask="url(#mask0_2_1368)">
            <path d="M10.136 34.852C9.41198 34.852 8.68798 34.602 8.13598 34.102C7.58398 33.602 6.85998 33.352 6.13598 33.352C5.41199 33.352 4.68798 33.602 4.13598 34.102C3.58398 34.602 2.85999 34.852 2.13598 34.852C1.41199 34.852 0.687984 34.602 0.135984 34.102C-0.416016 33.602 -1.14001 33.352 -1.86402 33.352C-2.58801 33.352 -3.31202 33.602 -3.86402 34.102C-4.41602 34.602 -5.14001 34.852 -5.86402 34.852C-6.58801 34.852 -7.31202 34.602 -7.86402 34.102C-8.41602 33.602 -9.14001 33.352 -9.86402 33.352C-10.588 33.352 -11.312 33.602 -11.864 34.102C-12.416 34.602 -13.14 34.852 -13.864 34.852M58.124 34.866C57.4 34.866 56.676 34.616 56.124 34.116C55.572 33.616 54.848 33.366 54.124 33.366C53.4 33.366 52.676 33.616 52.124 34.116C51.572 34.616 50.848 34.866 50.124 34.866C49.4 34.866 48.676 34.616 48.124 34.116C47.572 33.616 46.848 33.366 46.124 33.366C45.4 33.366 44.676 33.616 44.124 34.116C43.572 34.616 42.848 34.866 42.124 34.866C41.4 34.866 40.676 34.616 40.124 34.116C39.572 33.616 38.848 33.366 38.124 33.366C37.4 33.366 36.676 33.616 36.124 34.116C35.572 34.616 34.848 34.866 34.124 34.866M34.125 34.875C33.401 34.875 32.677 34.625 32.125 34.125C31.573 33.625 30.849 33.375 30.125 33.375C29.401 33.375 28.677 33.625 28.125 34.125C27.573 34.625 26.849 34.875 26.125 34.875C25.401 34.875 24.677 34.625 24.125 34.125C23.573 33.625 22.849 33.375 22.125 33.375C21.401 33.375 20.677 33.625 20.125 34.125C19.573 34.625 18.849 34.875 18.125 34.875C17.401 34.875 16.677 34.625 16.125 34.125C15.573 33.625 14.849 33.375 14.125 33.375C13.401 33.375 12.677 33.625 12.125 34.125C11.573 34.625 10.849 34.875 10.125 34.875" stroke="#222222" strokeWidth="2"/>
            <path d="M10.136 29.852C9.41198 29.852 8.68798 29.602 8.13598 29.102C7.58398 28.602 6.85998 28.352 6.13598 28.352C5.41199 28.352 4.68798 28.602 4.13598 29.102C3.58398 29.602 2.85999 29.852 2.13598 29.852C1.41199 29.852 0.687984 29.602 0.135984 29.102C-0.416016 28.602 -1.14001 28.352 -1.86402 28.352C-2.58801 28.352 -3.31202 28.602 -3.86402 29.102C-4.41602 29.602 -5.14001 29.852 -5.86402 29.852C-6.58801 29.852 -7.31202 29.602 -7.86402 29.102C-8.41602 28.602 -9.14001 28.352 -9.86402 28.352C-10.588 28.352 -11.312 28.602 -11.864 29.102C-12.416 29.602 -13.14 29.852 -13.864 29.852M58.124 29.866C57.4 29.866 56.676 29.616 56.124 29.116C55.572 28.616 54.848 28.366 54.124 28.366C53.4 28.366 52.676 28.616 52.124 29.116C51.572 29.616 50.848 29.866 50.124 29.866C49.4 29.866 48.676 29.616 48.124 29.116C47.572 28.616 46.848 28.366 46.124 28.366C45.4 28.366 44.676 28.616 44.124 29.116C43.572 29.616 42.848 29.866 42.124 29.866C41.4 29.866 40.676 29.616 40.124 29.116C39.572 28.616 38.848 28.366 38.124 28.366C37.4 28.366 36.676 28.616 36.124 29.116C35.572 29.616 34.848 29.866 34.124 29.866M34.125 29.875C33.401 29.875 32.677 29.625 32.125 29.125C31.573 28.625 30.849 28.375 30.125 28.375C29.401 28.375 28.677 28.625 28.125 29.125C27.573 29.625 26.849 29.875 26.125 29.875C25.401 29.875 24.677 29.625 24.125 29.125C23.573 28.625 22.849 28.375 22.125 28.375C21.401 28.375 20.677 28.625 20.125 29.125C19.573 29.625 18.849 29.875 18.125 29.875C17.401 29.875 16.677 29.625 16.125 29.125C15.573 28.625 14.849 28.375 14.125 28.375C13.401 28.375 12.677 28.625 12.125 29.125C11.573 29.625 10.849 29.875 10.125 29.875" stroke="#222222" strokeWidth="2"/>
            <path d="M10.136 24.852C9.41198 24.852 8.68798 24.602 8.13598 24.102C7.58398 23.602 6.85998 23.352 6.13598 23.352C5.41199 23.352 4.68798 23.602 4.13598 24.102C3.58398 24.602 2.85999 24.852 2.13598 24.852C1.41199 24.852 0.687984 24.602 0.135984 24.102C-0.416016 23.602 -1.14001 23.352 -1.86402 23.352C-2.58801 23.352 -3.31202 23.602 -3.86402 24.102C-4.41602 24.602 -5.14001 24.852 -5.86402 24.852C-6.58801 24.852 -7.31202 24.602 -7.86402 24.102C-8.41602 23.602 -9.14001 23.352 -9.86402 23.352C-10.588 23.352 -11.312 23.602 -11.864 24.102C-12.416 24.602 -13.14 24.852 -13.864 24.852M58.124 24.866C57.4 24.866 56.676 24.616 56.124 24.116C55.572 23.616 54.848 23.366 54.124 23.366C53.4 23.366 52.676 23.616 52.124 24.116C51.572 24.616 50.848 24.866 50.124 24.866C49.4 24.866 48.676 24.616 48.124 24.116C47.572 23.616 46.848 23.366 46.124 23.366C45.4 23.366 44.676 23.616 44.124 24.116C43.572 24.616 42.848 24.866 42.124 24.866C41.4 24.866 40.676 24.616 40.124 24.116C39.572 23.616 38.848 23.366 38.124 23.366C37.4 23.366 36.676 23.616 36.124 24.116C35.572 24.616 34.848 24.866 34.124 24.866M34.125 24.875C33.401 24.875 32.677 24.625 32.125 24.125C31.573 23.625 30.849 23.375 30.125 23.375C29.401 23.375 28.677 23.625 28.125 24.125C27.573 24.625 26.849 24.875 26.125 24.875C25.401 24.875 24.677 24.625 24.125 24.125C23.573 23.625 22.849 23.375 22.125 23.375C21.401 23.375 20.677 23.625 20.125 24.125C19.573 24.625 18.849 24.875 18.125 24.875C17.401 24.875 16.677 24.625 16.125 24.125C15.573 23.625 14.849 23.375 14.125 23.375C13.401 23.375 12.677 23.625 12.125 24.125C11.573 24.625 10.849 24.875 10.125 24.875" stroke="#222222" strokeWidth="2"/>
            </g>
            </svg>
              <div className="type-title ">Pool</div>
            </button>
            <button
              onClick={() => setAmenities("Hot tub")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Hot tub") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2_1362)">
            <path d="M11 20.5H35V35.5C35 36.052 34.552 36.5 34 36.5H12C11.448 36.5 11 36.052 11 35.5V20.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M38 20.5H35" stroke="#222222" strokeWidth="2"/>
            <path d="M11 20.5H8" stroke="#222222" strokeWidth="2"/>
            <path d="M16.5 8.5C14.019 8.5 12 10.519 12 13C12 15.137 13.5 16.923 15.5 17.38V15.289C14.619 14.902 14 14.023 14 13C14 11.622 15.122 10.5 16.5 10.5C17.878 10.5 19 11.622 19 13C19 14.023 18.381 14.902 17.5 15.289V17.38C19.5 16.923 21 15.137 21 13C21 10.519 18.981 8.5 16.5 8.5Z" fill="#222222"/>
            <path d="M11 20.5C11 18.291 12.791 16.5 15 16.5H14.737H15.434" stroke="#222222" strokeWidth="2"/>
            <path d="M17.602 16.5H18.342C19.403 16.5 20.421 16.921 21.171 17.671L29 25.5" stroke="#222222" strokeWidth="2"/>
            <path d="M34.869 -14.375C34.874 -9.54201 30.875 -8.29201 30.875 -3.37501C30.875 1.54199 34.874 2.79199 34.869 7.62499C34.864 12.458 30.875 13.792 30.875 18.625M34.869 -36.441C34.874 -31.608 30.875 -30.358 30.875 -25.441C30.875 -20.524 34.874 -19.274 34.869 -14.441V-14.375C34.874 -9.54201 30.875 -8.29201 30.875 -3.37501C30.875 1.54199 34.874 2.79199 34.869 7.62499C34.864 12.458 30.875 13.792 30.875 18.625" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M30.669 -15.575C30.674 -10.742 26.675 -9.492 26.675 -4.575C26.675 0.341995 30.674 1.59199 30.669 6.425C30.664 11.258 26.675 12.592 26.675 17.425M30.669 -37.641C30.674 -32.808 26.675 -31.558 26.675 -26.641C26.675 -21.724 30.674 -20.474 30.669 -15.641V-15.575C30.674 -10.742 26.675 -9.492 26.675 -4.575C26.675 0.341995 30.674 1.59199 30.669 6.425C30.664 11.258 26.675 12.592 26.675 17.425" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_2_1362">
            <rect width="45" height="45" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              <div className="type-title ">Hot tub</div>
            </button>
            <button
              onClick={() => setAmenities("Patio")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Patio") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.917 18.926H31M23 8V10.801V26.926M23 8.926C27.418 8.926 31 12.508 31 16.926V26.926H23C23 26.926 23 12.051 23 8.926Z" stroke="#222222" strokeWidth="2"/>
            <path d="M23.083 18.926H15M23 8V10.801V26.926M23 8.926C18.582 8.926 15 12.508 15 16.926V26.926H23C23 26.926 23 12.051 23 8.926Z" stroke="#222222" strokeWidth="2"/>
            <path d="M33 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M29 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M25 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M21 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M17 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M13 26.926V36.926" stroke="#222222" strokeWidth="2"/>
            <path d="M10 36.926H36" stroke="#222222" strokeWidth="2"/>
            <path d="M10 26.926H36" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Patio</div>
            </button>
            <button
              onClick={() => setAmenities("BBQ gril")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("BBQ gril") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2_1364)">
            <path d="M19 25.875L14 36.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M27 25.875L32 36.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M23 36.875V25.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M12 15.875C12 21.95 16.925 26.875 23 26.875C29.075 26.875 34 21.95 34 15.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M30 31.875H16" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M13 18.875H9" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M37 18.875H33" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M19.705 14.875C16.152 14.875 11 14.875 11 14.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M35 14.875C35 14.875 32.307 14.875 29.527 14.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M30.994 -13.125C30.999 -8.292 27 -7.042 27 -2.125C27 2.792 30.999 4.042 30.994 8.875C30.989 13.708 27 15.042 27 19.875M25.994 -13.125C25.999 -8.292 22 -7.042 22 -2.125C22 2.792 25.999 4.042 25.994 8.875C25.989 13.708 22 15.042 22 19.875M20.994 -13.125C20.999 -8.292 17 -7.042 17 -2.125C17 2.792 20.999 4.042 20.994 8.875C20.989 13.708 17 15.042 17 19.875M30.994 -35.191C30.999 -30.358 27 -29.108 27 -24.191C27 -19.274 30.999 -18.024 30.994 -13.191V-13.125C30.999 -8.292 27 -7.042 27 -2.125C27 2.792 30.999 4.042 30.994 8.875C30.989 13.708 27 15.042 27 19.875M25.994 -35.191C25.999 -30.358 22 -29.108 22 -24.191C22 -19.274 25.999 -18.024 25.994 -13.191V-13.125C25.999 -8.292 22 -7.042 22 -2.125C22 2.792 25.999 4.042 25.994 8.875C25.989 13.708 22 15.042 22 19.875M20.994 -35.191C20.999 -30.358 17 -29.108 17 -24.191C17 -19.274 20.999 -18.024 20.994 -13.191V-13.125C20.999 -8.292 17 -7.042 17 -2.125C17 2.792 20.999 4.042 20.994 8.875C20.989 13.708 17 15.042 17 19.875" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            </g>
            <defs>
            <clipPath id="clip0_2_1364">
            <rect width="45" height="45" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              <div className="type-title ">BBQ gril</div>
            </button>
            <button
              onClick={() => setAmenities("Outdoor dining area")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Outdoor dining area") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.653 8C28.238 8 33.059 11.27 35.306 16H10C12.247 11.27 17.068 8 22.653 8Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M22.653 16V37" stroke="#222222" strokeWidth="2"/>
            <path d="M34.653 37V21" stroke="#222222" strokeWidth="2"/>
            <path d="M34.653 30H27.653C27.101 30 26.653 30.448 26.653 31V37" stroke="#222222" strokeWidth="2"/>
            <path d="M10.653 37V21" stroke="#222222" strokeWidth="2"/>
            <path d="M10.653 30H17.653C18.205 30 18.653 30.448 18.653 31V37" stroke="#222222" strokeWidth="2"/>
            <path d="M13.653 26H31.653" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Outdoor dining area</div>
            </button>
            <button
              onClick={() => setAmenities("Fire pit")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Fire pit") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            ><GiCampfire size="28" />
              <div className="type-title ">Fire pit</div>
            </button>
            <button
              onClick={() => setAmenities("Pool table")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Pool table") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.875 12.5C36.049 12.5 37 13.451 37 14.625C37 15.799 36.049 16.75 34.875 16.75C33.701 16.75 32.75 15.799 32.75 14.625C32.75 13.451 33.701 12.5 34.875 12.5Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M34.875 28.25C36.049 28.25 37 29.201 37 30.375C37 31.549 36.049 32.5 34.875 32.5C33.701 32.5 32.75 31.549 32.75 30.375C32.75 29.201 33.701 28.25 34.875 28.25Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M11.312 27.875C12.589 27.875 13.625 28.911 13.625 30.188C13.625 31.465 12.589 32.5 11.312 32.5C10.035 32.5 9 31.465 9 30.188C9 28.911 10.035 27.875 11.312 27.875Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M11.312 12.5C12.589 12.5 13.625 13.535 13.625 14.812C13.625 16.089 12.589 17.125 11.312 17.125C10.035 17.125 9 16.089 9 14.812C9 13.535 10.035 12.5 11.312 12.5Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M25 32.5V30.5C25 29.395 24.105 28.5 23 28.5C21.895 28.5 21 29.395 21 30.5V32.5" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M25 12.5V14.5C25 15.605 24.105 16.5 23 16.5C21.895 16.5 21 15.605 21 14.5V12.5" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M9 12.5H37V32.5H9V12.5Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M25.682 21.548L31 37.5" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M25 18.5C25.552 18.5 26 18.948 26 19.5C26 20.052 25.552 20.5 25 20.5C24.448 20.5 24 20.052 24 19.5C24 18.948 24.448 18.5 25 18.5Z" fill="#222222"/>
            </svg>
              <div className="type-title ">Pool table</div>
            </button>
            <button
              onClick={() => setAmenities("Indoor fireplace")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Indoor fireplace") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 20V35H11V13H35V35H31V20C31 19.448 30.552 19 30 19H16C15.448 19 15 19.448 15 20Z" stroke="#222222" strokeWidth="2"/>
            <path d="M8 13H38" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M8 9H38" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M23 24.27C25.667 26.573 27 28.816 27 30.998C27 33.207 25.209 34.998 23 34.998C20.791 34.998 19 33.18 19 30.998C19 28.816 20.333 26.573 23 24.27Z" stroke="#222222" strokeWidth="2"/>
            <path d="M23 30.75C24.243 30.75 25.25 31.757 25.25 33C25.25 34.243 24.243 35.25 23 35.25C21.757 35.25 20.75 34.243 20.75 33C20.75 31.757 21.757 30.75 23 30.75Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
              <div className="type-title ">Indoor fireplace</div>
            </button>
            <button
              onClick={() => setAmenities("Piano")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Piano") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 14.5C8 12.685 8.705 10.941 9.966 9.636C11.227 8.331 12.946 7.566 14.76 7.504L15 7.5H17C18.773 7.501 20.479 8.174 21.775 9.383C23.071 10.593 23.86 12.249 23.983 14.017L23.996 14.257L24.006 14.677C24.049 15.41 24.36 16.102 24.88 16.622C25.399 17.141 26.091 17.452 26.824 17.495L27 17.5H30C32.078 17.5 34.075 18.309 35.568 19.755C37.06 21.202 37.931 23.173 37.996 25.25L38 25.5V33.5C38 33.745 37.91 33.981 37.747 34.164C37.585 34.347 37.36 34.464 37.117 34.493L37 34.5H36V37.5H34V34.5H12V37.5H10V34.5H9C8.755 34.5 8.519 34.41 8.336 34.247C8.153 34.085 8.036 33.86 8.007 33.617L8 33.5V14.5ZM12 26.5H10V32.5H36V26.5H34M16 26.5H14H16ZM20 26.5H18H20ZM24 26.5H22H24ZM28 26.5H26H28ZM32 26.5H30H32ZM17 9.5H15C13.712 9.5 12.473 9.998 11.542 10.889C10.612 11.78 10.061 12.996 10.005 14.283L10 14.5V24.5H35.915L35.899 24.398C35.656 23.102 34.994 21.921 34.013 21.039C33.033 20.157 31.789 19.622 30.474 19.518L30.224 19.504L30 19.5H27C24.311 19.5 22.118 17.378 22.005 14.734L21.997 14.312C21.948 13.019 21.401 11.796 20.469 10.898C19.537 10.001 18.294 9.5 17 9.5Z" fill="#222222"/>
            <path d="M14 30.5H11.994V24.934H14V30.5Z" fill="#222222"/>
            <path d="M18 30.5H15.994V24.934H18V30.5Z" fill="#222222"/>
            <path d="M22 30.5H19.994V24.934H22V30.5Z" fill="#222222"/>
            <path d="M26 30.5H23.994V24.934H26V30.5Z" fill="#222222"/>
            <path d="M30 30.5H27.994V24.934H30V30.5Z" fill="#222222"/>
            <path d="M34 30.5H31.994V24.934H34V30.5Z" fill="#222222"/>
            </svg>
              <div className="type-title ">Piano</div>
            </button>
            <button
              onClick={() => setAmenities("Exercise equipment")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Exercise equipment") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33 16.5H35C35.552 16.5 36 16.948 36 17.5V27.5C36 28.052 35.552 28.5 35 28.5H33C32.448 28.5 32 28.052 32 27.5V17.5C32 16.948 32.448 16.5 33 16.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M29 12.5H31C31.552 12.5 32 12.948 32 13.5V31.5C32 32.052 31.552 32.5 31 32.5H29C28.448 32.5 28 32.052 28 31.5V13.5C28 12.948 28.448 12.5 29 12.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M15 12.5H17C17.552 12.5 18 12.948 18 13.5V31.5C18 32.052 17.552 32.5 17 32.5H15C14.448 32.5 14 32.052 14 31.5V13.5C14 12.948 14.448 12.5 15 12.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M11 16.5H13C13.552 16.5 14 16.948 14 17.5V27.5C14 28.052 13.552 28.5 13 28.5H11C10.448 28.5 10 28.052 10 27.5V17.5C10 16.948 10.448 16.5 11 16.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M36 22.5H39" stroke="#222222" strokeWidth="2"/>
            <path d="M18 22.5H28" stroke="#222222" strokeWidth="2"/>
            <path d="M7 22.5H10" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Exercise equipment</div>
            </button>
            <button
              onClick={() => setAmenities("Lake access")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Lake access") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2_1367)">
            <path d="M37 23.501V25.501H9V15.501C9 15.251 9.094 15.01 9.26 14.827L9.35 14.74L15.704 9.29901C16.409 8.69501 17.429 8.66001 18.171 9.19301L18.307 9.29901L24.651 14.741C24.841 14.904 24.962 15.131 24.992 15.376L25 15.501V23.501M17.005 10.818L11 15.96V23.501H14V18.501C14 17.988 14.386 17.565 14.883 17.508L15 17.501H19C19.513 17.501 19.936 17.886 19.993 18.383L20 18.501V23.501H23V15.96L17.005 10.818ZM18 19.501H16V23.501H18V19.501Z" fill="#222222"/>
            <path d="M31.011 25.037H33.038L33.026 8.5H30.998L31.011 25.037Z" fill="#222222"/>
            <path d="M31.313 13.332C30.391 14.127 28.848 14.741 27.307 14.795L27.021 14.8V12.8C29.335 12.8 30.564 11.522 30.954 9.589L30.975 9.46C30.989 9.352 30.997 9.236 31.001 9.124L30.997 9.031L31.001 8.759L30.999 8.5" fill="#222222"/>
            <path d="M32.65 13.273C33.629 14.117 35.305 14.799 36.983 14.799V12.799L36.748 12.796C34.586 12.712 33.426 11.456 33.05 9.589L33 9.369H32.227L32.65 13.273Z" fill="#222222"/>
            <path d="M32.703 14.996L31 15.084L30.97 15.268C30.612 16.58 29.414 17.5 27.02 17.5V19.5L27.326 19.496C28.849 19.451 30.076 19.07 31.001 18.446L32.328 17.159L32.703 14.996Z" fill="#222222"/>
            <path d="M33 18.446C33.986 19.112 35.316 19.5 36.981 19.5V17.5L36.72 17.496C34.499 17.431 33.367 16.533 33.022 15.27L32.123 15.386L31.289 17.293L33 18.446Z" fill="#222222"/>
            <mask id="mask0_2_1367" mask-type="alpha" maskUnits="userSpaceOnUse" x="-17" y="-18" width="80" height="80">
            <path d="M63 -18H-17V62H63V-18Z" fill="#222222"/>
            </mask>
            <g mask="url(#mask0_2_1367)">
            <path d="M4.959 27.875C6.078 27.876 7.16 28.286 7.975 29.051C8.365 29.416 8.876 29.635 9.419 29.679L9.625 29.687V31.687C8.506 31.687 7.424 31.276 6.608 30.511C6.17 30.1 5.578 29.875 4.959 29.875C4.339 29.875 3.747 30.1 3.309 30.511C2.493 31.276 1.411 31.687 0.292 31.687C-0.747 31.687 -1.755 31.333 -2.546 30.67L-2.725 30.511C-3.164 30.1 -3.755 29.875 -4.375 29.875C-4.995 29.875 -5.586 30.1 -6.024 30.511C-6.84 31.276 -7.923 31.687 -9.042 31.687C-10.161 31.687 -11.243 31.276 -12.059 30.511C-12.497 30.1 -13.088 29.875 -13.708 29.875C-14.328 29.875 -14.919 30.1 -15.358 30.511C-16.116 31.221 -17.103 31.627 -18.136 31.681L-18.375 31.687V29.687C-17.824 29.687 -17.296 29.509 -16.877 29.181L-16.725 29.051C-15.909 28.286 -14.827 27.876 -13.708 27.875C-12.589 27.876 -11.507 28.286 -10.691 29.051C-10.253 29.462 -9.662 29.687 -9.042 29.687C-8.422 29.687 -7.831 29.463 -7.392 29.051C-6.576 28.287 -5.494 27.876 -4.375 27.875C-3.256 27.876 -2.174 28.286 -1.358 29.051C-0.918999 29.462 -0.327999 29.687 0.292 29.687C0.912001 29.687 1.503 29.462 1.941 29.051C2.757 28.286 3.839 27.876 4.959 27.875Z" fill="#222222"/>
            <path d="M32.084 27.875C33.203 27.876 34.285 28.286 35.1 29.051C35.49 29.416 36.001 29.635 36.544 29.679L36.75 29.687V31.687C35.631 31.687 34.549 31.276 33.733 30.511C33.295 30.1 32.703 29.875 32.084 29.875C31.464 29.875 30.872 30.1 30.434 30.511C29.618 31.276 28.536 31.687 27.417 31.687C26.378 31.687 25.37 31.333 24.579 30.67L24.4 30.511C23.961 30.1 23.37 29.875 22.75 29.875C22.13 29.875 21.539 30.1 21.101 30.511C20.285 31.276 19.202 31.687 18.083 31.687C16.964 31.687 15.882 31.276 15.066 30.511C14.628 30.1 14.037 29.875 13.417 29.875C12.797 29.875 12.206 30.1 11.767 30.511C11.009 31.221 10.022 31.627 8.989 31.681L8.75 31.687V29.687C9.301 29.687 9.829 29.509 10.248 29.181L10.4 29.051C11.216 28.286 12.298 27.876 13.417 27.875C14.536 27.876 15.618 28.286 16.434 29.051C16.872 29.462 17.463 29.687 18.083 29.687C18.703 29.687 19.294 29.463 19.733 29.051C20.549 28.287 21.631 27.876 22.75 27.875C23.869 27.876 24.951 28.286 25.767 29.051C26.206 29.462 26.797 29.687 27.417 29.687C28.037 29.687 28.628 29.462 29.066 29.051C29.882 28.286 30.964 27.876 32.084 27.875Z" fill="#222222"/>
            <path d="M59.584 27.875C60.703 27.876 61.785 28.286 62.6 29.051C62.99 29.416 63.501 29.635 64.044 29.679L64.25 29.687V31.687C63.131 31.687 62.049 31.276 61.233 30.511C60.795 30.1 60.203 29.875 59.584 29.875C58.964 29.875 58.372 30.1 57.934 30.511C57.118 31.276 56.036 31.687 54.917 31.687C53.878 31.687 52.87 31.333 52.079 30.67L51.9 30.511C51.461 30.1 50.87 29.875 50.25 29.875C49.63 29.875 49.039 30.1 48.601 30.511C47.785 31.276 46.702 31.687 45.583 31.687C44.464 31.687 43.382 31.276 42.566 30.511C42.128 30.1 41.537 29.875 40.917 29.875C40.297 29.875 39.706 30.1 39.267 30.511C38.509 31.221 37.522 31.627 36.489 31.681L36.25 31.687V29.687C36.801 29.687 37.329 29.509 37.748 29.181L37.9 29.051C38.716 28.286 39.798 27.876 40.917 27.875C42.036 27.876 43.118 28.286 43.934 29.051C44.372 29.462 44.963 29.687 45.583 29.687C46.203 29.687 46.794 29.463 47.233 29.051C48.049 28.287 49.131 27.876 50.25 27.875C51.369 27.876 52.451 28.286 53.267 29.051C53.706 29.462 54.297 29.687 54.917 29.687C55.537 29.687 56.128 29.462 56.566 29.051C57.382 28.286 58.464 27.876 59.584 27.875Z" fill="#222222"/>
            </g>
            <mask id="mask1_2_1367" mask-type="alpha" maskUnits="userSpaceOnUse" x="-17" y="-18" width="80" height="80">
            <path d="M63 -18H-17V62H63V-18Z" fill="#222222"/>
            </mask>
            <g mask="url(#mask1_2_1367)">
            <path d="M4.959 32.5C6.078 32.501 7.16 32.911 7.975 33.676C8.365 34.041 8.876 34.26 9.419 34.304L9.625 34.312V36.312C8.506 36.312 7.424 35.901 6.608 35.136C6.17 34.725 5.578 34.5 4.959 34.5C4.339 34.5 3.747 34.725 3.309 35.136C2.493 35.901 1.411 36.312 0.292 36.312C-0.747 36.312 -1.755 35.958 -2.546 35.295L-2.725 35.136C-3.164 34.725 -3.755 34.5 -4.375 34.5C-4.995 34.5 -5.586 34.725 -6.024 35.136C-6.84 35.901 -7.923 36.312 -9.042 36.312C-10.161 36.312 -11.243 35.901 -12.059 35.136C-12.497 34.725 -13.088 34.5 -13.708 34.5C-14.328 34.5 -14.919 34.725 -15.358 35.136C-16.116 35.846 -17.103 36.252 -18.136 36.306L-18.375 36.312V34.312C-17.824 34.312 -17.296 34.134 -16.877 33.806L-16.725 33.676C-15.909 32.911 -14.827 32.501 -13.708 32.5C-12.589 32.501 -11.507 32.911 -10.691 33.676C-10.253 34.087 -9.662 34.312 -9.042 34.312C-8.422 34.312 -7.831 34.088 -7.392 33.676C-6.576 32.912 -5.494 32.501 -4.375 32.5C-3.256 32.501 -2.174 32.911 -1.358 33.676C-0.918999 34.087 -0.327999 34.312 0.292 34.312C0.912001 34.312 1.503 34.087 1.941 33.676C2.757 32.911 3.839 32.501 4.959 32.5Z" fill="#222222"/>
            <path d="M32.084 32.5C33.203 32.501 34.285 32.911 35.1 33.676C35.49 34.041 36.001 34.26 36.544 34.304L36.75 34.312V36.312C35.631 36.312 34.549 35.901 33.733 35.136C33.295 34.725 32.703 34.5 32.084 34.5C31.464 34.5 30.872 34.725 30.434 35.136C29.618 35.901 28.536 36.312 27.417 36.312C26.378 36.312 25.37 35.958 24.579 35.295L24.4 35.136C23.961 34.725 23.37 34.5 22.75 34.5C22.13 34.5 21.539 34.725 21.101 35.136C20.285 35.901 19.202 36.312 18.083 36.312C16.964 36.312 15.882 35.901 15.066 35.136C14.628 34.725 14.037 34.5 13.417 34.5C12.797 34.5 12.206 34.725 11.767 35.136C11.009 35.846 10.022 36.252 8.989 36.306L8.75 36.312V34.312C9.301 34.312 9.829 34.134 10.248 33.806L10.4 33.676C11.216 32.911 12.298 32.501 13.417 32.5C14.536 32.501 15.618 32.911 16.434 33.676C16.872 34.087 17.463 34.312 18.083 34.312C18.703 34.312 19.294 34.088 19.733 33.676C20.549 32.912 21.631 32.501 22.75 32.5C23.869 32.501 24.951 32.911 25.767 33.676C26.206 34.087 26.797 34.312 27.417 34.312C28.037 34.312 28.628 34.087 29.066 33.676C29.882 32.911 30.964 32.501 32.084 32.5Z" fill="#222222"/>
            <path d="M59.584 32.5C60.703 32.501 61.785 32.911 62.6 33.676C62.99 34.041 63.501 34.26 64.044 34.304L64.25 34.312V36.312C63.131 36.312 62.049 35.901 61.233 35.136C60.795 34.725 60.203 34.5 59.584 34.5C58.964 34.5 58.372 34.725 57.934 35.136C57.118 35.901 56.036 36.312 54.917 36.312C53.878 36.312 52.87 35.958 52.079 35.295L51.9 35.136C51.461 34.725 50.87 34.5 50.25 34.5C49.63 34.5 49.039 34.725 48.601 35.136C47.785 35.901 46.702 36.312 45.583 36.312C44.464 36.312 43.382 35.901 42.566 35.136C42.128 34.725 41.537 34.5 40.917 34.5C40.297 34.5 39.706 34.725 39.267 35.136C38.509 35.846 37.522 36.252 36.489 36.306L36.25 36.312V34.312C36.801 34.312 37.329 34.134 37.748 33.806L37.9 33.676C38.716 32.911 39.798 32.501 40.917 32.5C42.036 32.501 43.118 32.911 43.934 33.676C44.372 34.087 44.963 34.312 45.583 34.312C46.203 34.312 46.794 34.088 47.233 33.676C48.049 32.912 49.131 32.501 50.25 32.5C51.369 32.501 52.451 32.911 53.267 33.676C53.706 34.087 54.297 34.312 54.917 34.312C55.537 34.312 56.128 34.087 56.566 33.676C57.382 32.911 58.464 32.501 59.584 32.5Z" fill="#222222"/>
            </g>
            </g>
            <defs>
            <clipPath id="clip0_2_1367">
            <rect width="45" height="45" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              <div className="type-title ">Lake access</div>
            </button>
            <button
              onClick={() => setAmenities("Beach access")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Beach access") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            ><svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2_1369)">
            <path d="M26.496 18.771C26.371 15.501 23.569 12.693 18.282 10.257L17.5 9.90399L16.718 10.257C11.308 12.75 8.5 15.632 8.5 19V20L10.5 19.999H12.5H22.5H24.5L26.5 20V19L26.496 18.771ZM10.635 18L10.655 17.929L10.717 17.734C11.368 15.846 13.492 14 17.194 12.242L17.5 12.099L17.806 12.242L18.183 12.424C21.776 14.188 23.796 16.039 24.345 17.929L24.364 18H10.635Z" fill="#222222"/>
            <path d="M23.5 24.997H11.494V18.999H23.5V24.997Z" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 24.75H16.5V22H18.5V24.75Z" fill="#222222"/>
            <path d="M31.954 13.189C32.33 14.583 32.5 16.123 32.5 18C32.5 20.346 31.902 22.682 30.717 25L28.437 24.999C29.817 22.646 30.5 20.316 30.5 18C30.5 16.075 30.31 14.587 29.893 13.259C30.812 11.5 31.5 11.5 31.954 13.189Z" fill="#222222"/>
            <path d="M31.6 11.04C33.734 11.324 30.31 14.587 29.893 13.259C29.114 13.644 28.565 14.423 28.505 15.336L28.5 15.5H26.5C26.5 13.55 27.74 11.891 29.474 11.265C29.325 10.579 31.857 10.457 31.6 11.04Z" fill="#222222"/>
            <path d="M31.6 11.04C33.734 11.324 35.394 13.103 35.495 15.288L35.5 15.5H33.5C33.5 14.457 32.862 13.564 31.954 13.189C31.308 12.716 30.795 12.453 29.474 11.265C29.325 10.579 31.857 10.457 31.6 11.04Z" fill="#222222"/>
            <path d="M31.6 11.04C31.408 11.13 30.311 11.561 29.474 11.265C29.325 10.579 28.526 10 27.5 10C26.416 10 25.587 10.646 25.506 11.383L25.5 11.5H23.5C23.5 9.523 25.327 8 27.5 8C28.682 8 29.762 8.451 30.501 9.18C31.239 8.45 31.857 10.457 31.6 11.04Z" fill="#222222"/>
            <path d="M33.5 8C35.603 8 37.382 9.426 37.494 11.31L37.5 11.5H35.5C35.5 10.716 34.641 10 33.5 10C32.589 10 31.857 10.457 31.6 11.04C31.512 11.176 30.731 11.185 29.474 11.265C29.325 10.579 29.762 8.451 30.501 9.18C31.239 8.45 32.318 8 33.5 8Z" fill="#222222"/>
            <mask id="mask0_2_1369" mask-type="alpha" maskUnits="userSpaceOnUse" x="-17" y="-18" width="80" height="81">
            <path d="M63 -17.5H-17V62.5H63V-17.5Z" fill="#222222"/>
            </mask>
            <g mask="url(#mask0_2_1369)">
            <path d="M31.556 28C32.675 28.001 33.757 28.411 34.572 29.176C34.962 29.541 35.473 29.76 36.016 29.804L36.222 29.812V31.812C35.103 31.812 34.021 31.401 33.205 30.636C32.767 30.225 32.175 30 31.556 30C30.936 30 30.344 30.225 29.906 30.636C29.09 31.401 28.008 31.812 26.889 31.812C25.85 31.812 24.842 31.458 24.051 30.795L23.872 30.636C23.433 30.225 22.842 30 22.222 30C21.602 30 21.011 30.225 20.573 30.636C19.757 31.401 18.674 31.812 17.555 31.812C16.436 31.812 15.354 31.401 14.538 30.636C14.1 30.225 13.509 30 12.889 30C12.269 30 11.678 30.225 11.239 30.636C10.481 31.346 9.49399 31.752 8.46099 31.806L8.22198 31.812V29.812C8.77298 29.812 9.30099 29.634 9.71999 29.306L9.87198 29.176C10.688 28.411 11.77 28.001 12.889 28C14.008 28.001 15.09 28.411 15.906 29.176C16.344 29.587 16.935 29.812 17.555 29.812C18.175 29.812 18.766 29.588 19.205 29.176C20.021 28.412 21.103 28.001 22.222 28C23.341 28.001 24.423 28.411 25.239 29.176C25.678 29.587 26.269 29.812 26.889 29.812C27.509 29.812 28.1 29.587 28.538 29.176C29.354 28.411 30.436 28.001 31.556 28Z" fill="#222222"/>
            <path d="M59.209 28C60.328 28.001 61.41 28.411 62.225 29.176C62.615 29.541 63.126 29.76 63.669 29.804L63.875 29.812V31.812C62.756 31.812 61.674 31.401 60.858 30.636C60.42 30.225 59.828 30 59.209 30C58.589 30 57.997 30.225 57.559 30.636C56.743 31.401 55.661 31.812 54.542 31.812C53.503 31.812 52.495 31.458 51.704 30.795L51.525 30.636C51.086 30.225 50.495 30 49.875 30C49.255 30 48.664 30.225 48.226 30.636C47.41 31.401 46.327 31.812 45.208 31.812C44.089 31.812 43.007 31.401 42.191 30.636C41.753 30.225 41.162 30 40.542 30C39.922 30 39.331 30.225 38.892 30.636C38.134 31.346 37.147 31.752 36.114 31.806L35.875 31.812V29.812C36.426 29.812 36.954 29.634 37.373 29.306L37.525 29.176C38.341 28.411 39.423 28.001 40.542 28C41.661 28.001 42.743 28.411 43.559 29.176C43.997 29.587 44.588 29.812 45.208 29.812C45.828 29.812 46.419 29.588 46.858 29.176C47.674 28.412 48.756 28.001 49.875 28C50.994 28.001 52.076 28.411 52.892 29.176C53.331 29.587 53.922 29.812 54.542 29.812C55.162 29.812 55.753 29.587 56.191 29.176C57.007 28.411 58.089 28.001 59.209 28Z" fill="#222222"/>
            <path d="M3.709 28C4.828 28.001 5.91 28.411 6.725 29.176C7.115 29.541 7.626 29.76 8.169 29.804L8.375 29.812V31.812C7.256 31.812 6.174 31.401 5.358 30.636C4.92 30.225 4.328 30 3.709 30C3.089 30 2.497 30.225 2.059 30.636C1.243 31.401 0.160999 31.812 -0.958 31.812C-1.997 31.812 -3.005 31.458 -3.796 30.795L-3.975 30.636C-4.414 30.225 -5.005 30 -5.625 30C-6.245 30 -6.836 30.225 -7.274 30.636C-8.09 31.401 -9.173 31.812 -10.292 31.812C-11.411 31.812 -12.493 31.401 -13.309 30.636C-13.747 30.225 -14.338 30 -14.958 30C-15.578 30 -16.169 30.225 -16.608 30.636C-17.366 31.346 -18.353 31.752 -19.386 31.806L-19.625 31.812V29.812C-19.074 29.812 -18.546 29.634 -18.127 29.306L-17.975 29.176C-17.159 28.411 -16.077 28.001 -14.958 28C-13.839 28.001 -12.757 28.411 -11.941 29.176C-11.503 29.587 -10.912 29.812 -10.292 29.812C-9.672 29.812 -9.081 29.588 -8.642 29.176C-7.826 28.412 -6.744 28.001 -5.625 28C-4.506 28.001 -3.424 28.411 -2.608 29.176C-2.169 29.587 -1.578 29.812 -0.958 29.812C-0.337999 29.812 0.253 29.587 0.691 29.176C1.507 28.411 2.589 28.001 3.709 28Z" fill="#222222"/>
            </g>
            <mask id="mask1_2_1369" mask-type="alpha" maskUnits="userSpaceOnUse" x="-17" y="-18" width="80" height="81">
            <path d="M63 -17.5H-17V62.5H63V-17.5Z" fill="#222222"/>
            </mask>
            <g mask="url(#mask1_2_1369)">
            <path d="M31.556 33C32.675 33.001 33.757 33.411 34.572 34.176C34.962 34.541 35.473 34.76 36.016 34.804L36.222 34.812V36.812C35.103 36.812 34.021 36.401 33.205 35.636C32.767 35.225 32.175 35 31.556 35C30.936 35 30.344 35.225 29.906 35.636C29.09 36.401 28.008 36.812 26.889 36.812C25.85 36.812 24.842 36.458 24.051 35.795L23.872 35.636C23.433 35.225 22.842 35 22.222 35C21.602 35 21.011 35.225 20.573 35.636C19.757 36.401 18.674 36.812 17.555 36.812C16.436 36.812 15.354 36.401 14.538 35.636C14.1 35.225 13.509 35 12.889 35C12.269 35 11.678 35.225 11.239 35.636C10.481 36.346 9.49399 36.752 8.46099 36.806L8.22198 36.812V34.812C8.77298 34.812 9.30099 34.634 9.71999 34.306L9.87198 34.176C10.688 33.411 11.77 33.001 12.889 33C14.008 33.001 15.09 33.411 15.906 34.176C16.344 34.587 16.935 34.812 17.555 34.812C18.175 34.812 18.766 34.588 19.205 34.176C20.021 33.412 21.103 33.001 22.222 33C23.341 33.001 24.423 33.411 25.239 34.176C25.678 34.587 26.269 34.812 26.889 34.812C27.509 34.812 28.1 34.587 28.538 34.176C29.354 33.411 30.436 33.001 31.556 33Z" fill="#222222"/>
            <path d="M59.209 33C60.328 33.001 61.41 33.411 62.225 34.176C62.615 34.541 63.126 34.76 63.669 34.804L63.875 34.812V36.812C62.756 36.812 61.674 36.401 60.858 35.636C60.42 35.225 59.828 35 59.209 35C58.589 35 57.997 35.225 57.559 35.636C56.743 36.401 55.661 36.812 54.542 36.812C53.503 36.812 52.495 36.458 51.704 35.795L51.525 35.636C51.086 35.225 50.495 35 49.875 35C49.255 35 48.664 35.225 48.226 35.636C47.41 36.401 46.327 36.812 45.208 36.812C44.089 36.812 43.007 36.401 42.191 35.636C41.753 35.225 41.162 35 40.542 35C39.922 35 39.331 35.225 38.892 35.636C38.134 36.346 37.147 36.752 36.114 36.806L35.875 36.812V34.812C36.426 34.812 36.954 34.634 37.373 34.306L37.525 34.176C38.341 33.411 39.423 33.001 40.542 33C41.661 33.001 42.743 33.411 43.559 34.176C43.997 34.587 44.588 34.812 45.208 34.812C45.828 34.812 46.419 34.588 46.858 34.176C47.674 33.412 48.756 33.001 49.875 33C50.994 33.001 52.076 33.411 52.892 34.176C53.331 34.587 53.922 34.812 54.542 34.812C55.162 34.812 55.753 34.587 56.191 34.176C57.007 33.411 58.089 33.001 59.209 33Z" fill="#222222"/>
            <path d="M3.709 33C4.828 33.001 5.91 33.411 6.725 34.176C7.115 34.541 7.626 34.76 8.169 34.804L8.375 34.812V36.812C7.256 36.812 6.174 36.401 5.358 35.636C4.92 35.225 4.328 35 3.709 35C3.089 35 2.497 35.225 2.059 35.636C1.243 36.401 0.160999 36.812 -0.958 36.812C-1.997 36.812 -3.005 36.458 -3.796 35.795L-3.975 35.636C-4.414 35.225 -5.005 35 -5.625 35C-6.245 35 -6.836 35.225 -7.274 35.636C-8.09 36.401 -9.173 36.812 -10.292 36.812C-11.411 36.812 -12.493 36.401 -13.309 35.636C-13.747 35.225 -14.338 35 -14.958 35C-15.578 35 -16.169 35.225 -16.608 35.636C-17.366 36.346 -18.353 36.752 -19.386 36.806L-19.625 36.812V34.812C-19.074 34.812 -18.546 34.634 -18.127 34.306L-17.975 34.176C-17.159 33.411 -16.077 33.001 -14.958 33C-13.839 33.001 -12.757 33.411 -11.941 34.176C-11.503 34.587 -10.912 34.812 -10.292 34.812C-9.672 34.812 -9.081 34.588 -8.642 34.176C-7.826 33.412 -6.744 33.001 -5.625 33C-4.506 33.001 -3.424 33.411 -2.608 34.176C-2.169 34.587 -1.578 34.812 -0.958 34.812C-0.337999 34.812 0.253 34.587 0.691 34.176C1.507 33.411 2.589 33.001 3.709 33Z" fill="#222222"/>
            </g>
            </g>
            <defs>
            <clipPath id="clip0_2_1369">
            <rect width="45" height="45" fill="white"/>
            </clipPath>
            </defs>
            </svg>
              <div className="type-title ">Beach access</div>
            </button>
            <button
              onClick={() => setAmenities("Ski-in/Ski-out")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Ski-in/Ski-out") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26.2409 33.633L31.3639 35.498C33.0209 36.101 34.8379 35.375 35.6459 33.864L36.5919 34.209C35.6189 36.177 33.3389 37.17 31.2169 36.504L31.0169 36.436L24.2609 33.978L24.2519 33.974L24.2429 33.97L7.99988 28.058L8.34188 27.118L26.2409 33.633Z" fill="#222222"/>
            <path d="M26.2409 33.633L31.3639 35.498C33.0209 36.101 34.8379 35.375 35.6459 33.864L36.5919 34.209C35.6189 36.177 33.3389 37.17 31.2169 36.504L31.0169 36.436L24.2609 33.978L24.2519 33.974L24.2429 33.97L7.99988 28.058L8.34188 27.118L26.2409 33.633Z" stroke="#222222"/>
            <path d="M24.8639 32.733L29.2689 26.781C29.6909 26.212 29.6519 25.434 29.2009 24.91L29.1899 24.897L29.1789 24.886L29.0899 24.796L29.0789 24.785L29.0679 24.774L26.3989 22.371C26.2339 22.221 26.1889 21.984 26.2809 21.787L26.3259 21.71L29.0999 17.546L30.2979 18.345V18.356L30.3019 18.388L30.3339 18.634L30.3349 18.647C30.3479 18.726 30.3609 18.801 30.3759 18.867C30.6079 19.873 31.1419 20.663 32.0179 21.196C32.8339 21.691 33.9089 21.941 35.2339 21.99V22.99C32.2709 22.883 30.4319 21.806 29.6609 19.916L29.3049 19.044L28.7819 19.828L27.6299 21.557L27.3899 21.916L27.7109 22.207L29.7369 24.031C30.6519 24.855 30.8249 26.216 30.1689 27.238L30.0689 27.382L25.6179 33.294M20.6019 31.208L23.8249 26.992L24.1149 26.613L23.7499 26.307L20.7489 23.774C20.2659 23.366 19.9949 22.788 19.9649 22.19L21.0829 22.61C21.1299 22.705 21.1889 22.796 21.2599 22.878L21.2729 22.893L21.2869 22.906L21.3659 22.983L21.3799 22.998L21.3939 23.009L25.1239 26.158C25.3089 26.313 25.3529 26.575 25.2389 26.781L25.1899 26.854L21.3149 31.759M17.6749 16.692L18.0579 16.835L18.2739 16.49L19.1509 15.089C19.3119 14.832 19.4899 14.586 19.6849 14.354C21.5839 12.092 24.6969 11.449 27.2719 12.578L28.1049 12.944L27.9679 12.046C27.8489 11.269 27.9909 10.449 28.4269 9.72199C29.4229 8.06499 31.5729 7.52899 33.2299 8.52399C34.8869 9.51999 35.4229 11.669 34.4279 13.326C33.9679 14.09 33.2649 14.615 32.4759 14.863L32.3149 14.914L32.2179 15.052L31.7529 15.709L30.9089 15.147L31.6679 14.013C32.4279 13.939 33.1459 13.517 33.5699 12.811C34.2809 11.628 33.8989 10.093 32.7149 9.38199C31.5319 8.66999 29.9959 9.05299 29.2849 10.237C28.8629 10.938 28.8259 11.763 29.1109 12.466L28.0629 14.21C25.7389 12.381 22.3659 12.717 20.4509 14.998C20.3409 15.129 20.2369 15.264 20.1399 15.404L20.1329 15.414L20.0049 15.61L19.9989 15.619L19.3379 16.677L19.0129 17.194L19.5859 17.41" fill="#222222"/>
            <path d="M24.8639 32.733L29.2689 26.781C29.6909 26.212 29.6519 25.434 29.2009 24.91L29.1899 24.897L29.1789 24.886L29.0899 24.796L29.0789 24.785L29.0679 24.774L26.3989 22.371C26.2339 22.221 26.1889 21.984 26.2809 21.787L26.3259 21.71L29.0999 17.546L30.2979 18.345V18.356L30.3019 18.388L30.3339 18.634L30.3349 18.647C30.3479 18.726 30.3609 18.801 30.3759 18.867C30.6079 19.873 31.1419 20.663 32.0179 21.196C32.8339 21.691 33.9089 21.941 35.2339 21.99V22.99C32.2709 22.883 30.4319 21.806 29.6609 19.916L29.3049 19.044L28.7819 19.828L27.6299 21.557L27.3899 21.916L27.7109 22.207L29.7369 24.031C30.6519 24.855 30.8249 26.216 30.1689 27.238L30.0689 27.382L25.6179 33.294M20.6019 31.208L23.8249 26.992L24.1149 26.613L23.7499 26.307L20.7489 23.774C20.2659 23.366 19.9949 22.788 19.9649 22.19L21.0829 22.61C21.1299 22.705 21.1889 22.796 21.2599 22.878L21.2729 22.893L21.2869 22.906L21.3659 22.983L21.3799 22.998L21.3939 23.009L25.1239 26.158C25.3089 26.313 25.3529 26.575 25.2389 26.781L25.1899 26.854L21.3149 31.759M17.6749 16.692L18.0579 16.835L18.2739 16.49L19.1509 15.089C19.3119 14.832 19.4899 14.586 19.6849 14.354C21.5839 12.092 24.6969 11.449 27.2719 12.578L28.1049 12.944L27.9679 12.046C27.8489 11.269 27.9909 10.449 28.4269 9.72199C29.4229 8.06499 31.5729 7.52899 33.2299 8.52399C34.8869 9.51999 35.4229 11.669 34.4279 13.326C33.9679 14.09 33.2649 14.615 32.4759 14.863L32.3149 14.914L32.2179 15.052L31.7529 15.709L30.9089 15.147L31.6679 14.013C32.4279 13.939 33.1459 13.517 33.5699 12.811C34.2809 11.628 33.8989 10.093 32.7149 9.38199C31.5319 8.66999 29.9959 9.05299 29.2849 10.237C28.8629 10.938 28.8259 11.763 29.1109 12.466L28.0629 14.21C25.7389 12.381 22.3659 12.717 20.4509 14.998C20.3409 15.129 20.2369 15.264 20.1399 15.404L20.1329 15.414L20.0049 15.61L19.9989 15.619L19.3379 16.677L19.0129 17.194L19.5859 17.41" stroke="#222222"/>
            <path d="M8.60785 14.061L24.6138 20.065" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Ski-in/Ski-out</div>
            </button>
            <button
              onClick={() => setAmenities("Outdoor shower")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Outdoor shower") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            ><svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M27.7812 11.002V9.002C27.7812 7.897 26.8863 7.002 25.7812 7.002H14.7812C13.6762 7.002 12.7812 7.897 12.7812 9.002V36.002" stroke="#222222" strokeWidth="2"/>
<path d="M33.7812 11.002H21.7812V15.002H33.7812V11.002Z" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
<path d="M18.7812 15.002H36.7812" stroke="#222222" strokeWidth="2" strokeLinejoin="round"/>
<path d="M27.7812 18.002C27.2292 18.002 26.7812 18.45 26.7812 19.002C26.7812 19.554 27.2292 20.002 27.7812 20.002C28.3333 20.002 28.7812 19.554 28.7812 19.002C28.7812 18.45 28.3333 18.002 27.7812 18.002ZM22.7812 18.002C22.2293 18.002 21.7812 18.45 21.7812 19.002C21.7812 19.554 22.2293 20.002 22.7812 20.002C23.3333 20.002 23.7812 19.554 23.7812 19.002C23.7812 18.45 23.3333 18.002 22.7812 18.002ZM32.7812 18.002C32.2292 18.002 31.7812 18.45 31.7812 19.002C31.7812 19.554 32.2292 20.002 32.7812 20.002C33.3333 20.002 33.7812 19.554 33.7812 19.002C33.7812 18.45 33.3333 18.002 32.7812 18.002ZM27.7812 22.002C27.2292 22.002 26.7812 22.45 26.7812 23.002C26.7812 23.554 27.2292 24.002 27.7812 24.002C28.3333 24.002 28.7812 23.554 28.7812 23.002C28.7812 22.45 28.3333 22.002 27.7812 22.002ZM32.7812 22.002C32.2292 22.002 31.7812 22.45 31.7812 23.002C31.7812 23.554 32.2292 24.002 32.7812 24.002C33.3333 24.002 33.7812 23.554 33.7812 23.002C33.7812 22.45 33.3333 22.002 32.7812 22.002ZM22.7812 22.002C22.2293 22.002 21.7812 22.45 21.7812 23.002C21.7812 23.554 22.2293 24.002 22.7812 24.002C23.3333 24.002 23.7812 23.554 23.7812 23.002C23.7812 22.45 23.3333 22.002 22.7812 22.002ZM27.7812 26.002C27.2292 26.002 26.7812 26.45 26.7812 27.002C26.7812 27.554 27.2292 28.002 27.7812 28.002C28.3333 28.002 28.7812 27.554 28.7812 27.002C28.7812 26.45 28.3333 26.002 27.7812 26.002ZM32.7812 26.002C32.2292 26.002 31.7812 26.45 31.7812 27.002C31.7812 27.554 32.2292 28.002 32.7812 28.002C33.3333 28.002 33.7812 27.554 33.7812 27.002C33.7812 26.45 33.3333 26.002 32.7812 26.002ZM22.7812 26.002C22.2293 26.002 21.7812 26.45 21.7812 27.002C21.7812 27.554 22.2293 28.002 22.7812 28.002C23.3333 28.002 23.7812 27.554 23.7812 27.002C23.7812 26.45 23.3333 26.002 22.7812 26.002ZM27.7812 30.002C27.2292 30.002 26.7812 30.45 26.7812 31.002C26.7812 31.554 27.2292 32.002 27.7812 32.002C28.3333 32.002 28.7812 31.554 28.7812 31.002C28.7812 30.45 28.3333 30.002 27.7812 30.002ZM32.7812 30.002C32.2292 30.002 31.7812 30.45 31.7812 31.002C31.7812 31.554 32.2292 32.002 32.7812 32.002C33.3333 32.002 33.7812 31.554 33.7812 31.002C33.7812 30.45 33.3333 30.002 32.7812 30.002ZM22.7812 30.002C22.2293 30.002 21.7812 30.45 21.7812 31.002C21.7812 31.554 22.2293 32.002 22.7812 32.002C23.3333 32.002 23.7812 31.554 23.7812 31.002C23.7812 30.45 23.3333 30.002 22.7812 30.002ZM27.7812 34.002C27.2292 34.002 26.7812 34.45 26.7812 35.002C26.7812 35.554 27.2292 36.002 27.7812 36.002C28.3333 36.002 28.7812 35.554 28.7812 35.002C28.7812 34.45 28.3333 34.002 27.7812 34.002ZM32.7812 34.002C32.2292 34.002 31.7812 34.45 31.7812 35.002C31.7812 35.554 32.2292 36.002 32.7812 36.002C33.3333 36.002 33.7812 35.554 33.7812 35.002C33.7812 34.45 33.3333 34.002 32.7812 34.002ZM22.7812 34.002C22.2293 34.002 21.7812 34.45 21.7812 35.002C21.7812 35.554 22.2293 36.002 22.7812 36.002C23.3333 36.002 23.7812 35.554 23.7812 35.002C23.7812 34.45 23.3333 34.002 22.7812 34.002Z" fill="#222222"/>
<path d="M32.7812 18.002C32.2292 18.002 31.7812 18.45 31.7812 19.002C31.7812 19.554 32.2292 20.002 32.7812 20.002C33.3333 20.002 33.7812 19.554 33.7812 19.002C33.7812 18.45 33.3333 18.002 32.7812 18.002ZM27.7812 18.002C27.2293 18.002 26.7812 18.45 26.7812 19.002C26.7812 19.554 27.2293 20.002 27.7812 20.002C28.3333 20.002 28.7812 19.554 28.7812 19.002C28.7812 18.45 28.3333 18.002 27.7812 18.002ZM32.7812 22.002C32.2292 22.002 31.7812 22.45 31.7812 23.002C31.7812 23.554 32.2292 24.002 32.7812 24.002C33.3333 24.002 33.7812 23.554 33.7812 23.002C33.7812 22.45 33.3333 22.002 32.7812 22.002ZM27.7812 22.002C27.2293 22.002 26.7812 22.45 26.7812 23.002C26.7812 23.554 27.2293 24.002 27.7812 24.002C28.3333 24.002 28.7812 23.554 28.7812 23.002C28.7812 22.45 28.3333 22.002 27.7812 22.002ZM32.7812 26.002C32.2292 26.002 31.7812 26.45 31.7812 27.002C31.7812 27.554 32.2292 28.002 32.7812 28.002C33.3333 28.002 33.7812 27.554 33.7812 27.002C33.7812 26.45 33.3333 26.002 32.7812 26.002ZM27.7812 26.002C27.2293 26.002 26.7812 26.45 26.7812 27.002C26.7812 27.554 27.2293 28.002 27.7812 28.002C28.3333 28.002 28.7812 27.554 28.7812 27.002C28.7812 26.45 28.3333 26.002 27.7812 26.002ZM32.7812 30.002C32.2292 30.002 31.7812 30.45 31.7812 31.002C31.7812 31.554 32.2292 32.002 32.7812 32.002C33.3333 32.002 33.7812 31.554 33.7812 31.002C33.7812 30.45 33.3333 30.002 32.7812 30.002ZM27.7812 30.002C27.2293 30.002 26.7812 30.45 26.7812 31.002C26.7812 31.554 27.2293 32.002 27.7812 32.002C28.3333 32.002 28.7812 31.554 28.7812 31.002C28.7812 30.45 28.3333 30.002 27.7812 30.002ZM32.7812 34.002C32.2292 34.002 31.7812 34.45 31.7812 35.002C31.7812 35.554 32.2292 36.002 32.7812 36.002C33.3333 36.002 33.7812 35.554 33.7812 35.002C33.7812 34.45 33.3333 34.002 32.7812 34.002ZM27.7812 34.002C27.2293 34.002 26.7812 34.45 26.7812 35.002C26.7812 35.554 27.2293 36.002 27.7812 36.002C28.3333 36.002 28.7812 35.554 28.7812 35.002C28.7812 34.45 28.3333 34.002 27.7812 34.002Z" fill="#222222"/>
</svg>
              <div className="type-title ">Outdoor shower</div>
            </button>
            <div className="sub-title fs22 fw600">
            Do you have any of these safety items?
          </div>
            <button
              onClick={() => setAmenities("Smoke alarm")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Smoke alarm") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 14.75C30.552 14.75 31 15.198 31 15.75C31 16.302 30.552 16.75 30 16.75C29.448 16.75 29 16.302 29 15.75C29 15.198 29.448 14.75 30 14.75Z" fill="#222222"/>
            <path d="M23 8.75C30.732 8.75 37 15.018 37 22.75C37 30.482 30.732 36.75 23 36.75C15.268 36.75 9 30.482 9 22.75C9 15.018 15.268 8.75 23 8.75Z" stroke="#222222" strokeWidth="2"/>
            <path d="M27.889 23.75C27.491 25.703 25.957 27.246 24 27.644V29.672C24.089 29.659 24.178 29.651 24.266 29.635C27.146 29.109 29.411 26.816 29.901 23.929C29.911 23.87 29.908 23.809 29.916 23.75H27.889Z" fill="#222222"/>
            <path d="M29.904 21.581C29.408 18.635 27.094 16.329 24.147 15.843C24.099 15.835 24.048 15.839 24 15.832V17.861C25.961 18.259 27.492 19.788 27.89 21.75H29.918C29.91 21.694 29.913 21.636 29.904 21.581Z" fill="#222222"/>
            <path d="M22 27.639C20.041 27.24 18.508 25.712 18.11 23.75H16.086C16.095 23.815 16.092 23.882 16.103 23.947C16.608 26.875 18.916 29.169 21.846 29.655C21.896 29.663 21.949 29.661 22 29.668V27.639Z" fill="#222222"/>
            <path d="M18.113 21.75C18.511 19.795 20.036 18.255 22 17.856V15.84C21.908 15.853 21.811 15.85 21.72 15.867C18.802 16.407 16.537 18.739 16.082 21.673C16.078 21.698 16.08 21.724 16.076 21.75H18.113Z" fill="#222222"/>
            <path d="M23 20.75C24.105 20.75 25 21.645 25 22.75C25 23.855 24.105 24.75 23 24.75C21.895 24.75 21 23.855 21 22.75C21 21.645 21.895 20.75 23 20.75Z" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Smoke alarm</div>
            </button>
            <button
              onClick={() => setAmenities("First aid kit")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("First aid kit") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 10.5H33C35.209 10.5 37 12.291 37 14.5V30.5C37 32.709 35.209 34.5 33 34.5H13C10.791 34.5 9 32.709 9 30.5V14.5C9 12.291 10.791 10.5 13 10.5Z" stroke="#222222" strokeWidth="2"/>
            <path d="M21 24.5C20.938 25.375 21 28.5 21 28.5H25V24.5H29V20.5H25V16.5H21V20.5H17V24.5C17 24.5 20 24.438 21 24.5Z" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">First aid kit</div>
            </button>
            <button
              onClick={() => setAmenities("Fire extinguisher")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Fire extinguisher") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            >
              <svg width="28px" height="28px" viewBox="7 7 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 15.25C27.314 15.25 30 17.936 30 21.25V36.25C30 36.802 29.552 37.25 29 37.25H19C18.448 37.25 18 36.802 18 36.25V21.25L18.004 21.025C18.122 17.816 20.762 15.25 24 15.25Z" stroke="#222222" strokeWidth="2"/>
            <path d="M15 29.25H19H15Z" stroke="#222222" strokeWidth="2"/>
            <path d="M24 11.25V15.25V11.25Z" stroke="#222222" strokeWidth="2"/>
            <path d="M31 11.25H24C18.477 11.25 14 15.727 14 21.25V34.25" stroke="#222222" strokeWidth="2"/>
            <path d="M24 11.25L29 7.25L24 11.25Z" stroke="#222222" strokeWidth="2"/>
            <path d="M24 13.25C25.105 13.25 26 12.355 26 11.25C26 10.145 25.105 9.25 24 9.25C22.895 9.25 22 10.145 22 11.25C22 12.355 22.895 13.25 24 13.25Z" fill="white"/>
            <path d="M24 13.25C25.105 13.25 26 12.355 26 11.25C26 10.145 25.105 9.25 24 9.25C22.895 9.25 22 10.145 22 11.25C22 12.355 22.895 13.25 24 13.25Z" stroke="#222222" strokeWidth="2"/>
            </svg>
              <div className="type-title ">Fire extinguisher</div>
            </button>
            <button
              onClick={() => setAmenities("Carbon monoxide alarm")}
              className={`btn-amt-apt 
                ${
                  selectedBtnAment.includes("Carbon monoxide alarm") === true
                    ? " btn-amt-selected"
                    : ""
                }
              `}
            ><div className="carbon-alarm">
              <svg width="24px" height="24px" viewBox="6 5 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 14.75C30.552 14.75 31 15.198 31 15.75C31 16.302 30.552 16.75 30 16.75C29.448 16.75 29 16.302 29 15.75C29 15.198 29.448 14.75 30 14.75Z" fill="#222222"/>
            <path d="M23 8.75C30.732 8.75 37 15.018 37 22.75C37 30.482 30.732 36.75 23 36.75C15.268 36.75 9 30.482 9 22.75C9 15.018 15.268 8.75 23 8.75Z" stroke="#222222" strokeWidth="2"/>
            <path d="M27.889 23.75C27.491 25.703 25.957 27.246 24 27.644V29.672C24.089 29.659 24.178 29.651 24.266 29.635C27.146 29.109 29.411 26.816 29.901 23.929C29.911 23.87 29.908 23.809 29.916 23.75H27.889Z" fill="#222222"/>
            <path d="M29.904 21.581C29.408 18.635 27.094 16.329 24.147 15.843C24.099 15.835 24.048 15.839 24 15.832V17.861C25.961 18.259 27.492 19.788 27.89 21.75H29.918C29.91 21.694 29.913 21.636 29.904 21.581Z" fill="#222222"/>
            <path d="M22 27.639C20.041 27.24 18.508 25.712 18.11 23.75H16.086C16.095 23.815 16.092 23.882 16.103 23.947C16.608 26.875 18.916 29.169 21.846 29.655C21.896 29.663 21.949 29.661 22 29.668V27.639Z" fill="#222222"/>
            <path d="M18.113 21.75C18.511 19.795 20.036 18.255 22 17.856V15.84C21.908 15.853 21.811 15.85 21.72 15.867C18.802 16.407 16.537 18.739 16.082 21.673C16.078 21.698 16.08 21.724 16.076 21.75H18.113Z" fill="#222222"/>
            <path d="M23 20.75C24.105 20.75 25 21.645 25 22.75C25 23.855 24.105 24.75 23 24.75C21.895 24.75 21 23.855 21 22.75C21 21.645 21.895 20.75 23 20.75Z" stroke="#222222" strokeWidth="2"/>
            </svg></div>
              <div className="type-title ">Carbon monoxide alarm</div>
            </button>
          </div>
        </section>
      )}
      {sectionProgress === 8 && (
        <section className="new-stay-container step-8">
          <div className="fw600 fs22"> Step 8</div>
          <div className="step-8-title fs24 fw600">Ta-da! How does this look?</div>
          <p className="fs18">
          Click to upload images
          </p>
          <div className="imges-step-container">
            <ImgUploader stay={stayToEdit} addImgStay={addImgStay} deleteImgStay={deleteImgStay}/>
          </div>
        </section>
      )}
      {sectionProgress === 9 && (
        <section className="new-stay-container step-9">
          <div className="fw600 fs22"> Step 9</div>
          <div className="step-9-title fs26 fw600">Now, let's give your {stayToEdit.type} a title</div>
          <p className="fs18 ">
          Short titles work best. Have fun with it—you can always change it later.
          </p>
          <div className="name-stay-container">
           <textarea className="name-stay fs18 " maxlength="32" name="name" value={stayToEdit.name || "" } onChange={handleChange}></textarea>
           <div className="textgray fs14">{stayToEdit.name.length}/32</div>
          </div>
        </section>
      )}
      {sectionProgress === 10 && (
        <section className="new-stay-container step-10">
          <div className="fw600 fs22"> Step 10</div>
          <div className="step-9-title fs26 fw600">Create your description</div>
          <p className="fs18 ">
          Share what makes your place special.
          </p>
          <div className="summry-stay-container">
           <textarea className="summry-stay fs18 " maxlength="500" name="summary" value={stayToEdit.summary || "" } onChange={handleChange}></textarea>
           <div className="textgray fs14">{stayToEdit.summary.length}/500</div>
          </div>
        </section>
      )}
       {sectionProgress === 11 && (
        <section className="new-stay-container step-11">
          <div className="fw600 fs22"> Step 11</div>
          <div className="step-11-title fs30 fw600">Finish up and publish</div>
          <div className="fs18">
          Finally, you'll choose booking settings, set up pricing, and publish your listing.
          </div>
          <div className="video-step-container">
            <video
              className="video-step"
              crossOrigin="anonymous"
              playsInline
              preload="auto"
              muted
              autoPlay
            >
              <source
                src="https://stream.media.muscache.com/KeNKUpa01dRaT5g00SSBV95FqXYkqf01DJdzn01F1aT00vCI.mp4?v_q=high"
                type="video/mp4"
              />
            </video>
          </div>
        </section>
      )}
       {sectionProgress === 12 && (
        <section className="new-stay-container step-12">
          <div className="fw600 fs22"> Step 12</div>
          <div className="step-12-title fs30 fw600">Now, set your price</div>
          <p className="fs18">
          You can change it anytime.
          </p>
          <div className="price-step-container">
          <div className="price-step-show flex">
            <input className="fs30" type="number" name="price" value={stayToEdit.price|| 0}  onChange={handleChange}/> 
          </div>
          <Box sx={{ width: 300 }}>
      <Slider
        className="slider-color"
        getAriaLabel={() => "Temperature range"}
        value={stayToEdit.price}
        onChange={handleChange}
        name="price"
        valueLabelDisplay="auto"
        max={2000}
      />
    </Box>
          </div>
        </section>
      )}
       {sectionProgress === 13 && (
        <section className="new-stay-container step-13">
          <div className="step-13-title fs32 fw600">Review your listing</div>
          <p className="fs18">
          Here's what we'll show to guests. Make sure everything looks good.
          </p>
          <div className="review-step-container">
            <div className="card-prev-edit">
              <img src={stayToEdit.imgUrls[0]}/>
              <div className="prev-title-container flex justify-between algin-center">
              <div className="prev-title fs18">{stayToEdit.name}</div>
              <div className="prev-rating flex align-center ">
              <span className="rating-content">New </span> <i className="fa-solid fa-star fs12 "></i>
              </div>

              </div>
              <div className="prev-price-container fs18">
                <span className="price fw600">${stayToEdit.price}</span> night</div>
            </div>
              <div className="dis-titels-container">
                <div className="fs24 fw600" > What's next?</div>
                <div className="card-titles flex">
                <div className="icon-card">
                <GoChecklist size="28" /> 
                </div>
                <div className="card-content">
                  <div className="card-title fs18 fw600">Confirm a few details and publish</div>
                  <div className="fs16 graytxt">We’ll let you know if you need to verify your identity or register with the local government.</div>
                </div>
                </div>
                <div className="card-titles flex">
                  <div className="icon-card">
                <CiCalendar size="28" /> 
                  </div>
                <div className="card-content">
                  <div className="card-title fs18 fw600">Set up your calendar</div>
                  <div className="fs16 graytxt">Choose which dates your listing is available. It will be visible 24 hours after you publish.</div>
                </div>
                </div>
                <div className="card-titles flex">
                <div className="icon-card">
                <GoPencil size="28" />
                </div>
                 <div className="card-content">
                  <div className="card-title fs18 fw600">Adjust your settings</div>
                  <div className="fs16 graytxt">Set house rules, select a cancellation policy, choose how guests book, and more.</div>
                </div>
                </div>
              </div>
          </div>
        </section>
      )}
       {sectionProgress === 14 && (
        <section className="new-stay-container step-14">
          <div className="step-14-title fs32 fw600">Congratulations, {stayToEdit.host.fullname}!</div>
          <p className="fs18">
          From one Host to another—welcome aboard. Thank you for sharing your home and helping to create incredible experiences for our guests.
          </p>
          <div className="img-container">
          <img src="https://res.cloudinary.com/dlscarx4f/image/upload/v1705077322/bajtpsugscmuikptweve.png"/>
          <p className="fs12">
            Boris Kho, CEO
          </p>
          </div>
        </section>
      )}
      <section className="footer-edit flex column">
        <div className="footer-bar">
          <div className={`bar-progress  ${sectionProgress>0?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>1?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>2?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>3?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>4?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>5?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>6?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>7?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>8?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>9?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>10?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>11?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>12?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>13?"step-done":" "}`}></div>
          <div className={`bar-progress  ${sectionProgress>14?"step-done":" "}`}></div>
        </div>
       <div className="btns-footer-edit">
        {sectionProgress !== 0 && sectionProgress !== 14&& (
          <button className="btn-footer-edit btn-back-level" onClick={() => changeSection(-1)}>
            Back
          </button>
        )}
       {sectionProgress ===0 &&  <button className="btn-footer-edit btn-get-started" onClick={(() => changeSection(1))}>
        Get started
        </button>}
       {sectionProgress !==0 &&  <button className="btn-footer-edit btn-next-level" onClick={sectionProgress !== 14?(() => changeSection(1)):(() => onSave())}>
          {sectionProgress !== 14?'Next':'Check your list'}
        </button>}
        </div>
      </section>
    </section>
  )
}
  