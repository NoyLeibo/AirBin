import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffectUpdate } from '../customHooks/useEffectUpdate'
import { PriceRange } from './PriceRange'
import { stayService } from '../services/stay.service'

export function Filter({ onSetFilter, setFilterByToEdit, filterByToEdit }) {
  const [tempFilter, setTempFilter] = useState(filterByToEdit)
  const [selectedBedrooms, setSelectedBedrooms] = useState(null)
  const [selectedBeds, setSelectedBeds] = useState(null)
  const [selectedBathrooms, setSelectedBathrooms] = useState(null)

  useEffectUpdate(() => {
    onSetFilter.current(filterByToEdit)
  }, [filterByToEdit])

  const handleChange = (e, target, category, type = 'number') => {
    e.preventDefault()
    let { value, name: field } = target
    value = type === 'number' ? +value : value
    setTempFilter(prevFilter => ({ ...prevFilter, [field]: value }))

    if (category === 'bedrooms') setSelectedBedrooms(value)
    if (category === 'beds') setSelectedBeds(value)
    if (category === 'bathrooms') setSelectedBathrooms(value)
  }

  const handlePriceRangeChange = priceRange => {
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
    <section className="filter-modal-container">
      <div className="by-price-range">
        <h2>Price range</h2>
        <div>Nightly prices including fees and taxes</div>
        <div className="range">
          <PriceRange handlePriceRangeChange={handlePriceRangeChange} />
        </div>
      </div>
      <h2>Rooms and beds</h2>
      <div className="by-rooms">
        <div>Bedrooms</div>
        {renderButtons('bedrooms', 7, selectedBedrooms)}
      </div>
      <div className="by-beds">
        <div>Beds</div>
        {renderButtons('beds', 7, selectedBeds)}
      </div>
      <div className="by-bathrooms">
        <div>Bathrooms</div>
        {renderButtons('bathrooms', 7, selectedBathrooms)}
      </div>
      <footer className="filter-footer flex justify-between divider">
        <button className="clean-btn" onClick={handleClearAll}>Clear all</button>
        <button className="show-btn clean-btn" onClick={handleApplyFilter}>Show places</button>
      </footer>
    </section>
  )
}
