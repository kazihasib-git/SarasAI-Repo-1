import React from 'react';
import moment from 'moment';
import CustomDateField from './CustomDateField';

const CustomDateOfBirth = ({ label, name, value, onChange, ...props }) => {
    const handleDateChange = date => {
        const today = moment().endOf('day');
        if (date && moment(date).isAfter(today)) {
            onChange('');
            return;
        }
        onChange(date);
    };

    return (
        <CustomDateField
            label={label}
            name={name}
            value={value}
            onChange={handleDateChange}
            disableFutureDates={true}
            sx={{ width: '100%' }} // Ensure full width
            {...props}
        />
    );
};

export default CustomDateOfBirth;
