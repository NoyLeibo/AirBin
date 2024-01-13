import React, { useState } from 'react';
import { setSelectedGuests } from '../store/stay.actions';
import { useSelector, useDispatch } from "react-redux";

export function Guests() {
    const selectedGuests = useSelector((storeState) => storeState.stayModule.filterBy.selectedGuests)
    const dispatch = useDispatch();
    console.log(selectedGuests);

    const handleAdultsChange = (increment, event) => {
        event.preventDefault();
        const newNumberOfAdults = selectedGuests.Adults + increment;
        if (newNumberOfAdults >= 0) {
            const updatedGuests = {
                ...selectedGuests,
                Adults: newNumberOfAdults
            };
            dispatch(setSelectedGuests(updatedGuests))
        };
    }
    const handleChildrenChange = (increment, event) => {
        event.preventDefault();
        const newNumberOfChildren = selectedGuests.Children + increment;
        if (newNumberOfChildren >= 0) {
            if (selectedGuests.Adults === 0) {
                selectedGuests.Adults = 1
            }
            const updatedGuests = {
                ...selectedGuests,
                Children: newNumberOfChildren
            };
            dispatch(setSelectedGuests(updatedGuests))
            // setNumberOfChildren(numberOfChildren + increment);
        };
    }
    const handleInfantsChange = (increment, event) => {
        event.preventDefault();
        const newNumberOfInfants = selectedGuests.Infants + increment;
        if (newNumberOfInfants >= 0) {
            if (selectedGuests.Adults === 0) {
                selectedGuests.Adults = 1
            }
            const updatedGuests = {
                ...selectedGuests,
                Infants: newNumberOfInfants
            };
            dispatch(setSelectedGuests(updatedGuests))
            // setNumberOfInfants(numberOfInfants + increment);
        };
    }
    const handlePetsChange = (increment, event) => {
        event.preventDefault();
        const newNumberOfPets = selectedGuests.Pets + increment;
        if (newNumberOfPets >= 0) {
            if (selectedGuests.Adults === 0) {
                selectedGuests.Adults = 1
            }
            const updatedGuests = {
                ...selectedGuests,
                Pets: newNumberOfPets
            };
            dispatch(setSelectedGuests(updatedGuests))
            // setNumberOfPets(numberOfPets + increment);
        };
    }

    return (
        <section className='guest-modal flex column'>
            <div>
                {/* Adults Section */}
                <div className='guest-section flex row'>
                    <div className='guest-title'>
                        <h3 className='guest-modal-title'>Adults</h3>
                        <span className='guest-modal-subtitle fs12'>Ages 13 or above</span>
                    </div>
                    <div className='change-guests flex row align-center justify-between'>
                        {
                            (selectedGuests.Adults === 0 || (selectedGuests.Adults === 1 && selectedGuests.Children >= 1) || (selectedGuests.Adults === 1 && selectedGuests.Infants >= 1) || (selectedGuests.Adults === 1 && selectedGuests.Pets >= 1)) ?
                                <div className='clean-btn change-guest-btn no-drop empty-guest-btn-bgc'><i className="fa-solid fa-minus fa-l"></i></div> :
                                <button className='clean-btn change-guest-btn' onClick={(e) => handleAdultsChange(-1, e)}><i className="fa-solid fa-minus fa-l"></i></button>
                        }
                        <span className='fs16'>{selectedGuests.Adults}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleAdultsChange(1, e)}><i className="fa-solid fa-plus fa-l"></i></button>
                    </div>

                </div>
                <div className='guest-splitter'></div>

                {/* Children Section */}
                <div className='guest-section flex row'>
                    <div className='guest-title'>
                        <h3 className='guest-modal-title'>Children</h3>
                        <span className='guest-modal-subtitle fs12'>Ages 2-12</span>
                    </div>
                    <div className='change-guests flex row align-center justify-between'>
                        {selectedGuests.Children === 0 && <div className='clean-btn change-guest-btn no-drop empty-guest-btn-bgc'><i className="fa-solid fa-minus fa-l"></i></div>}
                        {selectedGuests.Children > 0 && <button className='clean-btn change-guest-btn' onClick={(e) => handleChildrenChange(-1, e)}><i className="fa-solid fa-minus fa-l"></i></button>}
                        <span className='fs16'>{selectedGuests.Children}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleChildrenChange(1, e)}><i className="fa-solid fa-plus fa-l"></i></button>
                    </div>
                </div>
                <div className='guest-splitter'></div>

                {/* Infants Section */}
                <div className='guest-section flex row'>
                    <div className='guest-title'>
                        <h3 className='guest-modal-title'>Infants</h3>
                        <span className='guest-modal-subtitle fs12'>Under 2</span>
                    </div>
                    <div className='change-guests flex row align-center justify-between'>
                        {selectedGuests.Infants === 0 && <div className='clean-btn change-guest-btn no-drop empty-guest-btn-bgc'><i className="fa-solid fa-minus fa-l"></i></div>}
                        {selectedGuests.Infants > 0 && <button className='clean-btn change-guest-btn' onClick={(e) => handleInfantsChange(-1, e)}><i className="fa-solid fa-minus fa-l"></i></button>}

                        <span className='fs16'>{selectedGuests.Infants}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleInfantsChange(1, e)}><i className="fa-solid fa-plus fa-l"></i></button>
                    </div>
                </div>
                <div className='guest-splitter'></div>

                {/* Pets Section */}
                <div className='guest-section flex row'>
                    <div className='guest-title'>
                        <h3 className='guest-modal-title'>Pets</h3>
                        <span className='guest-modal-subtitle fs12'>Bringing a service animal?</span>
                    </div>
                    <div className='change-guests flex row align-center justify-between'>
                        {selectedGuests.Pets === 0 && <div className='clean-btn change-guest-btn no-drop empty-guest-btn-bgc'><i className="fa-solid fa-minus fa-l"></i></div>}
                        {selectedGuests.Pets > 0 && <button className='clean-btn change-guest-btn' onClick={(e) => handlePetsChange(-1, e)}><i className="fa-solid fa-minus fa-l"></i></button>}
                        <span className='fs16'>{selectedGuests.Pets}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handlePetsChange(1, e)}><i className="fa-solid fa-plus fa-l"></i></button>
                    </div>
                </div>
            </div>
        </section>
    );
}