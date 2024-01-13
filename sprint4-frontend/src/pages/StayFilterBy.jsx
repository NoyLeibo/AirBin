import { useParams } from 'react-router-dom';

export function StayFilterBy() {
    const params = useParams();
    const { selectedDestination, checkInDate, checkOutDate, totalGuests } = params;

    console.log(selectedDestination);
    console.log(checkOutDate);
    console.log(totalGuests);
}