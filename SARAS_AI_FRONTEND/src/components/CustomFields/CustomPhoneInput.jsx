import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const CustomPhoneInput = ({ name, register, validation, errors, ...props }) => {
    return (
        <div>
            <PhoneInput
                country={'in'}
                inputProps={{
                    required: true,
                    autoFocus: true,
                    name: name,
                    ...register(name, validation),
                }}
                {...props}
            />
            {errors[name] && (
                <p style={{ color: 'red' }}>{errors[name]?.message}</p>
            )}
        </div>
    );
};

export default CustomPhoneInput;
