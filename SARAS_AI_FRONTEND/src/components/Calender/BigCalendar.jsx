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
import CustomDateField from '../CustomFields/CustomDateField';
import { BorderLeft } from '@mui/icons-material';
moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const allViews = Object.keys(Views).map(k => Views[k]);

const formats = {
    timeGutterFormat: 'h:mm A', // Time format with AM/PM
};

const CustomEvent = ({ event }) => {
    let platformTools = { ...event.platform_tools };

    if (platformTools.name === 'Microsoft Teams') {
        platformTools.name = 'Teams';
    } else if (platformTools.name === 'Big Blue Button') {
        platformTools.name = 'BBB';
    } else if (platformTools.name === 'ZOOM') {
        platformTools.name = 'Zoom';
    }

    event.platform_tools = platformTools;

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
                    backgroundColor: 'white',
                    borderRadius: '5px',
                    height: '28px',
                    maxWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 5px',
                    flexShrink: 0, // Prevents shrinking of platform name
                    minWidth: '35px', // Minimum width for platform name
                    maxWidth: 'calc(100% - 70px)', // Ensures it doesn't exceed container width
                }}
            >
                {event.platform_tools.name}
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
                backgroundColor: '#00C95C', // Match the green color in your design
                color: 'white',
                borderRadius: '5px',
                border: '1px solid #caffd8',
                width: '95%',
                left: '6%',
                bottom: '0%',
            },
        };
    };
    const dayPropGetter = date => {
        const today = moment().startOf('day');

        if (moment(date).isSame(today, 'day')) {
            return {
                style: {
                    backgroundColor: '#4e18a5', // Light blue background for the current day header and cells
                    //color: '#1976D2', // Blue text color for the current day header and cells
                },
            };
        }
        return {};
    };

    const slotPropGetter = date => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const timeString = moment(date).format('YYYY-MM-DD HH:mm');

        // Iterate over slotData to find a matching slot
        for (let i = 0; i < slotData.length; i++) {
            const slot = slotData[i];
            const slotDate = moment(slot.startDate).format('YYYY-MM-DD');
            const slotStartTime = moment(slot.startDate).format(
                'YYYY-MM-DD HH:mm'
            );
            const slotEndTime = moment(slot.endDate).format('YYYY-MM-DD HH:mm');

            const isOnLeave = slot.leave && slot.leave.length > 0;

            if (
                dateString === slotDate &&
                timeString >= slotStartTime &&
                timeString < slotEndTime
            ) {
                // Return the style and className only for the first matching slot
                return {
                    style: {
                        backgroundColor: isOnLeave
                            ? '#FF00001F' // Light red color for leave slots
                            : '#B0FC38', // Green color for regular slots
                        opacity: 0.5,
                        border: 'none',
                    },
                    className: isOnLeave ? 'on-leave-slot' : '',
                };
            }
        }

        // If no matching slot is found, return an empty object
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
                    dayPropGetter={dayPropGetter}
                    slotPropGetter={slotPropGetter}
                    onSelectEvent={showSessionPopUp}
                    step={30}
                    selectable
                    views={{ week: true }} // Only show week view
                    defaultView={Views.WEEK} // Set default view to week
                    components={{
                        event: CustomEvent, // Use the custom event component
                        //toolbar: CustomToolbar,
                    }}
                    formats={formats}
                />
            </div>
        </>
    );
};

export default CalendarComponent;
