import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoachMenuSessionForLeave } from '../../../../redux/features/coach/coachmenuprofileSilce';
import { getTaMenuSessionForLeave } from '../../../../redux/features/teachingAssistant/tamenuSlice';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import { closeCreatedSlots } from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const headers = ['S. No.', 'Date', 'Slot Time', 'Select'];

const CreatedSlots = ({ componentName }) => {
    console.log('Comp Name :', componentName);

    const dispatch = useDispatch();
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [slots, setSlots] = useState([]);

    let sliceName, getSessionFromSlotsApi, sessionBySlotsState;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            getSessionFromSlotsApi = getTaMenuSessionForLeave;
            sessionBySlotsState = 'slotsBetweenDates';

            break;
        case 'COACHMENU':
            sliceName = 'coachMenu';
            getSessionFromSlotsApi = getCoachMenuSessionForLeave;
            sessionBySlotsState = 'coachSlotsForLeave';
            break;

        default:
            sliceName = null;
            getSessionFromSlotsApi = null;
            sessionBySlotsState = null;
            break;
    }

    const selectState = useSelector(state => state[sliceName]);
    const { createdSlots } = useSelector(state => state.commonCalender);

    const { [sessionBySlotsState]: sessionsData } = selectState;

    console.log('SessionData :', sessionsData);

    useEffect(() => {
        if (sessionsData && sessionsData.length > 0) {
            const formattedData = sessionsData.map((slot, index) => ({
                'S. No.': index + 1,
                Date: slot.slot_date,
                'Slot Time': `${slot.from_time} - ${slot.to_time}`,
                Select: selectedSlots.includes(slot.id),
                id: slot.id,
            }));
            setSlots(formattedData);
        }
    }, [sessionsData]);

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
                // TODO : Open Sessions
            });
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
