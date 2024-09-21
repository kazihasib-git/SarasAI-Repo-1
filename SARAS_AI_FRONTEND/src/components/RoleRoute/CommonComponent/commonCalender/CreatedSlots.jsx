import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachMenuSessionForLeave } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { getTaMenuSessionForLeave } from '../../../../redux/features/taModule/tamenuSlice';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import {
    closeCreatedSlots,
    openCreatedSessions,
    openSessionPopup,
    setTotalSessionsForMarkLeave,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';
import { convertFromUTC } from '../../../../utils/dateAndtimeConversion';
const headers = ['S. No.', 'Date', 'Slot Time', 'Select'];

const slotsConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        getSessionFromSlotsApi: getTaMenuSessionForLeave,
        sessionBySlotsState: 'slotsBetweenDates',
        sessionsInAllSlotsState: 'sessionBySlots',
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        getSessionFromSlotsApi: getCoachMenuSessionForLeave,
        sessionBySlotsState: 'coachSlotsForLeave',
        sessionsInAllSlotsState: 'coachSessionsForLeave',
    },
};

const CreatedSlots = ({ componentName, timezone }) => {
    const dispatch = useDispatch();
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [slots, setSlots] = useState([]);

    const { sliceName, getSessionFromSlotsApi, sessionBySlotsState,sessionsInAllSlotsState } =
        slotsConfig[componentName];

    const selectState = useSelector(state => state[sliceName]);
    const { createdSlots } = useSelector(state => state.commonCalender);

    const { [sessionBySlotsState]: sessionsData } = selectState;
    const { [sessionsInAllSlotsState]: sessionInAllSlots } = selectState;

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertMenuSlots = async () => {
        if (sessionsData && sessionsData.length > 0 && timezone?.time_zone) {
            try {
                const formattedData = await Promise.all(
                    sessionsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date, // Assuming the end date is the same as the start date
                            timezonename: timezone?.time_zone,
                        });

                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );

                        return {
                            'S. No.': index + 1,
                            Date: localTime.start_date,
                            'Slot Time': `${formatTime(localTime.start_time)} - ${formatTime(localTime.end_time)}`,
                            Select: selectedSlots.includes(slot.id),
                            id: slot.id,
                            startDate: startDateTime,
                            endDate: endDateTime,
                        };
                    })
                );

                setSlots(formattedData);
            } catch (error) {
                console.error('Error converting slots:', error);
                setSlots([]);
            }
        } else {
            setSlots([]);
        }
    };

    useEffect(() => {
        convertMenuSlots();
    }, [sessionsData, timezone?.time_zone, selectedSlots]);

    const handleSelect = id => {
        setSelectedSlots(prev =>
            prev.includes(id)
                ? prev.filter(slotId => slotId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = () => {
        if (selectedSlots && selectedSlots.length > 0) {
            const data = selectedSlots.map(slotId => {
                const slot = sessionsData.find(s => s.id === slotId);
                return {
                    slot_id: slot.id,
                    date: slot.slot_date,
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                };
            });

            const requestBody = {
                data,
            };

            dispatch(getSessionFromSlotsApi(requestBody)).then(() => {
                dispatch(closeCreatedSlots());
                dispatch(openCreatedSessions(requestBody));
            });
            console.log('sessionInAllSlots', sessionInAllSlots);
            dispatch(setTotalSessionsForMarkLeave(sessionInAllSlots.length));
        }
    };

    const table = (
        <PopUpTable
            headers={headers}
            initialData={slots}
            onRowClick={handleSelect}
            selectedBox={selectedSlots}
        />
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            style={{ textTransform: 'none' }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={createdSlots}
            handleClose={() => dispatch(closeCreatedSlots())}
            title="Slots"
            content={table}
            actions={actions}
        />
    );
};

export default CreatedSlots;
