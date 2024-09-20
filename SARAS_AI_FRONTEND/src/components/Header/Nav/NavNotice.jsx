import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getTaNotification} from '../../../redux/features/taModule/tamenuSlice';
import {getCoachNotification} from '../../../redux/features/coachModule/coachmenuprofileSilce';
import {getAdminNotification} from '../../../redux/features/adminModule/notification/AdminNotification';

const NavNotice = () => {

    const [userRole, setUserRole]= useState("");
    const [notifications, setNotifications] = useState([]);

    const dispatch = useDispatch();
    const { role,login} = useSelector(state => state.auth);

    const { taNotification} = useSelector(state => state.taMenu);
    const { coachNotification} = useSelector(state => state.coachMenu);
    const { adminNotification} = useSelector(state => state.adminNotification);
    
    useEffect(() => {
        setUserRole(role);
    }, [role,login]);


    useEffect(() => {
        if (userRole == 2001) dispatch(getTaNotification());
        if (userRole == 1984) dispatch(getCoachNotification());
        if (userRole == 5150) dispatch(getAdminNotification());
    },[role,userRole,login]);

    useEffect(() => {
        if (userRole == 2001) setNotifications(taNotification);
        if (userRole == 1984) setNotifications(coachNotification);
        if (userRole == 5150) setNotifications(adminNotification);
    }, [taNotification, coachNotification, adminNotification, userRole,dispatch,role,login]);

    const handleClick = () => {
        
        if (userRole == 2001) dispatch(getTaNotification());
        if (userRole == 1984) dispatch(getCoachNotification());
        if (userRole == 5150) dispatch(getAdminNotification());
    };

    // useEffect(() => {
    //     handleClick();
    //     const intervalId = setInterval(() => {
    //         handleClick();
    //     }, 120000);
    //     return () => clearInterval(intervalId);
    //   }, []);


    return (
        <li className="nav-item dropdown">
            <a className="nav-link nav-icon" href="#" data-bs-toggle="dropdown" onClick={handleClick}>
                <i className="bi bi-bell"></i>
                <span className="badge bg-primary badge-number"> {notifications ? notifications.length : 0}  </span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
            
                {(notifications && notifications.length > 0) ? (notifications.map((notification, index) => (
                    <>
                    <li key={index} className="notification-item">
                        <i className="bi bi-exclamation-circle text-warning"></i>
                        <div>
                            <h4>{notification.title || "new notification"}</h4>
                            <p>
                                {notification.message}
                            </p>
                            <p>{notification.time_elapsed}</p>
                        </div>
                    </li>

                    {
                        index < notifications.length - 1 && (
                            <li>
                                <hr className="dropdown-divider"></hr>
                            </li>  
                        )
                    }
    
                    
                    </> 
                ))):( 
                    <li className="notification-item">
                        <i className="bi bi-exclamation-circle text-warning"></i>
                        <div>
                            <h4>No new notification</h4>
                            <p>
                                You have no new notification.{' '}
                            </p>
                        </div>
                    </li>
                )}
            </ul>
        </li>
    );
}

export default NavNotice;
