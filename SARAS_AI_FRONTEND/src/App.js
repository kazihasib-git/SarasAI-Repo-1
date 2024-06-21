import './App.css';
import Header from './components/Header/Header';
import Grid from '@mui/material/Grid';
import Sidebar from './components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import 'bootstrap-icons/font/bootstrap-icons.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Main from './components/Main/Main';
import { Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Login from './components/AUTH/Login'
import LinkPage from './components/AUTH/LinkPage'
import Unauthorized from './components/AUTH/Unauthorized'
import RequireAuth from './components/Hooks/RequireAuth'
import Dashboard from './components/Dashboard'
import ManagesTAs from './pages/managesTAs/ManagesTAs';
import TAAvailability from './pages/managesTAs/TaAvaialablity'
import ManageCoaches from './pages/ManageCoaches/ManageCoaches';
import CoachMapping from './pages/ManageCoaches/CoachMapping';
import CoachTemplate from './pages/ManageCoaches/CoachTemplate';
import CoachAvialability from './pages/managesTAs/CoachAvialability';
import CoachScheduling from './pages/ManageCoaches/CoachScheduling';
import AllRoutes from './components/AllRoutes/AllRoutes'
import TaMapping from './pages/managesTAs/TaMapping';
import TaScheduling from './pages/managesTAs/TaScheduling';
import Calendar from './components/Calender/indexCalender';
import StudentPage from './pages/students/StudentPage';
import AddEditTA from './components/adminModule/tas/manageTAs/AddEditTA';
import CreateTAPage from './pages/managesTAs/CreateTAPage';
import CreateCoachPage from './pages/ManageCoaches/CreateCoachPage';
import CoachCalender from './pages/ManageCoaches/CoachCalender';
const ROLES = {
  "Teaching": 2001,
  "Coaches": 1984,
  "Admin": 5150
};

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public Routes */}
        <Route path='login' element={<Login />} />
        <Route path='linkpage' element={<LinkPage />} />
        <Route path='unauthorized' element={<Unauthorized />} />

        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path='/' element={<Main page="Dashboard" />}>
            <Route index element={<Dashboard />} />
            <Route path='dashboard' element={<Dashboard />} />
            <Route path="students" element={<StudentPage />} />
            <Route path="manage-ta/createta" element={<CreateTAPage />} />
            <Route path="manage-coaches/createcoach" element={<CreateCoachPage />} />
            <Route path='manage-coaches/tacalender' element={<CoachCalender />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Teaching]} />}>
          <Route path='/' element={<Main page="Teaching Assistant" />}>
            <Route path='manage-ta' element={<ManagesTAs page="Manage TA" />} />
            <Route path='ta-mapping' element={<TaMapping page="TA Mapping" />} />
            <Route path='ta-availability' element={<TAAvailability page="TA Availability" />} />
            <Route path='ta-scheduling' element={<TaScheduling page="TA Scheduling" />} />
            <Route path='calendar' element={<Calendar page="Calendar" />} />
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Coaches]} />}>
          <Route path='/' element={<Main page="Manage Coaches" />}>
            <Route path='manage-coaches' element={<ManageCoaches page="Manage Coaches" />} />
            <Route path='coach-mapping' element={<CoachMapping page="Coach Mapping" />} />
            <Route path='coach-template' element={<CoachTemplate page="Coach Template" />} />
            <Route path='coach-availability' element={<CoachAvialability page="Coach Availability" />} />
            <Route path='coach-scheduling' element={<CoachScheduling page="Coach Scheduling" />} />
          </Route>
        </Route>

        {/* Missed */}
        <Route path='*' element={<AllRoutes />} />
      </Route>
    </Routes>
  );
}


export default App;




// Previous changes 

{/* <div className="App">
<Grid container spacing={0.5}>
  <Grid item xs={12}>
    <Header />
  </Grid>
  <Grid item xs={2} sx={{ background: 'linear-gradient(to bottom, #362f9c, #7931a3)', height: '90vh'}}>
      <Sidebar />
  </Grid>
  <Grid item xs={10}>
    <ManagesTAs/>
  </Grid>
</Grid>
</div> */}