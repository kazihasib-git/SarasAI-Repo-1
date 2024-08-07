import React from 'react';
import CoachMenu from './CoachMenu';
import Messages from '../../../components/CommonComponent/Messages';

const CoachMenuMessages = () => {
    return (
        <div>
            <CoachMenu />
            <Messages role="Coach" />
        </div>
    );
};

export default CoachMenuMessages;
