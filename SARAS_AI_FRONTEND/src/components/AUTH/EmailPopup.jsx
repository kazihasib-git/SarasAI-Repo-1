import React from 'react';
import './EmailPopup.css';

const EmailPopup = ({ handleClose }) => {
    return (
        <div className="popup-background">
            <div className="popup-content">
                <h2 style={{ color: '#FFF' }}>Reset Password</h2>
                <form>
                    <label
                        style={{ color: '#fff', marginBottom: '5px' }}
                        htmlFor="email"
                    >
                        E-mail:
                    </label>
                    <input
                        type="email"
                        id="email"
                        required
                        style={{
                            fontSize: '22px',
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                        }}
                    />
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
