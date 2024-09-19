import React, { useEffect } from 'react';
import Header from '../../Header/Header';
import Sidebar from '../../Sidebar/Sidebar';
import { useDispatch } from 'react-redux';
import {getAdminNotification} from '../../../redux/features/adminModule/notification/AdminNotification';

function Dashboard() {
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getAdminNotification());
    }, [dispatch]);


    return (
        <>
            <Header />
            <Sidebar />
            <div>
                <h1>Dashboard</h1>
            </div>
        </>
    );
}

export default Dashboard;
