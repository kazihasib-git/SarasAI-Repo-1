import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom'; // Import Link here
import './Login.css'; // Reusing the same CSS for consistent styling

const ForgetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const newPwdRef = useRef();
    const errRef = useRef();

    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        newPwdRef.current.focus();

        // Extract query parameters from the URL
        const params = new URLSearchParams(location.search);
        setEmail(params.get('email'));
        setCode(params.get('code'));
    }, [location.search]);

    useEffect(() => {
        setErrMsg('');
    }, [newPwd, confirmPwd]);

    const onSubmit = async e => {
        e.preventDefault();

        if (newPwd !== confirmPwd) {
            setErrMsg('Passwords do not match');
            errRef.current.focus();
            return;
        }

        try {
            // Call your actual API with email, code, and the new password
            const response = {
                status: 200, // Assuming 200 means success
            };

            if (response.status === 200) {
                setNewPwd('');
                setConfirmPwd('');
                navigate('/login', { replace: true });
            } else {
                setErrMsg('Reset Failed');
                errRef.current.focus();
            }
        } catch (error) {
            console.error(error);
            setErrMsg('Reset Failed');
            errRef.current.focus();
        }
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
