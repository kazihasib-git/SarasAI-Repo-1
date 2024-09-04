import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link here
import './Login.css'; // Reusing the same CSS for consistent styling
import { resetPassword } from '../../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../redux/features/auth/authSlice';
import EmailPopup from './EmailPopup';
const ForgetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const newPwdRef = useRef();
    const errRef = useRef();

    const otpRef = useRef();

    const [otp, setOtp] = useState('');

    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [timer, setTimer] = useState(300); // 5 minutes in seconds
    const [selectedOption, setSelectedOption] = useState(''); // Track selected option

    const username = location.state?.username || '';

    useEffect(() => {
        newPwdRef.current.focus();

        // Extract query parameters from the URL
        const params = new URLSearchParams(location.search);
        setEmail(params.get('email'));
        setCode(params.get('code'));
    }, [location.search]);

    useEffect(() => {
        setErrMsg('');
    }, [otp, newPwd, confirmPwd]);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(countdown);
        } else {
            setErrMsg('OTP has expired');
        }
    }, [timer]);

    const onSubmit = async e => {
        e.preventDefault();

        if (newPwd !== confirmPwd) {
            setErrMsg('Passwords do not match');
            errRef.current.focus();
            return;
        }

        try {
            const response = await dispatch(
                resetPassword({
                    username,
                    otp,
                    password: newPwd,
                    password_confirmation: confirmPwd,
                })
            );

            // Check if the resetPassword action was fulfilled
            if (resetPassword.fulfilled.match(response)) {
                if (
                    response.payload?.message ===
                    'Password has been reset successfully.'
                ) {
                    navigate('/login', { replace: true });
                } else {
                    setErrMsg(
                        'Password reset was successful but navigation did not trigger'
                    );
                    errRef.current.focus();
                }
            } else {
                setErrMsg(response.payload?.message || 'An error occurred');
                errRef.current.focus();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleSubmit = method => {
        dispatch(forgotPassword({ username, method }));
        setTimer(300); // Reset the timer
        setErrMsg('');
    };

    const resendOtp = () => {
        handleSubmit(selectedOption); // Pass the selected method ('email' or 'mobile')
    };

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <div
            id="forgetPasswordPage"
            className="login_Container"
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#FFF', // Background color set to white
            }}
        >
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1 style={{ color: '#FFF' }}>Reset Password</h1>
                <form onSubmit={onSubmit}>
                    <label style={{ color: '#fff' }} htmlFor="otp">
                        Enter OTP:
                    </label>
                    <input
                        type="text"
                        id="otp"
                        ref={otpRef}
                        autoComplete="off"
                        onChange={e => setOtp(e.target.value)}
                        value={otp}
                        required
                        style={{
                            fontSize: '22px',
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                        }}
                    />
                    <p style={{ color: '#fff', marginTop: '1rem' }}>
                        Time remaining: {formatTime(timer)}
                    </p>
                    {/* <button
                        type="button"
                        onClick={resendOtp}
                        disabled={timer > 0}
                        style={{
                            backgroundColor: 'transparent', 
                            color: timer > 0 ? '#888' : '#FFF', 
                            border: 'none', 
                            cursor: timer > 0 ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            textDecoration: 'underline',
                            marginTop: '0px',
                        }}
                    >
                        Resend OTP
                    </button> */}
                    <label style={{ color: '#fff' }} htmlFor="newPassword">
                        New Password:
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        ref={newPwdRef}
                        autoComplete="off"
                        onChange={e => setNewPwd(e.target.value)}
                        value={newPwd}
                        required
                        style={{
                            fontSize: '22px',
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                        }}
                    />

                    <label style={{ color: '#fff' }} htmlFor="confirmPassword">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        onChange={e => setConfirmPwd(e.target.value)}
                        value={confirmPwd}
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
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                            marginTop: '1rem',
                        }}
                    >
                        Reset Password
                    </button>
                </form>

                <p style={{ color: '#fff' }}>
                    Back to{' '}
                    <Link to="/login" style={{ color: '#FFF' }}>
                        Login
                    </Link>
                    <br />
                </p>
            </section>
        </div>
    );
};

export default ForgetPassword;
