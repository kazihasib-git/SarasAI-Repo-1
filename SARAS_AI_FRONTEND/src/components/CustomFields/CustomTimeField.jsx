import React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import moment from 'moment';

const CustomTimeField = ({
    label,
    name,
    value,
    onChange,
    sx,
    fullWidth,
    ...props
}) => {
    const momentValue = value ? moment(value, 'YYYY-MM-DDTHH:mm:ss') : null;

    const handleTimeChange = date => {
        onChange(date.format('HH:mm:ss'));
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
                label={label}
                name={name}
                value={momentValue}
                onChange={handleTimeChange}
                inputFormat="HH:mm:ss"
                InputLabelProps={{
                    shrink: true,
                    sx: {
                        // Center the label vertically when in placeholder position
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontSize: '1rem',
                        transition: 'all 0.2s ease-in-out',
                        '&.MuiInputLabel-shrink': {
                            top: 0,
                            transform: 'translateY(-100%) scale(0.75)',
                            fontSize: '0.75rem',
                        },
                    },
                }}
                {...props}
                slotProps={{
                    textField: {
                        fullWidth: { fullWidth },
                    },
                }}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        '& fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&:hover fieldset': {
                            borderColor: '#D0D0EC',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'rgb(245, 109, 59)',
                        },
                        '& .MuiInputBase-input': {
                            padding: '16.5px 14px', // Adjust padding to match label's centered position
                        },
                    },
                    '& .MuiInputLabel-root': {
                        margin: 0,
                        color: '#1A1E3D',
                        '&.Mui-focused': {
                            color: '#1A1E3D',
                        },
                    },
                    ...sx,
                }}
            />
        </LocalizationProvider>
    );
};

export default CustomTimeField;



// import React from 'react';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
// import moment from 'moment';
// import PhoneInput from 'react-phone-input-2';
// import 'react-phone-input-2/lib/style.css';

// const CustomTimeField = ({ label, name, value, onChange, sx, ...props }) => {
//     const momentValue = value ? moment(value, 'YYYY-MM-DDTHH:mm:ss') : null; // Adjust parsing format based on input

//     const handleTimeChange = (date) => {
//         onChange(date.format('HH:mm:ss'));
//     };

//     const handlePhoneChange = (phone) => {
//         setPhoneNumber(phone);
//         setPhoneError(phone ? '' : 'Phone number is required');
//     };

//     return (
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <div style={{ marginBottom: 20 }}>
//                 <label>{label}</label>
//                 <PhoneInput
//                     name="phone"
//                     country={'in'}
//                     value={phoneNumber}
//                     onChange={handlePhoneChange}
//                     containerStyle={{ width: '100%' }}
//                     inputStyle={{
//                         width: '100%',
//                         borderRadius: '50px',
//                         borderColor: phoneError ? 'red' : '#D0D0EC',
//                         height: '60px',
//                     }}
//                     buttonStyle={{
//                         borderRadius: '50px 0 0 50px',
//                         height: '60px',
//                         paddingLeft: '10px',
//                     }}
//                 />
//                 {phoneError && (
//                     <span
//                         style={{
//                             color: 'red',
//                             fontSize: '0.75rem',
//                             marginTop: '5px',
//                             display: 'block',
//                         }}
//                     >
//                         {phoneError}
//                     </span>
//                 )}
//             </div>
//             <TimePicker
//                 label="Time"
//                 name={name}
//                 value={momentValue}
//                 onChange={handleTimeChange}
//                 inputFormat="HH:mm:ss"
//                 InputLabelProps={{
//                     shrink: true,
//                 }}
//                 {...props}
//                 sx={{
//                     '& .MuiOutlinedInput-root': {
//                         borderRadius: '50px',
//                         '& fieldset': {
//                             borderColor: errors?.time_zone ? 'red' : '#D0D0EC',
//                         },
//                         '&:hover fieldset': {
//                             borderColor: errors?.time_zone ? 'red' : '#D0D0EC',
//                         },
//                         '&.Mui-focused fieldset': {
//                             borderColor: errors?.time_zone
//                                 ? 'red'
//                                 : 'rgb(245, 109, 59)',
//                         },
//                     },
//                     '& .MuiInputLabel-root': {
//                         margin: 0,
//                         color: errors?.time_zone ? 'red' : '#1A1E3D',
//                         '&.Mui-focused': {
//                             color: errors?.time_zone ? 'red' : '#1A1E3D',
//                         },
//                     },
//                     ...sx,
//                 }}
//             />
//             {errors?.time_zone && (
//                 <span
//                     style={{
//                         color: 'red',
//                         fontSize: '0.75rem',
//                         marginTop: '5px',
//                         display: 'block',
//                     }}
//                 >
//                     {errors.time_zone.message}
//                 </span>
//             )}
//         </LocalizationProvider>
//     );
// };

// export default CustomTimeField;
