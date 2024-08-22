import React from 'react';
import moment from 'moment';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import 'moment/locale/en-gb';
import './BigCal.css';

import { useDispatch } from 'react-redux';
import { openSessionEvent } from '../../redux/features/adminModule/ta/taAvialability';
import { openCoachSessionEvent } from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { openSessionPopup } from '../../redux/features/commonCalender/commonCalender';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);

const formatTime = (date) => {
    return moment(date).format('h:mma');
};

const formats = {
    timeGutterFormat: (date, culture, localizer) => 
        localizer.format(date, 'h:mm A', culture),
    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
        `${formatTime(start)} - ${formatTime(end)}`,
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
                    flexShrink: 0,
                    minWidth: '35px',
                    maxWidth: 'calc(100% - 70px)',
                }}
            >
                {event.platform_tools.name}
            </div>
        </div>
    );
};

const CalendarComponent = ({ eventsList, slotData, componentName }) => {
    const dispatch = useDispatch();

    let openPopup;

    switch (componentName) {
        case 'TACALENDER':
            openPopup = openSessionEvent;
            break;
        case 'COACHCALENDER':
            openPopup = openCoachSessionEvent;
            break;
        case 'TAMENU':
        case 'COACHMENU':
            openPopup = openSessionPopup;
            break;
        default:
            openPopup = null;
            break;
    }

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
        return {
            style: {
                backgroundColor: '#00C95C',
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
                    backgroundColor: '#4e18a5',
                },
            };
        }
        return {};
    };

    const slotPropGetter = date => {
        const dateString = moment(date).format('YYYY-MM-DD');
        const timeString = moment(date).format('YYYY-MM-DD HH:mm');

        for (let i = 0; i < slotData.length; i++) {
            const slot = slotData[i];
            const slotDate = moment(slot.startDate).format('YYYY-MM-DD');
            const slotStartTime = moment(slot.startDate).format('YYYY-MM-DD HH:mm');
            const slotEndTime = moment(slot.endDate).format('YYYY-MM-DD HH:mm');

            const isOnLeave = slot.leave && slot.leave.length > 0;

            if (
                dateString === slotDate &&
                timeString >= slotStartTime &&
                timeString < slotEndTime
            ) {
                return {
                    style: {
                        backgroundColor: isOnLeave ? '#FF00001F' : '#B0FC38',
                        opacity: 0.5,
                        border: 'none',
                    },
                    className: isOnLeave ? 'on-leave-slot' : '',
                };
            }
        }

        return {};
    };

    return (
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
                views={{ week: true }}
                defaultView={Views.WEEK}
                components={{
                    event: CustomEvent,
                }}
                formats={formats}
            />
        </div>
    );
};

export default CalendarComponent;