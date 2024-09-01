import React, { useEffect } from 'react';
import CreateTaMenu from './CreateTaMenu';
import Messages from '../../components/CommonComponent/Messages';

import { useDispatch } from 'react-redux';
import { getTaMenuAssignedStudents } from '../../redux/features/taModule/tamenuSlice';
import { getTaCoachAllChats } from '../../redux/features/coachModule/coachmenuprofileSilce';

const TaMenuMessage = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTaMenuAssignedStudents());
        dispatch(getTaCoachAllChats('ta'));
    }, []);

    return (
        <div>
            <CreateTaMenu />
            <Messages role="ta" />
        </div>
    );
};

export default TaMenuMessage;
