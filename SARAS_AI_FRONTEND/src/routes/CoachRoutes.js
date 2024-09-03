import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CoachMenuProfile from '../pages/coachModule/CoachMenuProfile';
import CoachMenu from '../pages/coachModule/CoachMenu';
import CoachCallRequest from '../pages/coachModule/CoachCallRequest';
import CoachCallRecord from '../pages/coachModule/CoachCallRecord';
import CoachMenuCalendar from '../pages/coachModule/CoachMenuCalendar';
import CoachMenuScheduledcall from '../pages/coachModule/CoachMenuScheduledcall';
import CoachMenuStudents from '../pages/coachModule/CoachMenuStudents';
import CoachMenuMessages from '../pages/coachModule/CoachMenuMessages';
import CoachMenuAssessments from '../pages/coachModule/CoachMenuAssessments';
import Main from '../components/Main/Main';

const CoachRoutes = () => (
    <Routes>
        <Route path="/" element={<Main page="Coach Menu" />}>
            <Route
                index
                element={<CoachMenuProfile page="Coach Menu Profile" />}
            />
            <Route path="coachmenu" element={<CoachMenu page="Coach Menu" />} />
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
);

export default CoachRoutes;
