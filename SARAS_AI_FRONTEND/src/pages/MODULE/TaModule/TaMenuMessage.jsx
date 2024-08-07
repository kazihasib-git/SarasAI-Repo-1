import React from 'react';
import CreateTaMenu from './CreateTaMenu';
import Messages from '../../../components/CommonComponent/Messages';
//import CoachMenuMessages from '../coachModule/CoachMenuMessages';

const TaMenuMessage = () => {
    return (
        <div>
            <CreateTaMenu />
            <Messages role="TA" />
        </div>
    );
};

export default TaMenuMessage;
