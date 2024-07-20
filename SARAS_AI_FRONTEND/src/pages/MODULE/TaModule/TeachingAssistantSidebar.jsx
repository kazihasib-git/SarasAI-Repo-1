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

    const handleLinkClick = (path) => {
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
                    <a
                        className={`nav-link ${
                            activeLink.startsWith('/manage-')
                                ? 'active'
                                : 'collapsed'
                        }`}
                        data-bs-target="#manage-tas-nav"
                        data-bs-toggle="collapse"
                        href="#"
                        onClick={() => handleLinkClick('/manage')}
                    >
                        {/* <i className='bi bi-menu-button-wide'></i>
                         */}
                        <img
                            src={mystudent}
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '10px',
                            }}
                        />
                        <span>My Students</span>
                    </a>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />

                <li className="nav-item">
                    <Link
                        to={'/coachmenu-calendar'}
                        className={`nav-link ${activeLink.startsWith('/coachmenu-') ? 'active' : ''}`}
                        onClick={() => handleLinkClick('/coachmenu-calendar')}
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
                    <a
                        className={`nav-link ${activeLink === '/tools' ? 'active' : 'collapsed'}`}
                        data-bs-target="#coaching-tools-nav"
                        data-bs-toggle="collapse"
                        href="#"
                        onClick={() => handleLinkClick('/tools')}
                    >
                        <img
                            src={schedulecallsicon}
                            style={{
                                width: '18px',
                                height: '18px',
                                marginRight: '10px',
                            }}
                        />
                        <span>Scheduled Calls</span>
                    </a>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />
                <li className="nav-item">
                    <Link
                        to="/call-request"
                        className={`nav-link ${
                            activeLink === '/call-request'
                                ? 'active-link'
                                : 'collapsed'
                        }`}
                        onClick={() => handleLinkClick('/call-request')}
                    >
                        <i className="bi bi-telephone-plus-fill"></i>
                        <span>Call Requests</span>
                    </Link>
                </li>
                <Divider
                    variant="middle"
                    component="li"
                    sx={{ backgroundColor: 'white', opacity: '0.3' }}
                />
                <li className="nav-item">
                    <Link
                        to="/batches"
                        className={`nav-link ${
                            activeLink === '/batches' ? 'active-link' : ''
                        }`}
                        onClick={() => handleLinkClick('/batches')}
                    >
                        <img
                            src={message}
                            style={{
                                width: '18px',
                                height: '13.88px',
                                marginRight: '10px',
                            }}
                        />
                        <span>Messages</span>
                    </Link>
                    <Divider
                        variant="middle"
                        component="li"
                        sx={{ backgroundColor: 'white', opacity: '0.3' }}
                    />
                    <li className="nav-item">
                        <Link
                            to="/call-records"
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
