import { React, useState } from 'react';
import './EmailPopup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ForgetPassword from './ForgetPassword';
import { useNavigate } from 'react-router-dom';

const EmailPopup = ({ handleClose }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCheckboxChange = option => {
        setSelectedOption(option);
        setError('');
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (!selectedOption) {
            toast.error('Please select either Email or Mobile Number', {
                position: 'top-right',
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }

        // Navigate to ForgetPassword component

        //navigate('resetpassword');
        console.log('Form submitted with option:', selectedOption);
    };

    return (
        <div className="popup-background">
            <div className="popup-content">
                <h2 style={{ color: '#FFF' }}>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <label
                        style={{ color: '#fff', marginBottom: '2px' }}
                        htmlFor="email"
                    >
                        Username
                    </label>
                    <input
                        required
                        style={{
                            fontSize: '22px',
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                        }}
                    />

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ color: '#fff', marginRight: '10px' }}>
                            <input
                                type="checkbox"
                                checked={selectedOption === 'email'}
                                onChange={() => handleCheckboxChange('email')}
                            />
                            Email
                        </label>
                        <label style={{ color: '#fff' }}>
                            <input
                                type="checkbox"
                                checked={selectedOption === 'mobile'}
                                onChange={() => handleCheckboxChange('mobile')}
                            />
                            Mobile Number
                        </label>
                    </div>
                    {error && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </div>
                    )}
                    <button
                        style={{
                            fontSize: '22px',
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            marginTop: '1rem',

                            color: '#000',
                            border: 'none',
                        }}
                    >
                        Send
                    </button>
                </form>
                <button className="close-btn" onClick={handleClose}>
                    Close
                </button>
            </div>
        </div>
    );
};

export default EmailPopup;
