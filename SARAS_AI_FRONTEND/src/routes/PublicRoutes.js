import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout';
import LinkPage from '../components/AUTH/LinkPage';
import Unauthorized from '../components/AUTH/Unauthorized';
import ForgetPassword from '../components/AUTH/ForgetPassword';
import Login from '../components/AUTH/Login';

const PublicRoutes = () => {
    <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="login" element={<Login />} />
            <Route path="linkpage" element={<LinkPage />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="resetpassword" element={<ForgetPassword />} />
        </Route>
    </Routes>
};

export default PublicRoutes;
