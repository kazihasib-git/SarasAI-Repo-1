import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './assets/fonts/Nohemi-Bold.ttf';
import './assets/fonts/Nohemi-ExtraLight.ttf';
import './assets/fonts/Nohemi-Light.ttf';
import './assets/fonts/Nohemi-Medium.ttf';
import './assets/fonts/Nohemi-Regular.ttf';
import './assets/fonts/Nohemi-SemiBold.ttf';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogin } from './redux/features/auth/authSlice';
import AdminRoutes from './routes/AdminRoutes';
import PublicRoutes from './routes/PublicRoutes';
import CoachRoutes from './routes/CoachRoutes';
import TeachingAssistantRoutes from './routes/TeachingAssistantRoutes';

function App() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { login, role, accessToken } = useSelector(state => state.auth);

    useEffect(() => {
        if (location.pathname !== '/login') {
            localStorage.setItem('lastRoute', location.pathname);
        }
    }, [location]);

    const access_token = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('role');

    useEffect(() => {
        if (access_token) {
            dispatch(
                setLogin({
                    login: true,
                    role: userRole,
                    accessToken: access_token,
                })
            );
        }
    }, [access_token]);

    useEffect(() => {
        if (login) {
            const lastRoute = localStorage.getItem('lastRoute');
            if (lastRoute) {
                navigate(lastRoute, { replace: true });
            } else if (role.includes(1984)) {
                navigate('/coachmenu_profile', { replace: true });
            } else if (role.includes(2001)) {
                navigate('/tamenu_profile', { replace: true });
            } else if (role.includes(5150)) {
                navigate('/', { replace: true });
            } else {
                navigate('/login', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    }, [login, role, accessToken]);

    return (
        <>
            <PublicRoutes />
            {login && role == 5150 && <AdminRoutes />}
            {login && role == 1984 && <CoachRoutes />}
            {login && role == 2001 && <TeachingAssistantRoutes />}
        </>
    );
}

export default App;
