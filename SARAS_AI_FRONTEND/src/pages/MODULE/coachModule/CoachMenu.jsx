import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";

import Header from "../../../components/Header/Header";
import Logo from "../../../components/Header/Logo/Logo";
import Nav from "../../../components/Header/Nav/Nav";

import Calendar from "../../../assets/calendar.svg";
import Callrecord from "../../../assets/callrecords.svg";
import Scheduledcalls from "../../../assets/scheduledcalls.svg";
import Assessment from "../../../assets/assessments.svg";
//import Callrequest from '../../../callrequest.svg';
import Students from "../../../assets/students.svg";
import Message from "../../../assets/messages.svg";

const CoachMenu = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <>
      <Header>
        <Logo />
        <Nav />
      </Header>

      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link
              to={"/coachmenu_profile"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : "collapsed"
              }`}
              href="#"
              onClick={() => handleLinkClick("/coachmenu-profile")}
            >
              <i className="bi bi-person-circle"></i>
              <span>My Profile</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_students"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/")}
            >
              <img
                src={Students}
                alt="Students"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>My Students</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_calendar"}
              className={`nav-link ${
                activeLink === "/coachmenu-calendar" ? "active orange-text" : ""
              }`}
              onClick={() => handleLinkClick("/calendar")}
            >
              <img
                src={Calendar}
                alt="Calendar"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>My Calendar</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_scheduledcall"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/ta-manage")}
            >
              <img
                src={Scheduledcalls}
                alt="Scheduled Calls"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>Scheduled Calls</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_callrequest"}
              className={`nav-link ${
                activeLink === "/coach-call-request" ? "active orange-text" : ""
              }`}
              onClick={() => handleLinkClick("/callrequest")}
            >
              <img
                src={Callrecord}
                alt="Call Request"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>Call Requests</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_messages"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/ta-manage")}
            >
              <img
                src={Message}
                alt="Messages"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>Messages</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_callrecords"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/call-records")}
            >
              <img
                src={Callrecord}
                alt="Call Records"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>Call Records</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
            <Divider
              variant="middle"
              component="li"
              sx={{ backgroundColor: "white", opacity: "0.3" }}
            />
          </li>
          <li className="nav-item">
            <Link
              to={"/coachmenu_assessments"}
              className={`nav-link ${
                activeLink.startsWith("/coachmenu-") ? "active" : ""
              }`}
              onClick={() => handleLinkClick("/ta-manage")}
            >
              <img
                src={Assessment}
                alt="Assessments"
                style={{ width: "18px", height: "18px", marginRight: "8px" }}
              />
              <span>Assessments</span>
              <i className="bi bi-chevron-right ms-auto"></i>
            </Link>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default CoachMenu;
