import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'
import { PriceRange } from './PriceRange'
import { stayService } from '../services/stay.service'

export function Filter({ onSetFilter, setFilterByToEdit, filterByToEdit, setIsOpenFilter, isOpenFilter }) {
  const [tempFilter, setTempFilter] = useState(filterByToEdit)
  const [selectedBedrooms, setSelectedBedrooms] = useState(null)
  const [selectedBeds, setSelectedBeds] = useState(null)
  const [selectedBathrooms, setSelectedBathrooms] = useState(null)
  const [selectedPriceMin, setSelectedPriceMin] = useState(0)
  const [selectedPriceMax, setSelectedPriceMax] = useState(2000)

  useEffectUpdate(() => {
    onSetFilter.current(filterByToEdit)
  }, [filterByToEdit])

  const handleChange = (e, target, category, type = 'number') => {
    e.preventDefault()
    let { value, name: field } = target
    value = type === 'number' ? +value : value

    let newValue = value;
    if ((category === 'bedrooms' && selectedBedrooms === value) ||
      (category === 'beds' && selectedBeds === value) ||
      (category === 'bathrooms' && selectedBathrooms === value)) {
      newValue = null;
    }

    setTempFilter(prevFilter => ({ ...prevFilter, [field]: newValue }))

    if (category === 'bedrooms') setSelectedBedrooms(newValue)
    if (category === 'beds') setSelectedBeds(newValue)
    if (category === 'bathrooms') setSelectedBathrooms(newValue)
  }


  function handlePriceMinMaxChange(ev) {
    const { name, value } = ev.target
    if (name === 'min') {
      setSelectedPriceMin(+value)
    } else {
      setSelectedPriceMax(+value)
    }
    //  console.log(selectedPriceMin ,selectedPriceMax ,'selected');
    const priceRange = [selectedPriceMin, selectedPriceMax]
    //  console.log(priceRange);
    setTempFilter(prevFilter => ({
      ...prevFilter,
      priceRange: priceRange,
    }))
  }

  const handlePriceRangeChange = priceRange => {
    setSelectedPriceMin(priceRange[0])
    setSelectedPriceMax(priceRange[1])
    // console.log(selectedPriceMin ,selectedPriceMax ,'selected');
    setTempFilter(prevFilter => ({
      ...prevFilter,
      priceRange: priceRange,
    }))
  }

  const handleApplyFilter = () => {
    setFilterByToEdit(tempFilter)
  }

  const handleClearAll = (e) => {
    e.preventDefault()
    const defaultFilter = stayService.getDefaultFilter()

    setTempFilter(defaultFilter)
    setSelectedBedrooms(defaultFilter.bedrooms || null)
    setSelectedBeds(defaultFilter.beds || null)
    setSelectedBathrooms(defaultFilter.bathrooms || null)

    // Update the parent component's state
    setFilterByToEdit(defaultFilter)
  }

  const renderButtons = (name, maxNumber, selectedValue) => {
    const buttons = []
    for (let i = 1; i <= maxNumber; i++) {
      const isSelected = selectedValue === i
      buttons.push(
        <button
          key={i}
          className={`clean-btn ${isSelected ? 'selected-option' : ''}`}
          value={i}
          name={name}
          type="button"
          onClick={e => handleChange(e, e.target, name)}
        >
          {i === maxNumber ? `${i}+` : i}
        </button>
      )
    }
    return buttons
  }

  return (
    <section>
      <div className="filter-modal-container">
        <header className='filter-modal-header flex cloumn bold blacktxt'>
          <div className='pointer' onClick={() => { setIsOpenFilter(false); }}><i className="fa-solid fa-x"></i></div><div className='filter-header-title'>Filters</div>
        </header>

        <div className='filter-modal-mid flex column  divider'>
          <div className='fs22 bold blacktxt'>Price range</div>
          <div className='fs14 blacktxt'>Nightly prices including fees and taxes</div>
          <div className='price-min-max flex align-center'>
            <label className='min-price'>
              <span>Min price</span>
              <input name="min" type='number' onChange={handlePriceMinMaxChange}
                value={selectedPriceMin || 0} min="0" max="2000"
              />
            </label>
            <div className="range ">
              <PriceRange handlePriceRangeChange={handlePriceRangeChange} selectedPriceMin={selectedPriceMin} selectedPriceMax={selectedPriceMax} />
            </div>
            <label className='max-price' >
              <span>Max price</span>
              <input name="max" type='number' onChange={handlePriceMinMaxChange}
                value={selectedPriceMax || 0} min="0" max="2000" />

            </label>
          </div>
          {/* <div className="range">
            <PriceRange handlePriceRangeChange={handlePriceRangeChange} selectedPriceMin={selectedPriceMin} selectedPriceMax={selectedPriceMax}/>
          </div> */}
        </div>
        <div className='filter-modal-bottom flex column divider'>
          <div className='flex align-center fs22 bold blacktxt'>Rooms and beds</div>
          <div className="by-rooms">
            <div className='fs16 blacktxt'>Bedrooms</div>
            {renderButtons('bedrooms', 7, selectedBedrooms)}
          </div>
          <div className="by-beds">
            <div className='fs16 blacktxt'>Beds</div>
            {renderButtons('beds', 7, selectedBeds)}
          </div>
          <div className="by-bathrooms">
            <div className='fs16 blacktxt'>Bathrooms</div>
            {renderButtons('bathrooms', 7, selectedBathrooms)}
          </div>
        </div>
        <footer className="filter-footer flex justify-between divider">
          <button className="clean-btn" onClick={handleClearAll}>Clear all</button>
          <button className="show-btn flex align-center clean-btn" onClick={handleApplyFilter}>Show places</button>
        </footer>
      </div>
      <div className="screen-shadow"></div>
    </section>
  )
}
