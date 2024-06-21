import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';

const CustomFormControl = ({ label, name, register, validation, errors, options }) => {
    return (
        <FormControl variant="outlined" fullWidth>
            <InputLabel style={{ margin: 0 }}>{label}</InputLabel>
            <Select
                label={label}
                name={name}
                {...register(name, validation)}
                error={!!errors[name]}
                style={{ borderRadius: '50px', height: '60px', padding: '18px 30px' }}
            >
                {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
            </Select>
            {errors[name] && <Typography variant="body2" color="error">{errors[name].message}</Typography>}
        </FormControl>
    );
};

export default CustomFormControl;
