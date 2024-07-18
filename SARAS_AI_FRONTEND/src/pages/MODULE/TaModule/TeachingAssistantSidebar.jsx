
import './TaMenuSidebar.css';
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import mystudent from "../../../assets/mystudent.png";
import message from "../../../assets/message.png";
import calendar from "../../../assets/calendar.png";
import   callrecordsicon from "../../../assets/callrecordsicon.png";
import schedulecallsicon from "../../../assets/schedulecallsicon.png";
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
          <Link
           to="/createmenu"
        //    className={activeLink === "/ta-manage" ? "active-link" : ""}
            className={activeLink === "/createmenu" ? "active-link" : ""}
           
            onClick={() => handleLinkClick("/createmenu")}
          >
          <i className='bi bi-person-circle'></i>
            <span >My Profile</span>
            {/* <i className="bi bi-chevron-up ms-auto"></i> */}
          </Link>
        </li>
       
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        <li className="nav-item">
          <a
            className={`nav-link ${activeLink.startsWith("/manage-") ? "active" : "collapsed"
              }`}
            data-bs-target="#manage-tas-nav"
            data-bs-toggle="collapse"
            href="#"
            onClick={() => handleLinkClick("/manage")}
          >
            {/* <i className='bi bi-menu-button-wide'></i>
             */}
              <img
              src={mystudent}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
            <span >My Students</span>
          </a>
          <ul
            id="manage-tas-nav"
            className={`nav-content collapse ${activeLink.startsWith("/ta-") ? "show" : ""
              }`}
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link
                to="/ta-manage"
                className={activeLink === "/ta-manage" ? "active-link" : ""}
                onClick={() => handleLinkClick("/ta-manage")}
              >
                <span className="SideSubHeading">Manage TA</span>
              </Link>
            </li>
            <li>
              <Link
                to=""
                className={activeLink === "/ta-mapping" ? "active-link" : ""}
                onClick={() => handleLinkClick("/ta-mapping")}
              >
                <span className="SideSubHeading">TA Mapping</span>
              </Link>
            </li>
            <li>
              <Link
                to=""
                className={
                  activeLink === "/ta-availability" ? "active-link" : ""
                }
                onClick={() => handleLinkClick("/ta-availability")}
              >
                <span className="SideSubHeading">TA Availability</span>
              </Link>
            </li>
            <li>
              <Link
                to=""
                className={activeLink === "/ta-scheduling" ? "active-link" : ""}
                onClick={() => handleLinkClick("/ta-scheduling")}
              >
                <span className="SideSubHeading">TA Scheduling</span>
              </Link>
            </li>
          </ul>
        </li>
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        <li className="nav-item">
          <a
            className={`nav-link ${activeLink.startsWith("/coach-") ? "active" : "collapsed"
              }`}
            data-bs-target="#manage-coaches-nav"
            data-bs-toggle="collapse"
            href="#"
            onClick={() => handleLinkClick("/coach")}
          >
            <img
              src={calendar}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
          
            <span>My Calender</span>
          </a>
          <ul
            id="manage-coaches-nav"
            className={`nav-content collapse ${activeLink.startsWith("/coach-") ? "show" : ""
              }`}
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link
                to={""}
                className={activeLink === "/coach-manage" ? "active-link" : ""}
                onClick={() => handleLinkClick("/manage-coaches")}
              >
                <span className="SideSubHeading">Manage Coaches</span>
              </Link>
            </li>
            <li>
              <Link
                to={""}
                className={activeLink === "/coach-mapping" ? "active-link" : ""}
                onClick={() => handleLinkClick("/coach-mapping")}
              >
                <span className="SideSubHeading">Coach Mapping</span>
              </Link>
            </li>
            <li>
              <Link
                to={""}
                className={
                  activeLink === "/coach-template" ? "active-link" : ""
                }
                onClick={() => handleLinkClick("/coach-template")}
              >
                <span className="SideSubHeading">Coach Template</span>
              </Link>
            </li>
            <li>
              <Link
                to={""}
                className={
                  activeLink === "/coach-availability" ? "active-link" : ""
                }
                onClick={() => handleLinkClick("/coach-availability")}
              >
                <span className="SideSubHeading">Coach Availability</span>
              </Link>
            </li>
            <li>
              <Link
                to={""}
                className={
                  activeLink === "/coach-scheduling" ? "active-link" : ""
                }
                onClick={() => handleLinkClick("/coach-scheduling")}
              >
                <span className="SideSubHeading">Coach Scheduling</span>
              </Link>
            </li>
          </ul>
        </li>
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        {/* <li className='nav-item'>
          <Link className={`nav-link ${activeLink === '/courses' ? 'active' : 'collapsed'}`} to={'/courses'} onClick={() => handleLinkClick('/courses')}>
            <i className='bi bi-book'></i>
            <span>Courses</span>
          </Link>
        </li> */}
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        <li className="nav-item">
          <a
            className={`nav-link ${activeLink === "/tools" ? "active" : "collapsed"}`}
            data-bs-target="#coaching-tools-nav"
            data-bs-toggle="collapse"
            href="#"
            onClick={() => handleLinkClick("/tools")}
          >
             <img
              src={schedulecallsicon}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
            <span>Scheduled Calls</span>
           
          </a>
        </li>
        <Divider variant="middle" component="li" sx={{ backgroundColor: "white", opacity: "0.3" }} />
        <li className="nav-item">
          <Link
            to="/students"
            className={`nav-link ${activeLink === "/students" ? "active-link" : "collapsed"
              }`}
            onClick={() => handleLinkClick("/students")}
          >
       
       <i className='bi bi-telephone-plus-fill'></i>
            <span>Call Requests</span>
          </Link>
        </li>
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        <li className="nav-item">
          <Link
            to="/batches"
            className={`nav-link ${activeLink === "/batches" ? "active-link" : ""
              }`}
            onClick={() => handleLinkClick("/batches")}
          >
           <img
              src={message}
              style={{ width: "18px", height: "13.88px", marginRight: "10px" }}
            />
            <span>Messages</span>
          </Link>
          <Divider variant="middle" component="li" sx={{ backgroundColor: "white", opacity: "0.3" }} />
        <li className="nav-item">
          <Link
            to="/call-records"
            className={`nav-link ${activeLink === "/call-records" ? "active-link" : "collapsed"
              }`}
            onClick={() => handleLinkClick("/call-records")}
          >
            <img
              src={callrecordsicon}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
        
            <span>Call Records</span>
          </Link>
        </li>
        <Divider
          variant="middle"
          component="li"
          sx={{ backgroundColor: "white", opacity: "0.3" }}
        />
        </li>
      </ul>
    </aside>
  );
};

export default TaMenuSidebar;
