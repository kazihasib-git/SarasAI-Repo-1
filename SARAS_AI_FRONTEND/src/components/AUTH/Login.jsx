import { useRef, useState, useEffect } from 'react';

import './Login.css';
import useAuth from '../Hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/features/auth/authSlice';
import EmailPopup from './EmailPopup';

const Login = () => {
    const { setAuth } = useAuth();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    // using redux toolkit
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const requestBody = {
                username: user,
                password: pwd,
            };

            dispatch(login(requestBody));
        } catch (error) {
            console.error(error);
        }
    };

    const handlePopupOpen = () => setIsPopupOpen(true); // Open popup
    const handlePopupClose = () => setIsPopupOpen(false); // Close popup

    return (
        <div id="loginPage" className="login_Container">
            <section>
                <p
                    ref={errRef}
                    className={errMsg ? 'errmsg' : 'offscreen'}
                    aria-live="assertive"
                >
                    {errMsg}
                </p>
                <h1 style={{ color: '#FFF' }}>Sign In</h1>
                <form onSubmit={onSubmit}>
                    <label style={{ color: '#fff' }} htmlFor="username">
                        Username:
                    </label>
                    <input
                        type="text"
                        id="username"
                        ref={userRef}
                        autoComplete="off"
                        onChange={e => setUser(e.target.value)}
                        value={user}
                        required
                        style={{
                            fontSize: '22px',
                            padding: '0.25rem',
                            borderRadius: '0.5rem',
                        }}
                    />

                    <label style={{ color: '#fff' }} htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        onChange={e => setPwd(e.target.value)}
                        value={pwd}
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
                        }}
                    >
                        Sign In
                    </button>
                </form>

                <p style={{ color: '#fff' }}>
                    Forget Password ?<br />
                    <span className="line">
                        {/*put router link here*/}
                        <a id="clickbutton" href="#" onClick={handlePopupOpen}>
                            Click Here
                        </a>
                    </span>
                </p>
            </section>
            {isPopupOpen && <EmailPopup handleClose={handlePopupClose} />}
        </div>
    );
};

export default Login;
