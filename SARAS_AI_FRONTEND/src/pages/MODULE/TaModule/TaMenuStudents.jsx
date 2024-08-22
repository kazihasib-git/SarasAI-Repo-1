import React, { useEffect } from 'react';

import CreateTaMenu from './CreateTaMenu';
import Mystudents from '../../../components/RoleRoute/CommonComponent/Mystudents';
import { useDispatch } from 'react-redux';
import { getMyStudents } from '../../../redux/features/taModule/tamenuSlice';

const TaMenuStudents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMyStudents());
    }, [dispatch]);
    return (
        <div>
            <CreateTaMenu />
            <Mystudents role="TA" />
        </div>
    );
};

export default TaMenuStudents;
