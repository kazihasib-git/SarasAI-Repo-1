// CalendarComponent.jsx
import React, { useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import "moment/locale/en-gb";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import ScheduleSession from "../availability/ScheduleSession";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

const myEventsList = [
  {
    title: "test",
    start: new Date(currentYear, 6, 9, 10, 0), // July 21st, currentYear at 13:45
    end: new Date(currentYear, 6, 9, 12, 15),   // July 25th, currentYear at 14:00
    isSlot: false
  },
  
];

const CalendarComponent = ({ eventsList, addEvent,slotData /*,handleSelectEvent*/ }) => {
  // const [eventsList, setEventsList] = useState([]);

  // const handleSelectSlot = ({ start, end }) => {
  //   const title = window.prompt("New Event name");
  //   if (!title) return;
  //   const startDateTime = window.prompt("Enter start date and time (YYYY-MM-DD HH:MM)", moment(start).format("YYYY-MM-DD HH:mm"));
  //   const endDateTime = window.prompt("Enter end date and time (YYYY-MM-DD HH:MM)", moment(end).format("YYYY-MM-DD HH:mm"));

  //   const newStart = moment(startDateTime, "YYYY-MM-DD HH:mm").toDate();
  //   const newEnd = moment(endDateTime, "YYYY-MM-DD HH:mm").toDate();

  //   // setEventsList(prev => [...prev, { title, start: newStart, end: newEnd }]);
  //   addEvent(title, newStart, newEnd); 
  // };

  const showSessionPopUp = () => {
    console.log("clicked");
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = event.isSlot ? 'green' : 'green';
    return {
      style: {
        backgroundColor,
        opacity: 1,
        borderRadius: '5px',
        color: 'white',
        border: '0px',
        display: 'block',
        
      }
    };
  };

  const slotPropGetter = (date) => {
    if (slotData) {
      // Iterate over each slot object in slotData
      
      for (let i = 0; i < slotData.data.length; i++) {
        
        const slot = slotData.data[i];
        const startDate = new Date(slot.slot_date + 'T' + slot.from_time); // Combine date and time
        const endDate = new Date(slot.slot_date + 'T' + slot.to_time); // Combine date and time
  
        // Check if the date falls within the slot's time range
        if (date >= startDate && date <= endDate) {
          return {
            style: {
              backgroundColor: '#B0FC38', // Example background color
              opacity: 0.5,
              border: '0px'
            }
            // You can add more properties here based on slotData
          };
        }
      }
    }
    return {};
  };
  

  return (
    <>
      <Header />
      <Sidebar />
      <div style={{ height: 700 }}>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          startAccessor="start"
          endAccessor="end"
          // dayLayoutAlgorithm="overlap"
          events={myEventsList} // Use your events list here
          eventPropGetter={eventStyleGetter}
          slotPropGetter={slotPropGetter}
          onSelectEvent={showSessionPopUp}
          step={60}
          selectable
        />
      </div>
    </>
  );
};

export default CalendarComponent;
