import React, { useState, useEffect } from 'react';

export function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  // useEffect(() => {

  // }, [currentMonth]);

  const isCheckInDay = (day) => {
    return day?.getTime() === selectedDates.checkIn?.getTime();
  };

  const isCheckOutDay = (day) => {
    return day?.getTime() === selectedDates.checkOut?.getTime();
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

  const goToNextMonths = (event) => { // Changed 'ev' to 'event'
    event.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 1));
  };

  const goToPrevMonths = (event) => { // Changed 'ev' to 'event'
    event.preventDefault();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 2, 1));
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

    const { checkIn, checkOut } = selectedDates;

    if (checkIn && day.getTime() === checkIn.getTime() || checkIn && day.getTime() < checkIn.getTime() && !checkOut) { // אם בחרתי את אותו היום שנבחר בצאק אין או לפני אז תאפס הכל
      setSelectedDates({ checkIn: null, checkOut: null });
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setSelectedDates({ checkIn: day, checkOut: null });
    } else if (day > checkIn) {
      setSelectedDates({ ...selectedDates, checkOut: day });
    }
  };


  const isInRange = (day) => {
    const { checkIn, checkOut } = selectedDates;
    return day > checkIn && day < checkOut;
  };

  const renderCalendar = (date) => {
    const monthDays = generateCalendarDays(date);
    const monthName = formatMonthName(date);

    return (
      <div className="calendar-month">
        <div className='month-name flex justify-center'>{monthName}</div>
        <div className="calendar-header">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="calendar-header-day">{day}</div>
          ))}
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
  };

  return (
    <div className="airbnb-calendar flex column align-center">
      <div className="calendar-controls">
        <button onClick={goToPrevMonths}>Previous Months</button>
        <button onClick={goToNextMonths}>Next Months</button>
      </div>
      <div className="flex">
        {renderCalendar(currentMonth)}
        {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
      </div>
    </div>
  );
};