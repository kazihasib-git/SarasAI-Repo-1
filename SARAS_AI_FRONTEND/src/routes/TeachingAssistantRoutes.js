import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TaMenuProfile from '../pages/TaModule/TaMenuProfile';
import TaMenuStudents from '../pages/TaModule/TaMenuStudents';
import TaMenuScheduledCall from '../pages/TaModule/TaMenuScheduledCall';
import CallRequest from '../pages/TaModule/CallRequest';
import TaMenuMessage from '../pages/TaModule/TaMenuMessage';
import CallRecords from '../pages/TaModule/CallRecords';
import TAMenuCalendar from '../pages/TaModule/TaMenuCalendar';
import CreateTaMenu from '../pages/TaModule/CreateTaMenu';
import Main from '../components/Main/Main';


const TeachingAssistantRoutes = () => (
    <Routes>
        <Route path="/" element={<Main page="Teaching Assistant Menu" />}>
            <Route index element={<TaMenuProfile page="My Profile" />} />
            <Route path="tamenu_profile" element={<TaMenuProfile page="My Profile" />} />
            <Route path="tamenu_students" element={<TaMenuStudents page="My Students" />} />
            <Route
                path="tamenu_scheduledcall"
                element={
                    <TaMenuScheduledCall page="Schedule Calls" />
                }
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
);

export default TeachingAssistantRoutes;
