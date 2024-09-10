import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../components/Main/Main';
import CoachMenuProfile from '../pages/MODULE/coachModule/CoachMenuProfile';
import CoachCallRequest from '../pages/MODULE/coachModule/CoachCallRequest';
import CoachCallRecord from '../pages/MODULE/coachModule/CoachCallRecord';
import CoachMenuCalendar from '../pages/MODULE/coachModule/CoachMenuCalendar';
import CoachMenuScheduledcall from '../pages/MODULE/coachModule/CoachMenuScheduledcall';
import CoachMenuStudents from '../pages/MODULE/coachModule/CoachMenuStudents';
import CoachMenuMessages from '../pages/MODULE/coachModule/CoachMenuMessages';
import CoachMenuAssessments from '../pages/MODULE/coachModule/CoachMenuAssessments';
import Header from '../components/Header/Header';

const CoachRoutes = () => {
    <Routes>
        <Header />
        <Route path="/" element={<Main page="Coach" />}>
            <Route index element={<CoachMenuProfile page="Coach Profile" />} />
            <Route
                path="coachmenu_profile"
                element={<CoachMenuProfile page="Coach Menu Profile" />}
            />
            <Route
                path="coachmenu_callrequest"
                element={<CoachCallRequest page="Coach Call Request" />}
            />
            <Route
                path="coachmenu_callrecords"
                element={<CoachCallRecord page="Coach Call Records" />}
            />
            <Route
                path="coachmenu_calendar"
                element={<CoachMenuCalendar page="Coach Menu Calendar" />}
            />
            <Route
                path="coachmenu_scheduledcall"
                element={
                    <CoachMenuScheduledcall page="Coach Menu ScheduledCall" />
                }
            />
            <Route
                path="coachmenu_students"
                element={<CoachMenuStudents page="Coach Menu Students" />}
            />
            <Route
                path="coachmenu_messages"
                element={<CoachMenuMessages page="Coach Menu Messages" />}
            />
            <Route
                path="coachmenu_assessments"
                element={<CoachMenuAssessments page="Coach Menu Assessemets" />}
            />
        </Route>
    </Routes>
};

export default CoachRoutes;
