import { React, useState } from 'react';
import './EmailPopup.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';

const EmailPopup = ({ handleClose, onSubmit }) => {
    const [selectedOption, setSelectedOption] = useState('');
    const [username, setUsername] = useState('');

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCheckboxChange = option => {
        setSelectedOption(option);
        setError('');
    };
    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        if (!selectedOption) {
            toast.error('Please select either Email or Mobile Number', {});
            return;
        }

        // dispatch(forgotPassword({ username, method: selectedOption }));

        // navigate('/resetpassword', { state: { username } });

        dispatch(forgotPassword({ username, method: selectedOption })).then(
            response => {
                if (forgotPassword.fulfilled.match(response)) {
                    if (response.payload?.message !== 'User not found') {
                        navigate('/resetpassword', { state: { username } });
                    }
                }
            }
        );
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
                        value={username}
                        onChange={e => setUsername(e.target.value)}
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
                                checked={selectedOption === 'sms'}
                                onChange={() => handleCheckboxChange('sms')}
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
