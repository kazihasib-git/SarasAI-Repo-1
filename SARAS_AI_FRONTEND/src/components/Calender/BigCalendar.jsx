// CalendarComponent.jsx
import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/en-gb";
// import initialEvents from "./events";  // Import the events

moment.locale("en-GB");
const localizer = momentLocalizer(moment);

const CalendarComponent = () => {
  const [eventsList, setEventsList] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (!title) return;

    // const startTime = window.prompt("Enter start time (HH:MM)", moment(start).format("HH:mm"));
    // const endTime = window.prompt("Enter end time (HH:MM)", moment(end).format("HH:mm"));
    // const [startHours, startMinutes] = startTime.split(":");
    // const [endHours, endMinutes] = endTime.split(":");
      
    // const newStart = new Date(
    //     start.getFullYear(),
    //     start.getMonth(),
    //     start.getDate(),
    //     startHours,
    //     startMinutes,
    //     0
    //   );
    //   const newEnd = new Date(
    //     end.getFullYear(),
    //     end.getMonth(),
    //     end.getDate(),
    //     endHours,
    //     endMinutes,
    //     0
    //   );
  
    //   setEventsList(prev => [...prev, { title, start: newStart, end: newEnd }]);
    const startDateTime = window.prompt("Enter start date and time (YYYY-MM-DD HH:MM)", moment(start).format("YYYY-MM-DD HH:mm"));
    const endDateTime = window.prompt("Enter end date and time (YYYY-MM-DD HH:MM)", moment(end).format("YYYY-MM-DD HH:mm"));

    const newStart = moment(startDateTime, "YYYY-MM-DD HH:mm").toDate();
    const newEnd = moment(endDateTime, "YYYY-MM-DD HH:mm").toDate();

    setEventsList(prev => [...prev, { title, start: newStart, end: newEnd }]);
    };
    const handleSelectEvent = event => {
        if (window.confirm(`Are you sure you want to delete the event '${event.title}'?`)) {
          setEventsList(prev => prev.filter(e => e !== event));
        }
      };

  return (
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={eventsList}
        step={60}
        selectable
        views={Calendar.Views}
        defaultDate={new Date(2015, 3, 1)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarComponent;
