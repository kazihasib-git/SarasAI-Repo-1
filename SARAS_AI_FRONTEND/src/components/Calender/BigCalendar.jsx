import React, { useEffect, useState } from "react";
import moment from "moment";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";

import "moment/locale/en-gb";
import "./BigCal.css";

import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import ScheduleSession from "../availability/ScheduleSession";

moment.locale("en-GB");
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);

const CalendarComponent = ({ eventsList, addEvent, slotData }) => {
  const [myEventsList, setMyEventsList] = useState([]);
  const [slots, setSlots] = useState([]);

  /*
  useEffect(() => {
    if (eventsList && eventsList.length > 0) {
      const transformedEvents = eventsList.map(event => ({
        title: event.meeting_name,
        start: new Date(event.date.split(" ")[0] + 'T' + event.start_time),
        end: new Date(event.date.split(" ")[0] + 'T' + event.end_time),
      }));
      setMyEventsList(transformedEvents);
    }
  }, [eventsList]);
  */

  useEffect(() => {
    if (slotData && slotData.data?.length > 0) {
      const transformedSlots = slotData.data.map(slot => ({
        startDate: new Date(slot.slot_date + 'T' + slot.from_time),
        endDate: new Date(slot.slot_date + 'T' + slot.to_time),
      }));
      setSlots(transformedSlots);
    }
  }, [slotData]);

  const showSessionPopUp = () => {
    console.log("clicked");
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "green",
        opacity: 1,
        borderRadius: '5px',
        color: 'white',
        border: '0px',
        display: 'block',
      }
    };
  };

  const slotPropGetter = (date) => {
    
    const dateString = moment(date).format('YYYY-MM-DD');
    const timeString = moment(date).format('HH:mm');

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const slotDate = moment(slot.startDate).format('YYYY-MM-DD');
    const slotStartTime = moment(slot.startDate).format('HH:mm');
    const slotEndTime = moment(slot.endDate).format('HH:mm');


    // Check if the date matches and the time is within the slot's range
    if (dateString === slotDate && timeString >= slotStartTime && timeString < slotEndTime) {
      return {
        style: {
          backgroundColor: '#B0FC38',
          opacity: 0.5,
          border: '0px'
        }
      };
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
          events={eventsList}
          eventPropGetter={eventStyleGetter}
          slotPropGetter={slotPropGetter}
          onSelectEvent={showSessionPopUp}
          step={30}
          selectable
          views={{ week: true }} // Only show week view
          defaultView={Views.WEEK} // Set default view to week
        />
      </div>
    </>
  );
};

export default CalendarComponent;
