import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';
import { useParams } from 'react-router-dom';

import {
    closeScheduledSlots,
    openScheduledSession,
    getScheduleSession,
} from '../../redux/features/adminModule/ta/taAvialability';

import {
    closeCoachScheduledSlots,
    openCoachScheduledSession,
    getCoachScheduleSession,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import CustomButton from '../CustomFields/CustomButton';
import { timezoneIdToName } from '../../utils/timezoneIdToName';
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { getTimezone } from '../../redux/features/utils/utilSlice';

const storedTimezoneId = Number(localStorage.getItem('timezone_id'));
const Slots = ({ componentName }) => {
    const { timezones, platforms } = useSelector(state => state.util);
   
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);
    const { id } = useParams();
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [data, setData] = useState([]);

    let scheduleSessionOpenKey,
        scheduledSlotsDataKey,
        getAvailableSlotsAction,
        closeScheduleSessionAction,
        getScheduleSessionAction,
        markLeaveKey,
        sliceName;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taAvailability';
            scheduleSessionOpenKey = 'scheduledSlotsOpen';
            scheduledSlotsDataKey = 'scheduledSlotsData';
            getAvailableSlotsAction = openScheduledSession;
            closeScheduleSessionAction = closeScheduledSlots;
            getScheduleSessionAction = getScheduleSession;
            markLeaveKey = 'markLeaveData';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachAvailability';
            scheduleSessionOpenKey = 'scheduledCoachSlotsOpen';
            scheduledSlotsDataKey = 'scheduledCoachSlotsData';
            getAvailableSlotsAction = openCoachScheduledSession;
            closeScheduleSessionAction = closeCoachScheduledSlots;
            getScheduleSessionAction = getCoachScheduleSession;
            markLeaveKey = 'markLeaveData';
            break;

        default:
            sliceName = null;
            scheduleSessionOpenKey = null;
            scheduledSlotsDataKey = null;
            getAvailableSlotsAction = null;
            closeScheduleSessionAction = null;
            getScheduleSessionAction = null;
            markLeaveKey = null;
            break;
    }

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        [scheduleSessionOpenKey]: scheduledSlotsOpen,
        [scheduledSlotsDataKey]: scheduledSlotsData = [],
        [markLeaveKey]: markLeaveData,
    } = schedulingState;


    const convertSlots = async () => {
        console.log('Scheduled slots data:', scheduledSlotsData);
        console.log('Selected slots:', selectedSlots);
    
        if (scheduledSlotsData && scheduledSlotsData.length > 0 && timezones && storedTimezoneId) {
            const timezonename = timezoneIdToName(storedTimezoneId, timezones);
    
            try {
                const processedSlots = await Promise.all(
                    scheduledSlotsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date,
                            timezonename,
                        });
                        const startDateTime = new Date(`${localTime.start_date}T${localTime.start_time}`);
                        const endDateTime = new Date(`${localTime.end_date}T${localTime.end_time}`);
                        return {
                            'S. No.': index + 1,
                            Date: localTime.start_date,
                            'Slot Time': `${localTime.start_time} - ${localTime.end_time}`,
                            Select: selectedSlots.includes(slot.id),
                            id: slot.id,
                            startDate: startDateTime,
                            
                        };
                    })
                );
                setData(processedSlots);
            } catch (error) {
                console.error('Error converting slots:', error);
                setData([]);
            }
        } else {
            setData([]);
            setSelectedSlots([]);
        }
    };
    
    useEffect(() => {
        convertSlots();
    }, [scheduledSlotsData, timezones, storedTimezoneId]);

    const handleSelect = id => {
        setSelectedSlots(prev =>
            prev.includes(id)
                ? prev.filter(slotId => slotId !== id)
                : [...prev, id]
        );
    };

    // const timezone = timezones[slotId];
    const handleSubmit = () => {
        if (selectedSlots.length > 0) {
            const data = selectedSlots.map(slotId => {
                const slot = scheduledSlotsData.find(s => s.id === slotId);
                return {
                    slot_id: slot.id,
                    date: slot.slot_date,
                    start_time: slot.from_time,
                    end_time: slot.to_time,
                };
            });

            const requestData = {
                admin_user_id: id,
                data,
            };

            console.log('Submitting selected slots:', requestData);

            dispatch(getScheduleSessionAction(requestData))
                .then(response => {
                    console.log('API response:', response);
                    dispatch(closeScheduleSessionAction());
                    dispatch(getAvailableSlotsAction(requestData));
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        } else {
            console.log('No slots selected, opening reason for leave');
            dispatch(closeScheduleSessionAction());
            // dispatch(openMarkLeaveAction(markLeaveData));
        }
    };

    const headers = ['S. No.', 'Date', 'Slot Time', 'Select'];

    const table = (
        <PopUpTable
            headers={headers}
            initialData={data}
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
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={scheduledSlotsOpen}
            handleClose={() => dispatch(closeScheduleSessionAction())}
            title="Slots"
            content={table}
            actions={actions}
        />
    );
};
export default Slots;
