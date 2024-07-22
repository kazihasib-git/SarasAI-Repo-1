import './TaMenuSidebar.css';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import mystudent from '../../../assets/mystudent.png';
import message from '../../../assets/message.png';
import calendar from '../../../assets/calendar.png';
import callrecordsicon from '../../../assets/callrecordsicon.png';
import schedulecallsicon from '../../../assets/schedulecallsicon.png';
const TaMenuSidebar = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(location.pathname);

    const handleLinkClick = path => {
        console.log(path);
        console.log(activeLink);
        setActiveLink(path);
    };

    return (
        <aside id="sidebar" className="sidebar">
            <ul className="sidebar-nav" id="sidebar-nav">
                <li className="nav-item">
                    <a
                        className={`nav-link ${activeLink.startsWith('/coachmenu-') ? 'active' : 'collapsed'}`}
                        href="#"
                        onClick={() => handleLinkClick('/coachmenu-profile')}
                    >
                        <i className="bi bi-person-circle"></i>
                        <span>My Profile</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </a>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                </li>

                <li className="nav-item">
                    <Link
                        to="/tamenu_profile"
                        className={`nav-link ${
                            activeLink.startsWith('/coachmenu-')
                                ? 'active'
                                : 'collapsed'
                        }`}
                        href="#"
                        onClick={() => handleLinkClick('/coachmenu-profile')}
                    >
                        <i className="bi bi-person-circle"></i>
                        <span>My Profile</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                </li>

                <li className="nav-item">
                    <Link
                        to={'/tamenu_students'}
                        className={`nav-link ${
                            activeLink.startsWith('/tamenu-') ? 'active' : ''
                        }`}
                        onClick={() => handleLinkClick('/')}
                    >
                        <img
                            src={mystudent}
                            alt="Students"
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '8px',
                            }}
                        />
                        <span>My Students</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />

                <li className="nav-item">
                    <Link
                        to={'/tamenu_calendar'}
                        className={`nav-link ${
                            activeLink.startsWith('/tamenu-') ? 'active' : ''
                        }`}
                        onClick={() => handleLinkClick('/tamenu-calendar')}
                    >
                        <img
                            src={calendar}
                            alt="Calendar"
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '8px',
                            }}
                        />
                        <span>My Calendar</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                </li>

                <li className="nav-item">
                    <Link
                        to={'/tamenu_scheduledcall'}
                        className={`nav-link ${
                            activeLink.startsWith('/tachmenu-') ? 'active' : ''
                        }`}
                        onClick={() => handleLinkClick('/ta-manage')}
                    >
                        <img
                            src={schedulecallsicon}
                            alt="Scheduled Calls"
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '8px',
                            }}
                        />
                        <span>Scheduled Calls</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />
                <li className="nav-item">
                    <Link
                        to="/tamenu_callrequest"
                        className={`nav-link ${
                            activeLink === '/call-request'
                                ? 'active-link'
                                : 'collapsed'
                        }`}
                        onClick={() => handleLinkClick('/call-request')}
                    >
                        <i className="bi bi-telephone-plus-fill"></i>
                        <span>Call Requests</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />
                <li className="nav-item">
                    <Link
                        to={'/tamenu_messages'}
                        className={`nav-link ${
                            activeLink.startsWith('/tamenu-') ? 'active' : ''
                        }`}
                        onClick={() => handleLinkClick('')}
                    >
                        <img
                            src={message}
                            alt="Messages"
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '8px',
                            }}
                        />
                        <span>Messages</span>
                        <i className="bi bi-chevron-right ms-auto"></i>
                    </Link>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                    <li className="nav-item">
                        <Link
                            to="/tamenu_callrecords"
                            className={`nav-link ${
                                activeLink === '/call-records'
                                    ? 'active-link'
                                    : 'collapsed'
                            }`}
                            onClick={() => handleLinkClick('/call-records')}
                        >
                            <img
                                src={callrecordsicon}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    marginRight: '10px',
                                }}
                            />

                            <span>Call Records</span>
                            <i className="bi bi-chevron-right ms-auto"></i>
                        </Link>
                    </li>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                </li>
            </ul>
        </aside>
    );
};

export default TaMenuSidebar;
