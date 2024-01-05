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
        <section className='guest-modal flex column'>
            <div>
                {/* Adults Section */}
                <div className='guest-section flex row'>
                    <div className='guest-title'>
                        <h3 className='guest-modal-title'>Adults</h3>
                        <span className='guest-modal-subtitle fs12'>Ages 13 or above</span>
                    </div>
                    <div className='change-guests flex row align-center justify-between'>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleAdultsChange(-1, e)}><i class="fa-solid fa-minus fa-l"></i></button>
                        <span className='fs16'>{numberOfAdults}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleAdultsChange(1, e)}><i class="fa-solid fa-plus fa-l"></i></button>
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
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleChildrenChange(-1, e)}><i class="fa-solid fa-minus fa-l"></i></button>
                        <span className='fs16'>{numberOfChildren}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleChildrenChange(1, e)}><i class="fa-solid fa-plus fa-l"></i></button>
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
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleInfantsChange(-1, e)}><i class="fa-solid fa-minus fa-l"></i></button>
                        <span className='fs16'>{numberOfInfants}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handleInfantsChange(1, e)}><i class="fa-solid fa-plus fa-l"></i></button>
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
                        <button className='clean-btn change-guest-btn' onClick={(e) => handlePetsChange(-1, e)}><i class="fa-solid fa-minus fa-l"></i></button>
                        <span className='fs16'>{numberOfPets}</span>
                        <button className='clean-btn change-guest-btn' onClick={(e) => handlePetsChange(1, e)}><i class="fa-solid fa-plus fa-l"></i></button>
                    </div>
                </div>
            </div>
        </section>
    );
}
