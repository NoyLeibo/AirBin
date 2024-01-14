import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

export function StayFilterBy() {
    const location = useLocation();
    const stays = useSelector((storeState) => storeState.stayModule.stays);

    const queryParams = new URLSearchParams(location.search);
    const selectedDestination = queryParams.get('location');
    const checkInDate = queryParams.get('checkIn');
    const checkOutDate = queryParams.get('checkOut');
    const totalGuests = queryParams.get('selectedGuests');

    console.log(selectedDestination);
    console.log(checkOutDate);
    console.log(totalGuests);
}