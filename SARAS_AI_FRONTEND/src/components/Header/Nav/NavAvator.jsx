import React, { useState, useEffect } from 'react';
import Profile from '../../../assets/profile.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function NavAvator() {
    const [isOnline, setIsOnline] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const { userData, role } = useSelector(state => state.auth);
    const [role1, setrole1]= useState();
    useEffect(() => {
        setrole1(role);
    }, [role]);

    const handleLogout = () => {
        // Clear the route and other relevant data from localStorage
        // localStorage.removeItem('lastRoute');
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('role');

        // Dispatch logout action to clear Redux state
        dispatch(logout())
        .then(() => {
            // Redirect to the login page
            navigate('/login');
        })    
    };

    const getRoleText = () => {
        if (role1 === '2001') return 'TA Teacher';
        if (role1 === '1984') return 'Coach Teacher';
        if (role1 === '5150') return 'Admin';
        return 'Unknown Role'; // Fallback for undefined or other roles
    };

    return (
        <li className="nav-item dropdown pe-3">
            <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
            >
                <div className="profile-container">
                    <img
                        src={userData?.profile_picture || Profile}
                        alt=""
                        className="profile-image rounded-circle"
                    />
                    <span
                        className={`online-dot ${isOnline ? 'online' : 'offline'}`}
                    ></span>
                </div>
                <div className="profile-info">
                    <span className="d-none d-md-block dropdown-toggle ps-2 profileName">
                        {userData.name}
                    </span>
                    <span
                        className="status-text"
                        style={{ color: isOnline ? 'green' : 'red' }}
                    >
                        {isOnline ? 'Online' : 'Offline'}
                    </span>
                </div>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                <li className="dropdown-header">
                    <h6>{userData.name}</h6>
                    
                    <span>{getRoleText()}</span>
                </li>

                <li>
                    <hr className="dropdown-divider"></hr>
                </li>

                <li>
                    <a
                        href="#"
                        className="dropdown-item d-flex align-items-center"
                    >
                        <i className="bi bi-person"></i>
                        <span>My Profile</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"></hr>
                </li>

                <li>
                    <a
                        href="#"
                        className="dropdown-item d-flex align-items-center"
                    >
                        <i className="bi bi-gear"></i>
                        <span>Account Settings</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"></hr>
                </li>

                <li>
                    <a
                        href="#"
                        className="dropdown-item d-flex align-items-center"
                    >
                        <i className="bi bi-question-circle"></i>
                        <span>Need Help?</span>
                    </a>
                </li>

                <li>
                    <hr className="dropdown-divider"></hr>
                </li>

                <li>
                    <a
                        href="#"
                        className="dropdown-item d-flex align-items-center"
                        onClick={handleLogout}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Sign Out</span>
                    </a>
                </li>
            </ul>
        </li>
    );
}

export default NavAvator;
