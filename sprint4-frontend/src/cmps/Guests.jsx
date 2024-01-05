import React, { useState } from 'react';

export function Guests() {
    const [numberOfAdults, setNumberOfAdults] = useState(0);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [numberOfInfants, setNumberOfInfants] = useState(0);
    const [numberOfPets, setNumberOfPets] = useState(0); // Assuming this is for pets

    const handleAdultsChange = (increment, event) => {
        event.preventDefault();
        setNumberOfAdults(numberOfAdults + increment);
    };

    const handleChildrenChange = (increment, event) => {
        event.preventDefault();
        setNumberOfChildren(numberOfChildren + increment);
    };

    const handleInfantsChange = (increment, event) => {
        event.preventDefault();
        setNumberOfInfants(numberOfInfants + increment);
    };
    const handlePetsChange = (increment, event) => {
        event.preventDefault();
        setNumberOfPets(numberOfPets + increment);
    };

    return (
        <div className='guest-modal flex row'>
            {/* Adults Section */}
            <div className='guests-section'>
                <div className='guests-title flex column'>
                    <h3 className='guests-modal-title'>Adults</h3>
                    <span className='guests-modal-subtitle'>Ages 13 or above</span>
                </div>
                <div className='change-guests'>
                    <button onClick={(e) => handleAdultsChange(-1, e)}>-</button>
                    {numberOfAdults}
                    <button onClick={(e) => handleAdultsChange(1, e)}>+</button>
                </div>
            </div>

            {/* Children Section */}
            <div className='guests-section'>
                <div className='guests-title flex column'>
                    <h3 className='guests-modal-title'>Children</h3>
                    <span className='guests-modal-subtitle'>Ages 2-12</span>
                </div>
                <div className='change-guests'>
                    <button onClick={(e) => handleChildrenChange(-1, e)}>-</button>
                    {numberOfChildren}
                    <button onClick={(e) => handleChildrenChange(1, e)}>+</button>
                </div>
            </div>

            {/* Infants Section */}
            <div className='guests-section'>
                <div className='guests-title flex column'>
                    <h3 className='guests-modal-title'>Infants</h3>
                    <span className='guests-modal-subtitle'>Under 2</span>
                </div>
                <div className='change-guests'>
                    <button onClick={(e) => handleInfantsChange(-1, e)}>-</button>
                    {numberOfInfants}
                    <button onClick={(e) => handleInfantsChange(1, e)}>+</button>
                </div>
            </div>
            <div className='guests-section'>
                <div className='guests-title flex column'>
                    <h3 className='guests-modal-title'>Pets</h3>
                    <span className='guests-modal-subtitle'>Bringing a service animal?</span>
                </div>
                <div className='change-guests'>
                    <button onClick={(e) => handlePetsChange(-1, e)}>-</button>
                    {numberOfPets}
                    <button onClick={(e) => handlePetsChange(1, e)}>+</button>
                </div>
            </div>
        </div>
    );
}
