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
import { convertFromUTC } from '../../../../utils/dateAndtimeConversion';
import { toast } from 'react-toastify';
import PopTableSlot from '../../../CommonComponent/PopTableSlot';
 
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


const RescheduleCreatedSession = ({ componentName , timezoneID}) => {
console.log('reschedule session timezoneID' , timezoneID) ;
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
                timezone_name : timezoneIdToName(timezoneID, timezones)
            };
            dispatch(fetchAvailableSlotsApi(data));
        }
    }, [selectDate, dispatch, fetchAvailableSlotsApi]);

    const formatTime = time => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours, 10);
        const minute = parseInt(minutes, 10);
        const ampm = hour >= 12 ? 'pm' : 'am';
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minute < 10 ? '0' : ''}${minute} ${ampm}`;
    };

    const convertavailableSlotData = async () => {

        if (
            availableSlotsData &&
            availableSlotsData.length > 0 &&
            timezones &&
            timezoneID
        ) {
            const timezonename = timezoneIdToName(timezoneID, timezones);

            try {
                const transformedData = await Promise.all(
                    availableSlotsData.map(async (slot, index) => {
                        const localTime = await convertFromUTC({
                            start_date: slot.slot_date,
                            start_time: slot.from_time,
                            end_time: slot.to_time,
                            end_date: slot.slot_date,
                            timezonename,
                        });
                        const startDateTime = new Date(
                            `${localTime.start_date}T${localTime.start_time}`
                        );
                        const endDateTime = new Date(
                            `${localTime.end_date}T${localTime.end_time}`
                        );
                        return {
                            'S. No.': index + 1,
                            'Slots Available': `${formatTime(localTime.start_time)} - ${formatTime(localTime.end_time)}`,
                            id: slot.id,
                            Date: localTime.start_date,
                            startDate: startDateTime,
                            endDate: endDateTime,
                        };
                    })
                );
                setTransformedSlotsData(transformedData);
            } catch (error) {
                console.error('Error converting available slots:', error);
                setTransformedSlotsData([]);
            }
        } else {
            setTransformedSlotsData([]);
        }
    };

    useEffect(() => {
        convertavailableSlotData();
    }, [availableSlotsData, timezones, timezoneID]);

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

    const validate = () => {


        if (!selectDate) {
            toast.error('Please Select The Date');
            return false;
        }
        if (!selectedSlots[0]) {
            toast.error('Please Select the Slot');
            return false;
        }
        if (!fromTime) {
            toast.error('Please Select the Start Time');
            return false;
        }
        if (!toTime) {
            toast.error('Please Select the End Time');
            return false;
        }

        return true;


    }

    const handleSubmit = () => {

        if(!validate()) return;

        const sessionId = sessionDataForReschdeule?.id || '';

        const rescheduleData = {
            id : sessionId,
            data : {
                schedule_date : selectDate,
                slot_id : selectedSlots[0],
                start_time : fromTime,
                end_time : toTime,
                timezone_id : timezoneID,
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
                        <PopTableSlot
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
