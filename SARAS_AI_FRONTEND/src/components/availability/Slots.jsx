import React, { useEffect, useState } from 'react';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { useDispatch, useSelector } from 'react-redux';
import PopUpTable from '../CommonComponent/PopUpTable';

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
import { convertFromUTC } from '../../utils/dateAndtimeConversion';
import { addDataToFindScheduleInSlot } from '../../redux/features/commonCalender/commonCalender';
import { toast } from 'react-toastify';

const slotConfig = {
    TACALENDER: {
        sliceName: 'taAvialability',
        scheduleSessionOpenKey: 'scheduledSlotsOpen',
        scheduledSlotsDataKey: 'scheduledSlotsData',
        getAvailableSlotsAction: openScheduledSession,
        closeScheduleSessionAction: closeScheduledSlots,
        getScheduleSessionAction: getScheduleSession,
        markLeaveKey: 'markLeaveData',
    },
    COACHCALENDER: {
        sliceName: 'coachAvailability',
        scheduleSessionOpenKey: 'scheduledCoachSlotsOpen',
        scheduledSlotsDataKey: 'scheduledCoachSlotsData',
        getAvailableSlotsAction: openCoachScheduledSession,
        closeScheduleSessionAction: closeCoachScheduledSlots,
        getScheduleSessionAction: getCoachScheduleSession,
        markLeaveKey: 'markLeaveData',
    },
};

const Slots = ({ id, name, componentName, timezone }) => {
    const dispatch = useDispatch();

    const [selectedSlots, setSelectedSlots] = useState([]);
    const [data, setData] = useState([]);

    const {
        scheduleSessionOpenKey,
        scheduledSlotsDataKey,
        getAvailableSlotsAction,
        closeScheduleSessionAction,
        getScheduleSessionAction,
        markLeaveKey,
        sliceName,
    } = slotConfig[componentName];

    const schedulingState = useSelector(state => state[sliceName]);

    const {
        [scheduleSessionOpenKey]: scheduledSlotsOpen,
        [scheduledSlotsDataKey]: scheduledSlotsData = [],
        [markLeaveKey]: markLeaveData,
    } = schedulingState;

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertSlots = async () => {
        if (
            scheduledSlotsData &&
            scheduledSlotsData.length > 0 &&
            timezone.time_zone
        ) {
            try {
                const processedSlots = await Promise.all(
                    scheduledSlotsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date,
                            timezonename: timezone.time_zone,
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
    }, [scheduledSlotsData, timezone.time_zone]);

    const handleSelect = id => {
        setSelectedSlots(prev =>
            prev.includes(id)
                ? prev.filter(slotId => slotId !== id)
                : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (selectedSlots.length > 0) {
            const data = await Promise.all(
                selectedSlots.map(async slotId => {
                    const slot = scheduledSlotsData.find(s => s.id === slotId);

                    const localTime = await convertFromUTC({
                        start_date: slot.slot_date,
                        start_time: slot.from_time,
                        end_time: slot.to_time,
                        end_date: slot.slot_date,
                        timezonename: timezone.time_zone,
                    });

                    return {
                        slot_id: slot.id,
                        date: slot.slot_date,
                        start_time: localTime.start_time,
                        end_time: localTime.end_time,
                    };
                })
            );
            const requestData = {
                admin_user_id: id,
                data,
                timezone_id: timezone.id,
            };
            dispatch(addDataToFindScheduleInSlot(requestData));
            dispatch(getScheduleSessionAction(requestData))
                .then(() => {
                    dispatch(closeScheduleSessionAction());
                    dispatch(getAvailableSlotsAction(requestData));
                })
                .catch(error => {
                    console.error('API error:', error);
                });
        } else {
            toast.error('Please select Slot');
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
            style={{ textTransform: 'none' }}
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
