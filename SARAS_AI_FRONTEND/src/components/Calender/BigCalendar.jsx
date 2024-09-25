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

const formatTime = date => {
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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8em',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box',
            }}
        >
            <div
                style={{
                    fontSize: '0.9em',
                    maxWidth: 'calc(100% - 50px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'DM Sans',
                    fontWeight: '500',
                    overflow: 'hidden',     
                    textOverflow: 'ellipsis',
                    wordWrap: 'break-word',
                    whiteSpace: 'normal',
                    maxHeight: '96%',
                    marginRight: '4px',
                }}
            >
                <span
                    style={{
                        marginTop: '5px',
                    }}
                >
                    {event.meetingName}
                </span>
            </div>
            <div
                style={{
                    fontSize: '0.9em',
                    fontFamily: 'DM Sans',
                    fontWeight: '600',
                    color: '#28a745',
                    backgroundColor: 'white',
                    borderRadius: '18px',
                    height: '28px',
                    maxWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2px 5px',
                    flexShrink: 0,
                    minWidth: '50px',
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
            openPopup = openSessionPopup;
            break;

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
                borderWidth: '1px 0px 1px 0px',  // Setting specific border widths
                borderStyle: 'solid',             // Solid border style
                borderColor: '#00C95C',           // Green border color
                boxShadow: '0px 6px 20px 0px #00C95C4D' // Adding box shadow
            }
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
                if (isOnLeave) {
                    const slotStart = moment(slot.startDate).add(2, 'minute');
                    const slotEnd = moment(slot.endDate);
                    const slotMidpoint = slotStart
                        .clone()
                        .add(slotEnd.diff(slotStart) / 2, 'milliseconds');

                    const isMiddleSlot =
                        Math.abs(moment(date).diff(slotMidpoint, 'minutes')) <
                        2;

                    return {
                        style: {
                            backgroundColor: '#FF00001F',
                            opacity: 0.5,
                            border: 'none',
                        },
                        className: isMiddleSlot ? 'on-leave-slot' : '',
                    };
                } else {
                    return {
                        style: {
                            backgroundColor: '#74f798',
                            opacity: 0.5,
                            border: 'none',
                        },
                    };
                }
            }
        }

        return {};
    };

    const getScrollToTime = () => {
        const currentTime = moment();

        if (currentTime.hour() >= 4) {
            return currentTime.subtract(4, 'hours').toDate();
        } else if (currentTime.hour() >= 2) {
            return currentTime.subtract(2, 'hours').toDate();
        } else {
            return currentTime.toDate();
        }
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
                scrollToTime={getScrollToTime()}
                step={5}
                timeslots={12}
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
