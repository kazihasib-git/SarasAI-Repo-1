import React from 'react';

import CreateTaMenu from './CreateTaMenu';
import Mystudents from '../../../components/RoleRoute/CommonComponent/Mystudents';

const TaMenuStudents = () => {
    return (
        <div>
            <CreateTaMenu />
            <Mystudents role="TA" />
        </div>
    );
};

export default TaMenuStudents;
