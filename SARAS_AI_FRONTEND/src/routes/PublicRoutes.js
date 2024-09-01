import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/AUTH/Login';
import Layout from '../Layout';
import LinkPage from '../components/AUTH/LinkPage';
import Unauthorized from '../components/AUTH/Unauthorized';
import ForgetPassword from '../components/AUTH/ForgetPassword';


const PublicRoutes = () => (
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="linkpage" element={<LinkPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="Resetpassword" element={<ForgetPassword />} />
        </Route>
    </Routes>
);

export default PublicRoutes;
