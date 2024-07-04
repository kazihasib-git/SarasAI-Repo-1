import { Box, Button, Checkbox, DialogContent, FormControl, FormControlLabel, FormGroup, Grid, Radio, RadioGroup } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../CustomFields/CustomTextField';
import PopUpTable from '../CommonComponent/PopUpTable';
import CustomTimeField from '../CustomFields/CustomTimeField';
import CustomDateField from '../CustomFields/CustomDateField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomFormControl from '../CustomFields/CustomFromControl';
import { timeZones, transformedTimeZones, validateTimeZone } from '../CustomFields/FormOptions';
import { closeScheduleSession } from '../../redux/features/taModule/taScheduling';
import { openAssignBatches, openAssignStudents } from '../../redux/features/taModule/taSlice';
import { getSlots } from '../../redux/features/taModule/taAvialability';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
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
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

//const headers = ['S. No.', 'Session Name', 'Date', 'Time', 'Students', 'Actions']
const headers = ['S. No.', 'Slot Date', 'From Time', 'To Time', 'Actions'];

// const dummyData =[];
const dummyData = [
    { id: 1, sessionName: 'Math 101', date: '2023-06-25', time: '10:00 AM', students: 30, actions: 'View' },
    { id: 2, sessionName: 'Physics 201', date: '2023-06-26', time: '11:00 AM', students: 25, actions: 'View' },
    { id: 3, sessionName: 'Chemistry 301', date: '2023-06-27', time: '12:00 PM', students: 20, actions: 'View' },
    { id: 4, sessionName: 'Biology 401', date: '2023-06-28', time: '01:00 PM', students: 15, actions: 'View' },
    { id: 5, sessionName: 'English 101', date: '2023-06-29', time: '02:00 PM', students: 10, actions: 'View' }
];

const actionButtons = [
    {
        type: "button",
    },
];

