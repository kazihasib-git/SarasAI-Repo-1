import React, { useState, useEffect } from 'react';
import Profile from '../../../assets/userimg.png';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom'; 

function NavAvator() {
    const [isOnline, setIsOnline] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Initialize navigate
    const { userData, role } = useSelector(state => state.auth);
    const { taProfileData } = useSelector(state => state.taMenu);
    const { coachProfileData } = useSelector(state => state.coachMenu);
    const [userRole, setUserRole]= useState();
    const [userName, setUserName] = useState("");
    
    
    useEffect(() => {
        setUserRole(role);
    }, [role]);


    useEffect(() => {
       if (userRole === '2001') {
           setUserName(taProfileData.name);
       }
       if (userRole === '1984') {
              setUserName(coachProfileData.name);
        }
        if (userRole === '5150') {
            setUserName("Admin");
        }

    }, [taProfileData,coachProfileData,userData,role,userRole]);

    

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
        if (userRole === '2001') return 'Teaching Assistant';
        if (userRole === '1984') return 'Coach';
        if (userRole === '5150') return 'Admin';
        return 'Unknown Role'; // Fallback for undefined or other roles
    };

    let image = Profile;
    if (userRole === '2001'){
         image = taProfileData.profile_picture || Profile;
    }
    if (userRole === '1984') {
        image = coachProfileData.profile_picture || Profile;
    }


    return (
        
        <li className="nav-item dropdown pe-3">
            <a
                className="nav-link nav-profile d-flex align-items-center pe-0"
                href="#"
                data-bs-toggle="dropdown"
            >
                <div className="profile-container">
                    <img
                        src={ image }
                        alt=""
                        className="profile-image rounded-circle"
                    />
                    <span
                        className={`online-dot ${isOnline ? 'online' : 'offline'}`}
                    ></span>
                </div>
                <div className="profile-info">
                    <span className="d-none d-md-block dropdown-toggle ps-2 profileName">
                        {userName}
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
                    <h6>{userName}</h6>
                    
                    <span>{getRoleText()}</span>
                </li>

                <li>
                    <hr className="dropdown-divider"></hr>
                </li>

                <li>
                    <a
                        href="#"
                        className="dropdown-item d-flex align-items-center"
                        onClick={() => userRole === '2001' ? navigate('/tamenu_profile') : userRole === '1984' ? navigate('/coachmenu_profile') : navigate('/')}
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
