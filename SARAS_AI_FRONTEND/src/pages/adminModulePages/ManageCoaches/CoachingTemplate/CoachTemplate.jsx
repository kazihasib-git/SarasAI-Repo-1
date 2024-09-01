import React, { useEffect, useState } from 'react';
import Header from '../../../../components/Header/Header';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import CoachTemplateTable from './TemplateTable/CoachTemplateTable';
import {
    closeCreateTemplateCoach,
    closeEditTemplateCoach,
    getAllCoachTemplates,
    openCreateTemplateCoach,
    openEditTemplateCoach,
    setSelectedCoachTemplate,
    getCoachTemplateModuleId,
} from '../../../../redux/features/adminModule/coach/coachTemplateSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const CoachTemplate = () => {
    const navigation = useNavigate();
    const dispatch = useDispatch();
    const [coachTemplatesData, setCoachTemplatesData] = useState([]);

    const { coachTemplates } = useSelector(state => state.coachTemplate);

    useEffect(() => {
        dispatch(getAllCoachTemplates());
        dispatch(closeCreateTemplateCoach());
        dispatch(closeEditTemplateCoach());
    }, [dispatch]);

    useEffect(() => {
        if (coachTemplates && coachTemplates.length > 0) {
            const transformData = coachTemplates.map(item => ({
                id: item.id,
                'Template Name': item.name,
                Duration:
                    item.duration == 1 ? '1 Month' : `${item.duration} Months`,
                Activities: item?.modules
                    ?.map(module => module?.module_name)
                    .join(', '),
                'Assigned To': item.student?.length + ' students',
                is_active: item.is_active,
            }));
            setCoachTemplatesData(transformData);
        }
    }, [coachTemplates]);

    const headers = [
        'S. No.',
        'Template Name',
        'Duration',
        'Activities',
        'Assigned To',
        'Action',
    ];

    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: id => {
                dispatch(openEditTemplateCoach());
                dispatch(setSelectedCoachTemplate(id));
                dispatch(getCoachTemplateModuleId(id));
                navigation('/template-name');
            },
        },
    ];

    const handleAddTemplate = () => {
        dispatch(openCreateTemplateCoach());
        navigation('/create-template');
    };

    const handleAssignedToClick = id => {
        navigation(`template-students/${id}`);
    };

    return (
        <>
            <Box m="20px">
                <Header />
                <Sidebar />
                <>
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                    >
                        <p
                            style={{
                                fontSize: '44px',
                                justifyContent: 'center',
                                fontFamily: 'ExtraLight',
                            }}
                        >
                            Coaching Template
                        </p>
                        <div className="inputBtnContainer">
                            <button
                                className="buttonContainer"
                                onClick={handleAddTemplate}
                            >
                                <i className="bi bi-plus-circle"></i>
                                <span>Create New Template</span>
                            </button>
                        </div>
                    </Box>
                    {!coachTemplatesData || coachTemplatesData.length === 0 ? (
                        <div>
                            <p>No Data Available</p>
                        </div>
                    ) : (
                        <CoachTemplateTable
                            headers={headers}
                            initialData={coachTemplatesData}
                            actionButtons={actionButtons}
                            componentName={'COACHTEMPLATE'}
                            onAssignedToClick={handleAssignedToClick}
                        />
                    )}
                </>
            </Box>
        </>
    );
};

export default CoachTemplate;
