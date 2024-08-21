import { Button, DialogContent, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomDateField from '../../../CustomFields/CustomDateField';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import CustomTimeField from '../../../CustomFields/CustomTimeField';
import { closeReschedulePopup, openCreatedSessions } from '../../../../redux/features/commonCalender/commonCalender';
import { getScheduleSession } from '../../../../redux/features/adminModule/ta/taAvialability';
import { timezoneIdToName } from '../../../../utils/timezoneIdToName';
import { getTimezone } from '../../../../redux/features/utils/utilSlice';
import { getCoachMenuSessionForLeave, getCoachMenuSessions, getCoachMenuSlots, getCoachMenuSlotsByData, rescheduleSessionForCoachLeave } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import { getTaMenuSessionForLeave, getTaMenuSessions, getTaMenuSlots, getTaMenuSlotsByDate, rescheduleSessionForTaLeave } from '../../../../redux/features/taModule/tamenuSlice';

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

const headers = ['S. No.', 'Slots Available', 'Select'];

const timezoneId = Number(localStorage.getItem('timezone_id'))

const RescheduleCreatedSession = ({ componentName }) => {

    const dispatch = useDispatch();
    const { RescheduleSession, slotsLeaveData, sessionDataForReschdeule, dataToFindScheduleInSlot } = useSelector((state) => state.commonCalender)

    const [selectDate, setSelectDate] = useState(null);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [fromTime, setFromTime] = useState(null);
    const [toTime, setToTime] = useState(null);
    const [transformedSlotsData, setTransformedSlotsData] = useState([]);

    useEffect(() => {
        dispatch(getTimezone());
    }, [dispatch]);

    const { timezones } = useSelector((state) => state.util)

    let sliceName,
        rescheduleApi,
        getAllSlotsApi,
        getAllSessionsApi,
        fetchAvailableSlotsApi,
        availableSlotState,
        getSessionsBySlotsApi;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            rescheduleApi = rescheduleSessionForTaLeave;
            getAllSlotsApi = getTaMenuSlots;
            getAllSessionsApi = getTaMenuSessions;
            fetchAvailableSlotsApi = getTaMenuSlotsByDate;
            availableSlotState = 'taSlotsByDate';
            getSessionsBySlotsApi = getTaMenuSessionForLeave;
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            rescheduleApi = rescheduleSessionForCoachLeave
            getAllSlotsApi = getCoachMenuSlots;
            getAllSessionsApi = getCoachMenuSessions;
            fetchAvailableSlotsApi = getCoachMenuSlotsByData
            availableSlotState = 'coachSlotsByDate'
            getSessionsBySlotsApi = getCoachMenuSessionForLeave
            break;

        default:
            sliceName = null;
            rescheduleApi = null;
            getAllSlotsApi = null;
            getAllSessionsApi = null;
            fetchAvailableSlotsApi = null;
            availableSlotState = null
            getSessionsBySlotsApi = null;
            break;
    }

    const selectorState = useSelector((state) => state[sliceName])

    const {
        [availableSlotState] : availableSlotsData 
    } = selectorState;

    useEffect(() => {
        if (selectDate) {
            const data = {
                date: selectDate,
                timezone_name : timezoneIdToName(timezoneId, timezones)
            };
            dispatch(fetchAvailableSlotsApi(data));
        }
    }, [selectDate, dispatch, fetchAvailableSlotsApi]);

    useEffect(() => {
        console.log('Available Slots Data:', availableSlotsData);
        if (availableSlotsData && availableSlotsData.length > 0) {
            const transformedData = availableSlotsData.map((slot, index) => ({
                'S. No.': index + 1,
                'Slots Available': `${slot.from_time} - ${slot.to_time}`,
                id: slot.id,
            }));
            setTransformedSlotsData(transformedData);
        } else {
            setTransformedSlotsData([]);
        }
    }, [availableSlotsData]);

    const handleDateChange = date => {
        setSelectDate(date);
        setSelectedSlots([]);
    };

    const handleSelectSlot = id => {
        console.log('Selected Slot ID:', id);
        setSelectedSlots(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        const errors = [];
    
        if (!selectDate) {
            errors.push('Please Select The Date');
        }
        if (!selectedSlots[0]) {
            errors.push('Please Select the Slot');
        }
        if (!fromTime) {
            errors.push('Please Select the Start Time');
        }
        if (!toTime) {
            errors.push('Please Select the End Time');
        }
    
        if (errors.length) {
            errors.forEach(error => toast.error(error));
            return;
        }

        const sessionId = sessionDataForReschdeule?.id || '';

        const rescheduleData = {
            id : sessionId,
            data : {
                schedule_date : selectDate,
                slot_id : selectedSlots[0],
                start_time : fromTime,
                end_time : toTime,
                timezone_id : timezoneId,
                event_status : "rescheduled",
            }
        }

        dispatch(rescheduleApi(rescheduleData))
        .then(() => {
            dispatch(closeReschedulePopup())
            dispatch(getAllSlotsApi())
            dispatch(getAllSessionsApi())
            dispatch(getSessionsBySlotsApi(slotsLeaveData))
            dispatch(openCreatedSessions(slotsLeaveData))
        })
    };

    const content = (
        <>
            <Grid
                item
                xs={12}
                sm={6}
                mb={2}
                pt={'16px'}
                style={{ display: 'flex', justifyContent: 'center' }}
            >
                <CustomDateField
                    label="Select Date"
                    value={selectDate}
                    onChange={handleDateChange}
                    name="selectDate"
                    sx={{ width: '50%' }}
                />
            </Grid>

            {selectDate && transformedSlotsData.length === 0 ? (
                <DialogContent
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    No Slots Available
                </DialogContent>
            ) : (
                selectDate && (
                    <>
                        <PopUpTable
                            headers={headers}
                            initialData={transformedSlotsData}
                            onRowClick={handleSelectSlot}
                            selectedBox={selectedSlots}
                            itemsPerPage={4}
                        />
                        <Grid
                            container
                            sx={{
                                pt: 3,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textAlign: 'center',
                            }}
                        >
                            <Grid item xs={12} sm={6}>
                                <CustomTimeField
                                    label="Start Time"
                                    value={fromTime}
                                    onChange={time => setFromTime(time)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CustomTimeField
                                    label="End Time"
                                    value={toTime}
                                    onChange={time => setToTime(time)}
                                />
                            </Grid>
                        </Grid>
                    </>
                )
            )}
        </>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor : "#F56D3B",
                borderColor : "#F56D3B",
                color : "#FFFFFF",
                textTransform : 'none',
            }}
           
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={RescheduleSession}
            handleClose={() => {
                dispatch(closeReschedulePopup());
                dispatch(openCreatedSessions(slotsLeaveData));
            }}
            title="Reschedule Session"
            content={content}
            actions={selectDate ? actions : undefined}
        />
    );
};

export default RescheduleCreatedSession;
