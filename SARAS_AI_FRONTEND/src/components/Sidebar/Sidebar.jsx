import "./Sidebar.css";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Divider from "@mui/material/Divider";
import dashboard from "../../assets/dashboard.png";
import coaches from "../../assets/coaches.png";
import assistant from "../../assets/teachingassis.png";
const Sidebar = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <aside id="sidebar" className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeLink === "/" ? "active" : ""}`}
            to={"/"}
            onClick={() => handleLinkClick("/dashboard")}
          >
            <i className="bi bi-grid"></i>
            <span className="SideHeader">Dashboard</span>
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
              src={dashboard}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
            <span className="SideHeader">Teaching Assistant</span>
            <i className="bi bi-chevron-down ms-auto"></i>
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
                to="/ta-mapping"
                className={activeLink === "/ta-mapping" ? "active-link" : ""}
                onClick={() => handleLinkClick("/ta-mapping")}
              >
                <span className="SideSubHeading">TA Mapping</span>
              </Link>
            </li>
            <li>
              <Link
                to="/ta-availability"
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
                to="/ta-scheduling"
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
              src={coaches}
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
            <span className="SideHeader" >Coaches</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="manage-coaches-nav"
            className={`nav-content collapse ${activeLink.startsWith("/coach-") ? "show" : ""
              }`}
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link
                to={"/coach-manage"}
                className={activeLink === "/coach-manage" ? "active-link" : ""}
                onClick={() => handleLinkClick("/manage-coaches")}
              >
                <span className="SideSubHeading">Manage Coaches</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/coach-mapping"}
                className={activeLink === "/coach-mapping" ? "active-link" : ""}
                onClick={() => handleLinkClick("/coach-mapping")}
              >
                <span className="SideSubHeading">Coach Mapping</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/coach-template"}
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
                to={"/coach-availability"}
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
                to={"/coach-scheduling"}
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
            className={`nav-link ${activeLink === "/wheel-of-life" ? "active" : "collapsed"}`}
            data-bs-target="#coaching-tools-nav"
            data-bs-toggle="collapse"
            href="#"
            onClick={() => handleLinkClick("/tools")}
          >
            <img
              src={assistant}
              alt=""
              style={{ width: "18px", height: "18px", marginRight: "10px" }}
            />
            <span className="SideHeader">Coaching Tools</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul
            id="coaching-tools-nav"
            className={`nav-content collapse ${activeLink.startsWith("/tools-") ? "show" : ""}`}
            data-bs-parent="#sidebar-nav"
          >
            <li>
              <Link
                to={"/wheel-of-life"}
                className={activeLink === "/wheel-of-life" ? "active-link" : ""}
                onClick={() => handleLinkClick("/wheel-of-life")}
              >
                <span className="SideSubHeading">Wheel of Life</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/core-value"}
                className={activeLink === "/core-value" ? "active-link" : ""}
                onClick={() => handleLinkClick("/core-value")}
              >
                <span className="SideSubHeading">Core Value</span>
              </Link>
            </li>
            <li>
              <Link
                to={"/belief"}
                className={activeLink === "/belief" ? "active-link" : ""}
                onClick={() => handleLinkClick("/belief")}
              >
                <span className="SideSubHeading">Belief</span>
              </Link>
            </li>
          </ul>
        </li>
        <Divider variant="middle" component="li" sx={{ backgroundColor: "white", opacity: "0.3" }} />
        <li className="nav-item">
          <Link
            to="/students"
            className={`nav-link ${activeLink === "/students" ? "active-link" : "collapsed"
              }`}
            onClick={() => handleLinkClick("/students")}
          >
            <i className="bi bi-people"></i>
            <span className="SideHeader">Students</span>
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
            <i className="bi bi-grid-3x3-gap"></i>
            <span className="SideHeader">Batches</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
