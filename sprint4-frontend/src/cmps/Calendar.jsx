import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {

  }, [currentMonth]);

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

  const goToNextMonths = (ev) => {
    event.preventDefault()
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 2, 1));
  };

  const goToPrevMonths = (ev) => {
    event.preventDefault()
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

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const renderCalendar = (date) => {
    const monthDays = generateCalendarDays(date);

    return (
      <div className="calendar-month">
        <div className="calendar-header">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="calendar-header-day">{day}</div>
          ))}
        </div>
        <div className="calendar-body">
          {monthDays.map((day, index) => (
            <div key={index} className={`calendar-day${!day ? ' empty-day' : ''} ${isPastDay(day) ? 'past-day' : ''}`}>
              {formatDate(day)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="airbnb-calendar flex column">
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

export default Calendar;