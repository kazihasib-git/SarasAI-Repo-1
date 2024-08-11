import React, {useEffect} from 'react';
import CoachMenu from './CoachMenu';
import Messages from '../../../components/CommonComponent/Messages';
import {useDispatch} from 'react-redux';
import {
    getCoachMenuAssignedStudents,
    getTaCoachAllChats,
} from '../../../redux/features/coachModule/coachmenuprofileSilce';

const CoachMenuMessages = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCoachMenuAssignedStudents());
        dispatch(getTaCoachAllChats('coach'));
    }, []);

    return (
        <div>
            <CoachMenu />
            <Messages role="coach" />
        </div>
    );
};

export default CoachMenuMessages;
