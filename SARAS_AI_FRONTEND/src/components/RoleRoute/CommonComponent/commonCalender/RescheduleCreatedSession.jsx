import { Button, DialogContent, Grid } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomDateField from '../../../CustomFields/CustomDateField';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import CustomTimeField from '../../../CustomFields/CustomTimeField';

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

const RescheduleCreatedSession = ({ componentName }) => {
    const dispatch = useDispatch();

    let sliceName;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            break;
        case 'COACHMENU':
            sliceName = 'coachMenu';
            break;
        default:
            sliceName = null;
            break;
    }

    useEffect(() => {
        if (selectDate) {
            console.log('Fetching slots for date:', selectDate);
            const data = {
                admin_user_id: taId.id,
                date: selectDate,
            };
            dispatch(fetchAvailableSlotsAction(data));
        }
    }, [selectDate, taId.id, dispatch, fetchAvailableSlotsAction]);

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
        setSelectedSlots([]); // Clear selected slots when date changes
    };

    const handleSelectSlot = id => {
        console.log('Selected Slot ID:', id);
        setSelectedSlots(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleSubmit = () => {
        dispatch();
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
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={''}
            handleClose={() => {
                dispatch();
                dispatch();
            }}
            title="Reschedule Session"
            content={content}
            actions={selectDate ? actions : undefined}
        />
    );
};

export default RescheduleCreatedSession;