const Schedule = () => {
    const [formDate, setFormDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [timezone, setTimezone] = useState('');
    const [repeat, setRepeat] = useState('onetime');
    const [selectedDays, setSelectedDays] = useState([]);
    const [taSlotData, setTaSlotData] = useState([{}]);
    const dispatch = useDispatch()
    const { scheduleSessionOpen, taID, taName } = useSelector((state) => state.taScheduling);
    const { scheduledSlotsData } = useSelector((state) => state.taAvialability);

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = () => {
        dispatch(closeScheduleSession())
    };

    const handleDayChange = (day) => {
        setSelectedDays((prev) => {
            if (prev.includes(day)) {
                return prev.filter((d) => d !== day);
            } else {
                return [...prev, day];
            }
        });
    };

    useEffect(() => {
        fetchAvailableSlots();
    }, [formDate]);

    const fetchAvailableSlots = () => {
        dispatch(getSlots({ admin_user_id: taID, start_date: formDate, end_date: "2024-07-20" }));
    }

    console.log("taSlots : ", scheduledSlotsData)

    useEffect(() => {
        if (scheduledSlotsData && scheduledSlotsData.length > 0) {
            const transformData = scheduledSlotsData.map((item) => ({
                id: item.id,
                "Slot Date": item.slot_date,
                "From Time": item.from_time,
                "To Time": item.to_time,
                //'Time Zone': item.timezone,
            }));

            setTaSlotData(transformData);
        }
    }, [scheduledSlotsData]);


    const handleAssignStudents = () => {
        dispatch(closeScheduleSession())
        dispatch(openAssignStudents());
    }

    const handleAssignBatches = () => {
        dispatch(closeScheduleSession())
        dispatch(openAssignBatches());
    }

    console.log("taSlotData : ", taSlotData)

    const content = (
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ height: '100%', width: '100%' }}>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} display="flex" justifyContent="center">
                    <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
                        <Button
                            variant="contained"
                            onClick={handleAssignStudents}
                            sx={{
                                backgroundColor: "#F56D3B",
                                color: "white",
                                height: "60px",
                                width: "201px",
                                borderRadius: "50px",
                                textTransform: "none",
                                padding: "18px 30px",
                                fontWeight: "700",
                                fontSize: "16px",
                                "&:hover": {
                                    backgroundColor: '#D4522A',
                                },
                            }}
                        >
                            Assign Students
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleAssignBatches}
                            sx={{
                                backgroundColor: "white",
                                color: "#F56D3B",
                                height: "60px",
                                width: "194px",
                                border: "2px solid #F56D3B",
                                borderRadius: "50px",
                                textTransform: "none",
                                fontWeight: "700",
                                fontSize: "16px",
                                padding: "18px 30px",
                                "&:hover": {
                                    backgroundColor: '#F56D3B',
                                    color: 'white',
                                },
                            }}
                        >
                            Assign Batches
                        </Button>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                    <CustomDateField
                        label="From Date"
                        name="fromDate"
                        value={formDate}
                        onChange={(date) => setFormDate(date)}
                    />
                </Grid>

                {formDate && (
                    <>
                        {dummyData.length === 0 ? (
                            <Grid item xs={12} display="flex" justifyContent="center">
                                <DialogContent>
                                    No Slot Available
                                </DialogContent>
                            </Grid>
                        ) : (
                            <>
                                <Grid item xs={12} display="flex" justifyContent="center">
                                    <PopUpTable
                                        headers={headers}
                                        initialData={taSlotData}
                                        actionButtons={actionButtons}
                                    />
                                </Grid>

                                <Grid container spacing={3} sx={{ pt: 3 }} justifyContent="center">
                                    <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                                        <CustomTimeField label="From Time" />
                                    </Grid>
                                    <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                                        <CustomTimeField label="End Time" />
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={6} display="flex" justifyContent="center">
                                        <CustomFormControl
                                            label="Select Timezone"
                                            name="timezone"
                                            controlProps={{
                                                select: true,
                                                fullWidth: true,
                                                value: timezone,
                                                onChange: (e) => setTimezone(e.target.value),
                                            }}
                                            register={() => { }}
                                            validation={{ validate: validateTimeZone }}
                                            errors={{}}
                                            options={transformedTimeZones}
                                        />
                                    </Grid>
                                </Grid>

                                <Grid container spacing={3} justifyContent="center" sx={{ pt: 3 }}>
                                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                value={repeat}
                                                onChange={(e) => setRepeat(e.target.value)}
                                                sx={{ justifyContent: 'center' }}
                                            >
                                                <FormControlLabel
                                                    value="onetime"
                                                    control={<Radio />}
                                                    label="One-Time"
                                                />
                                                <FormControlLabel
                                                    value="recurring"
                                                    control={<Radio />}
                                                    label="Recurring"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                {repeat === 'recurring' && (
                                    <Grid container spacing={3} justifyContent="center" sx={{ pt: 3 }}>
                                        <Grid item xs={12}>
                                            <FormControl component="fieldset">
                                                <FormGroup row>
                                                    {weekDays.map((day) => (
                                                        <FormControlLabel
                                                            key={day}
                                                            control={
                                                                <Checkbox
                                                                    checked={selectedDays.includes(day)}
                                                                    onChange={() => handleDayChange(day)}
                                                                    name={day}
                                                                />
                                                            }
                                                            label={day}
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        )}
                    </>
                )}
                {repeat === 'recurring' && (
                    <Grid item xs={12} sm={6} display="flex" justifyContent="center">
                        <CustomDateField
                            label="To Date"
                            name="toDate"
                            value={toDate}
                            onChange={(date) => setToDate(date)}
                        />
                    </Grid>
                )}
            </Grid>
        </Box>
    );




    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor='#F56D3B'
            borderColor='#F56D3B'
            color='#FFFFFF'
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={scheduleSessionOpen}
            handleClose={() => dispatch(closeScheduleSession())}
            title={`Schedule Session for ${taName}`}
            content={content}
            actions={actions}
        />
    )
}

export default Schedule