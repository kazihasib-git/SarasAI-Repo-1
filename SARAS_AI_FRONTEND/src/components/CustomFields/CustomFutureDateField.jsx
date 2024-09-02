import React from 'react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const CustomFutureDateField = ({
    label,
    name,
    value,
    onChange,
    disableFutureDates,
    sx,
    ...props
}) => {
    const handleDateChange = date => {
        const formattedDate = date ? moment(date).format('YYYY-MM-DD') : '';
        onChange(formattedDate);
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
                label={label}
                name={name}
                value={value ? moment(value, 'YYYY-MM-DD') : null}
                onChange={handleDateChange}
                disablePast={true} // Disable past dates
                disableFuture={disableFutureDates}
                slotProps={{
                    textField: {
                        InputLabelProps: {
                            shrink: true,
                        },
                        sx: {
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                height: '60px',
                                '& fieldset': {
                                    borderColor: '#D0D0EC',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#D0D0EC',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'rgb(245, 109, 59)',
                                },
                            },
                            '& .MuiInputLabel-root': {
                                margin: 0,
                                color: '#1A1E3D',
                                '&.Mui-focused': {
                                    color: '#1A1E3D',
                                },
                            },
                            width: '100%', // Ensure full width
                            ...sx,
                        },
                        ...props,
                    },
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomFutureDateField;
