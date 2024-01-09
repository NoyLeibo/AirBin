import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { stayService } from "../services/stay.service.local.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import "@fortawesome/fontawesome-free/css/all.min.css"

export function StayEdit() {
  const labels = useSelector((storeState) => storeState.stayModule.lables)
  const isLoading = useSelector((storeState) => storeState.stayModule.isLoading)
  const [stayToEdit, setStayToEdit] = useState(stayService.getEmptyStay())

  const { stayId } = useParams()
  const navigate = useNavigate()
  console.log(stayToEdit)

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
    if (name === "area" || name === "country" || name === "city" || name === "address") {
      const locationField = name === "area" ? "area" : name === "country" ? "country" : name === "city" ? "city" : "address"
      setStayToEdit((prevStay) => ({
        ...prevStay,
        loc: {
          ...prevStay.loc,
          [locationField]:newValue,
        }
      }))
    } else if (name === "capacity" || name === "rooms" || name === "beds" || name === "bathrooms") {
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
      <h1>Edit / Add Stay</h1>

      <form  className="edit-form-container">
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
              <select onChange={handleChange} type='number' name="discount">
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
                <option value="Fire extinguisher">Fire extinguisher
                </option>
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
