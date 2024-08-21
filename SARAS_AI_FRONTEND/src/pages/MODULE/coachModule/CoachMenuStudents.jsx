import React, { useEffect } from 'react';
import CoachMenu from './CoachMenu';
import Mystudents from '../../../components/RoleRoute/CommonComponent/Mystudents';
import { useDispatch } from 'react-redux';
import { getCoachMyStudents } from '../../../redux/features/coachModule/coachmenuprofileSilce';

const CoachMenuStudents = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCoachMyStudents());
    }, [dispatch]);

    return (
        <div>
            <CoachMenu />
            <Mystudents role="Coach" />
        </div>
    );
};

export default CoachMenuStudents;
