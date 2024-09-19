import React from 'react';
import './Nav.css';
import NavNotice from './NavNotice';
// import NavMessage from './NavMessage';
import NavAvator from './NavAvator';
// import NavSetting from './NavSetting';
function Nav() {
    return (
        <nav className="header-nav ms-auto">
            <ul className="d-flex align-items-center">
                <NavNotice />
                {/* <NavMessage />
                <NavSetting /> */}
                <NavAvator />
            </ul>
        </nav>
    );
}

export default Nav;
