import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from '../components/Main/Main';
import Dashboard from '../components/adminModuleComponent/dashboard/Dashboard';
import AddEditTA from '../components/adminModule/tas/manageTAs/AddEditTA';
import TaMapping from '../pages/adminModulePages/managesTAs/TaMapping';
import AssignedStudent from '../pages/adminModulePages/managesTAs/AssignedStudent';
import AssignedBatches from '../pages/adminModulePages/managesTAs/AssignedBatches';
import AssignTaCourses from '../pages/adminModulePages/managesTAs/AssignedTaCourses';
import TAAvailability from '../pages/adminModulePages/managesTAs/TaAvaialablity';
import TaScheduling from '../pages/adminModulePages/managesTAs/TaScheduling';
import TaCalender from '../pages/adminModulePages/managesTAs/TaCalendar';
import TaCourseMapping from '../pages/adminModulePages/managesTAs/TaCourseMapping';
import AssignCoachCourses from '../pages/adminModulePages/ManageCoaches/AssignedCoachCourses';
import ManageCoaches from '../pages/adminModulePages/ManageCoaches/ManageCoaches';
import CreateCoachPage from '../pages/adminModulePages/ManageCoaches/CreateCoachPage';
import CoachMapping from '../pages/adminModulePages/ManageCoaches/CoachMapping';
import CoachCalender from '../pages/adminModulePages/ManageCoaches/CoachCalender';
import CoachTemplate from '../pages/adminModulePages/ManageCoaches/CoachingTemplate/CoachTemplate';
import CreateTemplate from '../pages/adminModulePages/ManageCoaches/CoachingTemplate/CreateTemplate';
import TemplateName from '../pages/adminModulePages/ManageCoaches/CoachingTemplate/TemplateName';
import AssignedTemplateStudents from '../pages/adminModulePages/ManageCoaches/CoachingTemplate/AssignedTemplateStudents';
import CoachAvailability from '../pages/adminModulePages/ManageCoaches/CoachAvialability';
import CoachScheduling from '../pages/adminModulePages/ManageCoaches/CoachScheduling';
import CoachCourseMapping from '../pages/adminModulePages/ManageCoaches/CoachCourseMapping';
import AssignCoachBatches from '../pages/adminModulePages/ManageCoaches/AssignedCoachBatches';
import AssignCoachStudent from '../pages/adminModulePages/ManageCoaches/AssignedCoachStudent';
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
import ManagesTAs from '../pages/adminModulePages/managesTAs/ManagesTAs';

const AdminRoutes = () => (
    <Routes>
        <Route path="/" element={<Main page="Dashboard" />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* TA */}
            <Route path="ta-manage" element={<ManagesTAs page="Manage TA" />} />
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
                path="/active-Ta-courses/:id"
                element={<AssignTaCourses page="Assigned Coach Courses" />}
            />
            <Route
                path="ta-availability"
                element={<TAAvailability page="TA Availability" />}
            />
            <Route
                path="ta-scheduling"
                element={<TaScheduling page="TA Scheduling" />}
            />
            <Route
                path="ta-calendar/:name/:id"
                element={<TaCalender page="Calendar" />}
            />
            <Route
                path="ta-course-mapping"
                element={<TaCourseMapping page="ta Course Mapping" />}
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
                path="coach-calender/:name/:id"
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
                path="/active-Coach-students/:id"
                element={<AssignCoachStudent page="Assigned Coach Student" />}
            />
            <Route
                path="/active-Coach-batches/:id"
                element={<AssignCoachBatches page="Assigned Coach Batches" />}
            />
            <Route
                path="/active-Coach-courses/:id"
                element={<AssignCoachCourses page="Assigned Coach Courses" />}
            />
            <Route
                path="coach-course-mapping"
                element={<CoachCourseMapping page="Coach Course Mapping" />}
            />

            {/* STUDENTS */}
            <Route path="students" element={<StudentPage />} />

            {/* BATCHES */}
            <Route path="batches" element={<BatchPage />} />

            {/* COURSES */}
            <Route path="courses" element={<CoursePage />} />

            {/* COACHING TOOLS */}
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
);

export default AdminRoutes;
