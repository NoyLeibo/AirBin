import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setSelectedDates, setSelectedDestination, setSelectedGuests } from '../store/stay.actions';
import { StayFilter } from '../cmps/StayFilter';

export function StayFilterBy() {
    const location = useLocation();
    const filterBy = useSelector((storeState) => storeState.stayModule.filterBy);
    const queryParams = new URLSearchParams(location.search);
    const dispatch = useDispatch();

    useEffect(() => {
        const selectedDestination = queryParams.get('location');
        const checkInDate = queryParams.get('checkIn');
        const checkOutDate = queryParams.get('checkOut');
        const adults = queryParams.get('adults');
        const children = queryParams.get('children');
        const infants = queryParams.get('infants');
        const pets = queryParams.get('pets');
        const totalGuests = { Adults: adults, Children: children, Infants: infants, Pets: pets };

        dispatch(setSelectedDates({ checkIn: checkInDate, checkOut: checkOutDate }));
        dispatch(setSelectedDestination(selectedDestination));
        dispatch(setSelectedGuests(totalGuests));
    }, [location.search]);  // Depend on location.search so this runs only when query params change

    console.log('filterBy: ', filterBy);

    return (
        <main>
            <StayFilter filterBy={filterBy} />
            {/* <StayList stays={stays} /> */}
        </main>
    );
}
