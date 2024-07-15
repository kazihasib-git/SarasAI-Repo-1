import React from 'react'

import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import DynamicTable from '../../../components/CommonComponent/DynamicTable';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

const WOLOptionsConfig = () => {
    const dispatch = useDispatch();

    return (
        <>
            <Header />
            <Sidebar />
        </>
    )
}

export default WOLOptionsConfig;