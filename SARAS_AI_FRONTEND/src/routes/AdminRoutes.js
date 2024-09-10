import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Main from '../components/Main/Main';
import { Dashboard } from '@mui/icons-material';
import ManageTA from '../pages/managesTAs/ManageTA';
import AddEditTA from '../components/adminModule/tas/manageTAs/AddEditTA';
import TaMapping from '../pages/managesTAs/TaMapping';
import AssignedStudent from '../pages/managesTAs/AssignedStudent';
import AssignedBatches from '../pages/managesTAs/AssignedBatches';
import AssignCoachBatches from '../pages/ManageCoaches/AssignedCoachBatches';
import AssignCoachStudent from '../pages/ManageCoaches/AssignedCoachStudent';
import AssignTaCourses from '../pages/managesTAs/AssignedTaCourses';
import TaAvailability from '../pages/managesTAs/TaAvaialablity';
import TaScheduling from '../pages/managesTAs/TaScheduling';
import TaCalender from '../pages/managesTAs/TaCalendar';
import TaCourseMapping from '../pages/managesTAs/TaCourseMapping';
import AssignCoachCourses from '../pages/ManageCoaches/AssignedCoachCourses';
import ManageCoaches from '../pages/ManageCoaches/ManageCoaches';
import CreateCoachPage from '../pages/ManageCoaches/CreateCoachPage';
import CoachMapping from '../pages/ManageCoaches/CoachMapping';
import CoachCalender from '../pages/ManageCoaches/CoachCalender';
import CoachTemplate from '../pages/ManageCoaches/CoachingTemplate/CoachTemplate';
import CreateTemplate from '../pages/ManageCoaches/CoachingTemplate/CreateTemplate';
import TemplateName from '../pages/ManageCoaches/CoachingTemplate/TemplateName';
import AssignedTemplateStudents from '../pages/ManageCoaches/CoachingTemplate/AssignedTemplateStudents';
import CoachAvailability from '../pages/ManageCoaches/CoachAvailability';
import CoachScheduling from '../pages/ManageCoaches/CoachScheduling';
import CoachCourseMapping from '../pages/ManageCoaches/CoachCourseMapping';
import StudentPage from '../pages/adminModulePages/users/students/StudentPage';
import BatchPage from '../pages/adminModulePages/users/batches/BatchPage';
import CoursePage from '../pages/adminModulePages/users/courses/CoursePage';
import WheelOfLife from '../pages/adminModulePages/coachingTools/wheelOfLife/WheelOfLife';
import WOLCategories from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLCategories';
import WOLInstructions from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLInstructions';
import WOLQuestions from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLQuestions';
import AddEditWOLQuestions from '../components/adminModuleComponent/coachingTools/wheelOfLife/AddEditWOLQuestions';
import WOLOptionsConfig from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLOptionsConfig';
import WOLTestConfig from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLTestConfig';
import WOLTestConfigSelectQuestions from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLTestConfigSelectQuestions';
import WOLSelectQuestions from '../components/adminModuleComponent/coachingTools/wheelOfLife/WOLSelectQuestions';
import Header from '../components/Header/Header';

const AdminRoutes = () => {
    <Routes>
        <Header />
        <Route path="/" element={<Main page="Dashboard" />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* TA */}
            <Route path="ta-manage" element={<ManageTA page="Manage TA" />} />

            <Route path="AddEditTA" element={<AddEditTA page="Edit Ta" />} />

            <Route
                path="ta-mapping"
                element={<TaMapping page="TA Mapping" />}
            />

            <Route
                path="/active-students/:id"
                element={<AssignedStudent page="Assigned Students" />}
            />
            <Route
                path="/active-batches/:id"
                element={<AssignedBatches page="Assigned Batches" />}
            />
            <Route
                path="/active-Coach-batches/:id"
                element={<AssignCoachBatches page="Assigned Coach Batches" />}
            />
            <Route
                path="/active-Coach-students/:id"
                element={<AssignCoachStudent page="Assigned Coach Student" />}
            />
            <Route
                path="/active-Ta-courses/:id"
                element={<AssignTaCourses page="Assigned Coach Courses" />}
            />
            <Route
                path="ta-availability"
                element={<TaAvailability page="TA Availability" />}
            />
            <Route
                path="ta-scheduling"
                element={<TaScheduling page="TA Scheduling" />}
            />
            <Route
                path="ta-calendar/:name/:id/:timezoneId"
                element={<TaCalender page="Calendar" />}
            />
            <Route
                path="ta-course-mapping"
                element={<TaCourseMapping page="ta Course Mapping" />}
            />
            <Route
                path="/active-Coach-courses/:id"
                element={<AssignCoachCourses page="Assigned Coach Courses" />}
            />

            {/* COACH */}
            <Route
                path="coach-manage"
                element={<ManageCoaches page="Manage Coaches" />}
            />
            <Route
                path="createcoach"
                element={<CreateCoachPage page="Create Coach" />}
            />
            <Route
                path="coach-mapping"
                element={<CoachMapping page="Coach Mapping" />}
            />
            <Route
                path="coach-calender/:name/:id/:timezoneId"
                element={<CoachCalender page="Calendar" />}
            />
            <Route
                path="coach-template"
                element={<CoachTemplate page="Coach Template" />}
            />

            <Route
                path="create-template"
                element={<CreateTemplate page="Create Template" />}
            />
            <Route
                path="template-name"
                element={<TemplateName page="Template Name" />}
            />
            <Route
                path="coach-template/template-students/:id"
                element={
                    <AssignedTemplateStudents page="Assigned Template Students" />
                }
            />
            <Route
                path="coach-availability"
                element={<CoachAvailability page="Coach Availability" />}
            />
            <Route
                path="coach-scheduling"
                element={<CoachScheduling page="Coach Scheduling" />}
            />
            <Route
                path="coach-course-mapping"
                element={<CoachCourseMapping page="Coach Course Mapping" />}
            />

            {/* Students / batches / courses */}
            <Route path="students" element={<StudentPage />} />
            <Route path="batches" element={<BatchPage />} />
            <Route path="courses" element={<CoursePage />} />

            {/* WOL */}
            <Route path="wheel-of-life" element={<WheelOfLife />} />
            <Route path="wolCategories" element={<WOLCategories />} />
            <Route path="wolInstructions" element={<WOLInstructions />} />
            <Route path="wolQuestions" element={<WOLQuestions />} />
            <Route
                path="wolQuestions/add-Edit"
                element={<AddEditWOLQuestions />}
            />
            <Route path="wolOptionsConfig" element={<WOLOptionsConfig />} />
            <Route path="wolTestConfig" element={<WOLTestConfig />} />
            <Route
                path="WOLTestConfigSelectQuestions"
                element={<WOLTestConfigSelectQuestions />}
            />
            <Route path="WolselectQuestions" element={<WOLSelectQuestions />} />
        </Route>
    </Routes>
};

export default AdminRoutes;
