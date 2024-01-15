import React, { useState, useEffect } from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useSelector, useDispatch } from "react-redux";
import { setSelectedDates as setSelectedDatesAction } from '../store/stay.actions';

export function Calendar({ filterBy, setFilterBy }) {
  const [leftMonth, setLeftMonth] = useState(new Date());
  const [rightMonth, setRightMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));
  // const filterBy = useSelector((storeState) => storeState.stayModule.filterBy)
  // const selectedDates = filterBy.selectedDates

  const isCheckInDay = (day) => {
    return day?.getTime() === filterBy.selectedDates.checkIn?.getTime();
  };

  const isCheckOutDay = (day) => {
    return day?.getTime() === filterBy.selectedDates.checkOut?.getTime();
  };

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      daysArray.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(year, month, i));
    }

    return daysArray;
  };


  const goToNextRightMonth = (event) => {
    event.preventDefault();
    const newLeftMonth = new Date(rightMonth.getFullYear(), rightMonth.getMonth(), 1);
    const newRightMonth = new Date(newLeftMonth.getFullYear(), newLeftMonth.getMonth() + 1, 1);

    setLeftMonth(newLeftMonth);
    setRightMonth(newRightMonth);
  };

  const goToPrevLeftMonth = (event) => {
    event.preventDefault();
    const newLeftMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1);
    const newRightMonth = new Date(newLeftMonth.getFullYear(), newLeftMonth.getMonth() + 1, 1);

    setLeftMonth(newLeftMonth);
    setRightMonth(newRightMonth);
  };
  const isPastDay = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date && date < today;
  };

  const formatDate = (date) => {
    return date ? date.getDate() : '';
  };

  const formatMonthName = (date) => {
    const month = date.toLocaleString('en-US', { month: 'long' });// לשנות את en-US לdefault בשביל לשנות לעברית(השפה הגלובלית במחשב)
    const year = date.getFullYear();
    return `${month} ${year}`;
  };


  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const selectDate = (day) => {
    if (!day || isPastDay(day)) return;

    const { checkIn, checkOut } = filterBy.selectedDates;

    if (checkIn && day.getTime() === checkIn.getTime() || checkIn && day.getTime() < checkIn.getTime() && !checkOut) { // אם בחרתי את אותו היום שנבחר בצאק אין או לפני אז תאפס הכל
      setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkIn: null, checkOut: null } }))
      // dispatch(setSelectedDatesAction({ checkIn: null, checkOut: null }))
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkIn: day, checkOut: null } }))
      // dispatch(setSelectedDatesAction({ checkIn: day, checkOut: null }));
    } else if (day > checkIn) {
      setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkIn, checkOut: day } }))
      // dispatch(setSelectedDatesAction({ ...selectedDates, checkOut: day }))
    }
  };

  const isInRange = (day) => {
    const { checkIn, checkOut } = filterBy.selectedDates;
    return day > checkIn && day < checkOut;
  };

  const renderCalendar = (date, isLeftCalendar) => {
    const monthDays = generateCalendarDays(date);
    const monthName = formatMonthName(date);

    return (
      <div className="calendar-month">
        <div className="month-header">
          <div className={`month-navigation ${isLeftCalendar ? 'month-prev' : 'month-next'}`}>
            {isLeftCalendar && (
              <NavigateBeforeIcon className="prev-month" onClick={goToPrevLeftMonth} />
            )}
            <div className='month-name'>{monthName}</div>
            {!isLeftCalendar && (
              <NavigateNextIcon className="next-month" onClick={goToNextRightMonth} />
            )}
          </div>
          <div className="calendar-header">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="calendar-header-day">{day}</div>
            ))}
          </div>
        </div>
        <div className="calendar-body">
          {monthDays.map((day, index) => (
            <div key={index}
              className={`calendar-day${!day ? ' empty-day' : ''} 
                          ${isPastDay(day) ? 'past-day' : ''}
                          ${isInRange(day) ? 'in-range' : ''}
                          ${isCheckInDay(day) ? 'check-in-day' : ''}
                          ${isCheckOutDay(day) ? 'check-out-day' : ''}`}
              onClick={() => selectDate(day)}>
              {formatDate(day)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="airbnb-calendar flex column align-center">
      <div className="flex">
        {renderCalendar(leftMonth, true)}
        {renderCalendar(rightMonth, false)}
      </div>
    </div>
  )
}


// import React, { useState, useEffect } from 'react';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// import { useSelector, useDispatch } from "react-redux";
// import { setSelectedDates as setSelectedDatesAction } from '../store/stay.actions';

// export function Calendar({ setFilterBy, filterBy }) {
//   const dispatch = useDispatch();
//   const [leftMonth, setLeftMonth] = useState(new Date());
//   const [rightMonth, setRightMonth] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1));
//   // const filterBy = useSelector((storeState) => storeState.stayModule.filterBy)
//   const [selectedDates, setSelectedDates] = useState(filterBy.selectedDates)
//   const isCheckInDay = (day) => {
//     return day?.getTime() === selectedDates.checkIn?.getTime();
//   };

//   const isCheckOutDay = (day) => {
//     return day?.getTime() === selectedDates.checkOut?.getTime();
//   };

//   const generateCalendarDays = (date) => {
//     const year = date.getFullYear();
//     const month = date.getMonth();
//     const firstDayOfMonth = new Date(year, month, 1);
//     const daysInMonth = new Date(year, month + 1, 0).getDate();

//     const daysArray = [];
//     for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
//       daysArray.push(null);
//     }
//     for (let i = 1; i <= daysInMonth; i++) {
//       daysArray.push(new Date(year, month, i));
//     }

//     return daysArray;
//   };


//   const goToNextRightMonth = (event) => {
//     event.preventDefault();
//     const newLeftMonth = new Date(rightMonth.getFullYear(), rightMonth.getMonth(), 1);
//     const newRightMonth = new Date(newLeftMonth.getFullYear(), newLeftMonth.getMonth() + 1, 1);

//     setLeftMonth(newLeftMonth);
//     setRightMonth(newRightMonth);
//   };

//   const goToPrevLeftMonth = (event) => {
//     event.preventDefault();
//     const newLeftMonth = new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1);
//     const newRightMonth = new Date(newLeftMonth.getFullYear(), newLeftMonth.getMonth() + 1, 1);

//     setLeftMonth(newLeftMonth);
//     setRightMonth(newRightMonth);
//   };

//   const isPastDay = (date) => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     return date && date < today;
//   };

//   const formatDate = (date) => {
//     return date ? date.getDate() : '';
//   };

//   const formatMonthName = (date) => {
//     const month = date.toLocaleString('en-US', { month: 'long' });// לשנות את en-US לdefault בשביל לשנות לעברית(השפה הגלובלית במחשב)
//     const year = date.getFullYear();
//     return `${month} ${year}`;
//   };


//   const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

//   const selectDate = (day) => {
//     console.log(day)
//     if (!day || isPastDay(day)) return;
//     const { checkIn, checkOut } = selectedDates;

//     if (checkIn && day.getTime() === checkIn.getTime() || checkIn && day.getTime() < checkIn.getTime() && !checkOut) { // אם בחרתי את אותו היום שנבחר בצאק אין או לפני אז תאפס הכל
//       setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkIn: null, checkOut: null } }))
//       // dispatch(setSelectedDatesAction({ checkIn: null, checkOut: null }))
//       return;
//     }

//     if (!checkIn || (checkIn && checkOut)) {
//       setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkIn: day, checkOut: null } }))
//       // dispatch(setSelectedDatesAction({ checkIn: day, checkOut: null }));
//     } else if (day > checkIn) {
//       setFilterBy(prevFilter => ({ ...prevFilter, selectedDates: { checkOut: day, checkIn } }))
//       // dispatch(setSelectedDatesAction({ ...selectedDates, checkOut: day }))
//     }
//     console.log('checkIn ', checkIn, 'checkOut', checkOut);
//   };

//   const isInRange = (day) => {

//     const { checkIn, checkOut } = filterBy.selectedDates;
//     return day > checkIn && day < checkOut;
//   };

//   const renderCalendar = (date, isLeftCalendar) => {
//     const monthDays = generateCalendarDays(date);
//     const monthName = formatMonthName(date);

//     return (
//       <div className="calendar-month">
//         <div className="month-header">
//           <div className={`month-navigation ${isLeftCalendar ? 'month-prev' : 'month-next'}`}>
//             {isLeftCalendar && (
//               <NavigateBeforeIcon className="prev-month" onClick={goToPrevLeftMonth} />
//             )}
//             <div className='month-name'>{monthName}</div>
//             {!isLeftCalendar && (
//               <NavigateNextIcon className="next-month" onClick={goToNextRightMonth} />
//             )}
//           </div>
//           <div className="calendar-header">
//             {daysOfWeek.map((day, index) => (
//               <div key={index} className="calendar-header-day">{day}</div>
//             ))}
//           </div>
//         </div>
//         <div className="calendar-body">
//           {monthDays.map((day, index) => (
//             <div key={index}
//               className={`calendar-day${!day ? ' empty-day' : ''}
//                           ${isPastDay(day) ? 'past-day' : ''}
//                           ${isInRange(day) ? 'in-range' : ''}
//                           ${isCheckInDay(day) ? 'check-in-day' : ''}
//                           ${isCheckOutDay(day) ? 'check-out-day' : ''}`}
//               onClick={() => selectDate(day)}>
//               {formatDate(day)}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="airbnb-calendar flex column align-center">
//       <div className="flex">
//         {renderCalendar(leftMonth, true)}
//         {renderCalendar(rightMonth, false)}
//       </div>
//     </div>
//   )
// }  