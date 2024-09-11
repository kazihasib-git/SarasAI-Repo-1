import React from 'react';
import { Outlet } from 'react-router-dom';
import PageTitle from '../PageTitle/PageTitle'; // Ensure this component is
import './Main.css';
function Main({ page }) {
    return (
        <main id="main" className="main">
            {/* <PageTitle page={page} /> */}
            <Outlet />
        </main>
    );
}

export default Main;
