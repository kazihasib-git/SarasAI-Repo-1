import React, { useState } from 'react';
import {
    Grid,
    Button,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormGroup,
    Checkbox,
    MenuItem,
} from '@mui/material';

import CustomDateField from '../CustomFields/CustomDateField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import { timeZones, validateTimeZone } from '../CustomFields/FormOptions';
import CustomFormControl from '../CustomFields/CustomFromControl';

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



const CreateNewSlot = ({ open, handleClose }) => {
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

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ pt: 3 }}>
                <Grid item xs={12} sm={6} >
                    <CustomDateField
                        label="From Date"
                        name="fromDate"
                        value={formDate}
                        onChange={(date) => setFormDate(date)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <CustomDateField
                        label="To Date"
                        name="toDate"
                        value={toDate}
                        onChange={(date) => setToDate(date)}
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
    );

    const actions = (
        <>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor='white'
                color='#F56D3B'
                borderColor='#F56D3B'
            >
                Back
            </CustomButton>
            <CustomButton
                onClick={handleSubmit}
                backgroundColor='#F56D3B'
                color='white'
                borderColor='#F56D3B'
            >
                Submit
            </CustomButton>
        </>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={handleClose}
            title="Create New Slot"
            content={content}
            actions={actions}
        />
    );
};

export default CreateNewSlot;
