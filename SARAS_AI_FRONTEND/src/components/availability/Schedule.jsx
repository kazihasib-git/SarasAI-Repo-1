import { Button, DialogContent, Grid } from '@mui/material';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../CustomFields/CustomTextField';
import PopUpTable from '../CommonComponent/PopUpTable';
import CustomTimeField from '../CustomFields/CustomTimeField';
import CustomDateField from '../CustomFields/CustomDateField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomFormControl from '../CustomFields/CustomFromControl';
import { timeZones } from '../CustomFields/FormOptions';

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

const headers = ['S. No.', 'Session Name', 'Date', 'Time', 'Students', 'Actions']

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

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const handleSubmit = () => {
        handleClose();
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

    const dispatch = useDispatch()
    const { } = useSelector((state) => state.taAvialability);

    const content = (
        <>
            <Grid item xs={12} sm={6} >
                <CustomDateField
                    label="From Date"
                    name="fromDate"
                    value={formDate}
                    onChange={(date) => setFormDate(date)}
                />
            </Grid>
            {repeat === 'recurring' && (
                <Grid item xs={12} sm={6}>
                    <CustomDateField
                        label="To Date"
                        name="toDate"
                        value={toDate}
                        onChange={(date) => setToDate(date)}
                    />
                </Grid>
            )}

            {formDate && (
                <>
                    {dummyData.length === 0 ? (
                        <DialogContent >
                            No Slot Available
                        </DialogContent>
                    ) : (
                        <>
                            <PopUpTable
                                headers={headers}
                                initialData={dummyData}
                                actionButtons={actionButtons}
                            />
                            <Grid container sx={{ pt: 3 }} >
                                <Grid item xs={12} sm={6}>
                                    <CustomTimeField
                                        label="From Time"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <CustomDateField
                                        label="End Time"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={12} md={6}>
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
                                        options={timeZones}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <FormControl component="fieldset">
                                        <RadioGroup row value={repeat} onChange={(e) => setRepeat(e.target.value)} sx={{ justifyContent: 'center' }}>
                                            <FormControlLabel value="onetime" control={<Radio />} label="One-Time" />
                                            <FormControlLabel value="recurring" control={<Radio />} label="Recurring" />
                                        </RadioGroup>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            {repeat === 'recurring' && (
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item xs={12}>
                                        <FormControl component="fieldset">
                                            <FormGroup row>
                                                {weekDays.map((day) => (
                                                    <FormControlLabel
                                                        key={day}
                                                        control={<Checkbox checked={selectedDays.includes(day)} onChange={() => handleDayChange(day)} name={day} />}
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
        </>
    )

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
            open={open}
            handleClose={handleClose}
            title="Schedule Slot"
            content={content}
            actions={actions}
        />
    )
}

export default Schedule