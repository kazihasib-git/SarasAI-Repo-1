import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'moment/locale/en-gb';
import './BigCal.css';

import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import ScheduleSession from '../availability/ScheduleSession';
import { useDispatch } from 'react-redux';
import { openSessionEvent } from '../../redux/features/adminModule/ta/taAvialability';
import { openCoachSessionEvent } from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { openSessionPopup } from '../../redux/features/commonCalender/commonCalender';
moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);

const formats = {
    timeGutterFormat: 'h:mm A', // Time format with AM/PM
};

const CustomEvent = ({ event }) => {
    return (
        <div
            style={{
                color: 'white',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8em',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    fontSize: '0.9em',
                    height: '28px',
                    maxWidth: 'calc(100% - 70px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {event.meetingName}
            </div>
            <div
                style={{
                    fontSize: '0.9em',
                    color: '#28a745',
                    // backgroundColor: 'white',
                    // borderRadius: '5px',
                    // height: '28px',
                    // maxWidth: '200px',
                    // display: 'flex',
                    // alignItems: 'center',
                    // justifyContent: 'center',
                    // padding: '2px 5px',

                    // minWidth: '35px',
                    // maxWidth: 'calc(100% - 70px)',
                }}
            >
                {event.platformName}
            </div>
        </div>
    );
};

const CalendarComponent = ({ eventsList, slotData, componentName }) => {
    const dispatch = useDispatch();
    console.log('Event List', eventsList);

    console.log('Slot Data : ', slotData);

    console.log('comp name', componentName);

    let sliceName, openPopup;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvialability';
            openPopup = openSessionEvent;
            break;
        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            openPopup = openCoachSessionEvent;
            break;
        case 'TAMENU':
            sliceName = 'taMenu';
            openPopup = openSessionPopup;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            openPopup = openSessionPopup;
            break;

        default:
            sliceName = null;
            openPopup = null;
            break;
    }

    // const showSessionPopUp = event => {
    //     console.log('Selected Event:', event);
    //     dispatch(openPopup(event));
    // };

    const showSessionPopUp = event => {
        dispatch(
            openPopup({
                ...event,
                meetingName: event.meetingName,
                platformName: event.platformName,
            })
        );
    };

    const eventStyleGetter = event => {
        console.log('EVENT : ', event);
        return {
            style: {
                backgroundColor: '#28a745', // Match the green color in your design
                color: 'white',
                borderRadius: '5px',
                border: '1px solid #caffd8',
                width: '95%',
                left: '6%',
                bottom: '0%',
            },
        };
    };

    const slotPropGetter = date => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const timeString = moment(date).format('HH:mm');

        for (let i = 0; i < slotData.length; i++) {
            const slot = slotData[i];
            const slotDate = moment(slot.startDate).format('YYYY-MM-DD');
            const slotStartTime = moment(slot.startDate).format('HH:mm');
            const slotEndTime = moment(slot.endDate).format('HH:mm');
            if (
                dateString === slotDate &&
                timeString >= slotStartTime &&
                timeString < slotEndTime
            ) {
                return {
                    style: {
                        backgroundColor:
                            slot.leave && slot.leave.length > 0
                                ? '#FF6347' // Light red color for leave slots
                                : '#B0FC38', // Green color for regular slots
                        opacity: 0.5,
                        border: 'none',
                    },
                };
            }
        }
        return {};
    };

    return (
        <>
            {/* <Header />
      <Sidebar /> */}
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
                    components={{
                        event: CustomEvent, // Use the custom event component
                    }}
                    formats={formats}
                />
            </div>
        </>
    );
};

export default CalendarComponent;
