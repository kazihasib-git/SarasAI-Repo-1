import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../components/Main/Main';
import TaMenuProfile from '../pages/MODULE/TaModule/TaMenuProfile';
import TaMenuStudents from '../pages/MODULE/TaModule/TaMenuStudents';
import TaMenuScheduledCall from '../pages/MODULE/TaModule/TaMenuScheduledCall';
import CallRequest from '../pages/MODULE/TaModule/CallRequest';
import TaMenuMessage from '../pages/MODULE/TaModule/TaMenuMessage';
import CallRecords from '../pages/MODULE/TaModule/CallRecords';
import CreateTAPage from '../pages/managesTAs/CreateTAPage';
import CreateTaMenu from '../pages/MODULE/TaModule/CreateTaMenu';
import TAMenuCalendar from '../pages/MODULE/TaModule/TaMenuCalendar';
import Header from '../components/Header/Header';

const TARoutes = () => {
    <Routes>
        <Header />
        <Route path="/" element={<Main page="Teaching Assistant" />}>
            <Route index element={<TaMenuProfile page="My Profile" />} />
            <Route
                path="tamenu_profile"
                element={<TaMenuProfile page="My Profile" />}
            />
            <Route
                path="tamenu_students"
                element={<TaMenuStudents page="My Students" />}
            />
            <Route
                path="tamenu_scheduledcall"
                element={<TaMenuScheduledCall page="Schedule Calls" />}
            />
            <Route
                path="tamenu_callrequest"
                element={<CallRequest page="Call Request" />}
            />
            <Route
                path="tamenu_messages"
                element={<TaMenuMessage page="Messages" />}
            />
            <Route
                path="tamenu_callrecords"
                element={<CallRecords page="Call Records" />}
            />
            <Route
                path="create_ta"
                element={<CreateTAPage page="Create TA" />}
            />
            <Route
                path="create_menu"
                element={<CreateTaMenu page="Create Menu" />}
            />
            <Route
                path="tamenu_calendar"
                element={<TAMenuCalendar page="TA Menu Calendar" />}
            />
        </Route>
    </Routes>
};

export default TARoutes;
