import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header/Header';
import Sidebar from '../../../components/Sidebar/Sidebar';
import { Box } from '@mui/material';
import AddModule from './TemplateModulePopup/AddModule';
import { useDispatch, useSelector } from 'react-redux';
import {
    createCoachTemplateModule,
    openEditModulePopup,
    openTemplateActivityPopup,
    openTemplateModulePopup,
    removeSelectedModule,
    setSelectedCoachTemplate,
    setSelectedModule,
    openEditActivityPopup,
} from '../../../redux/features/adminModule/coach/coachTemplateSlice';
import TemplateModuleTable from './TemplateTable/TemplateModuleTable';
import './TemplateName.css';
import AddActivity from './TemplateModulePopup/AddActivity';
import EditModule from './TemplateModulePopup/EditModule';
import LinkActivityPopup from './TemplateModulePopup/LinkActivity'; // Import the new component
import PrerequisitesPopup from './TemplateModulePopup/Prerequisites';
import { useLocation } from 'react-router-dom';
import AddEditActivity from './TemplateModulePopup/EditActivity';
import ViewActivityPopup from './TemplateModulePopup/ViewActivity';

const TemplateName = () => {
    const {
        openModulePopUp,
        openActivityPopUp,
        template_name,
        selectedCoachTemplate,
        coachTemplates,
        coachTemplatesId,
    } = useSelector(state => state.coachTemplate);
    const templateDumyName = 'No Template Name';
    const [linkActivityPopupOpen, setLinkActivityPopupOpen] = useState(false); // State for controlling popup
    const [prerequisitesPopupOpen, setPrerequisitesPopupOpen] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    // newly created name
    const { newTemplateData } = location.state || {};

    useEffect(() => {
        dispatch(removeSelectedModule());
    }, [dispatch]);

    const handleModule = () => {
        dispatch(openTemplateModulePopup());
    };

    const handleActivity = () => {
        dispatch(openTemplateActivityPopup());
    };

    const handleEditModule = () => {
        dispatch(openEditModulePopup());
    };

    const handleAddModule = moduleData => {
        dispatch(
            createCoachTemplateModule({
                ...moduleData,
                template_id: selectedCoachTemplate,
            })
        );
    };

    const openLinkActivityPopup = () => {
        setLinkActivityPopupOpen(true);
    };

    const closeLinkActivityPopup = () => {
        setLinkActivityPopupOpen(false);
    };

    const openPrerequisitesPopup = () => {
        setPrerequisitesPopupOpen(true);
    };

    const closePrerequisitesPopup = () => {
        setPrerequisitesPopupOpen(false);
    };

    const headers = [
        'S. No.',
        'Activity Name',
        'Due Date',
        'Activity',
        'Points',
        'Prerequisites',
        'After Due Date',
        'Actions',
    ];

    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: id => {
                console.log('CLICKED : ', id);
            },
        },
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                marginTop={3}
                alignItems={'center'}
            >
                <p
                    style={{
                        fontSize: '44px',
                        justifyContent: 'center',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    {newTemplateData?.name ||
                        template_name ||
                        coachTemplatesId[0]?.name}
                </p>
                <div className="inputBtnContainer">
                    <button className="buttonContainer" onClick={handleModule}>
                        <i className="bi bi-plus-circle"></i>
                        <span>Add Module</span>
                    </button>
                </div>
            </Box>
            {!coachTemplatesId || coachTemplatesId.length === 0 ? (
                <div>
                    <p>No Data Available</p>
                </div>
            ) : (
                <>
                    {/* {modulesData && modulesData.map((module)=>( */}
                    <>
                        <Box
                            display={'flex'}
                            justifyContent={'space-between'}
                            marginTop={3}
                            alignItems={'center'}
                        ></Box>

                        <TemplateModuleTable modulesData={coachTemplatesId} />
                    </>
                </>
            )}

            {openModulePopUp && <AddModule />}
            {openActivityPopUp && <AddActivity />}
            {openEditModulePopup && <EditModule />}
            {openEditActivityPopup && <AddEditActivity />}
            <LinkActivityPopup
                open={linkActivityPopupOpen}
                handleClose={closeLinkActivityPopup}
            />
            <PrerequisitesPopup
                open={prerequisitesPopupOpen}
                handleClose={closePrerequisitesPopup}
            />
        </>
    );
};

export default TemplateName;
