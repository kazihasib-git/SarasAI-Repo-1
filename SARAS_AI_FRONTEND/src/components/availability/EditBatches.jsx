import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomTextField from '../CustomFields/CustomTextField';
import ReusableDialog from '../CustomFields/ReusableDialog';
import PopUpTable from '../CommonComponent/PopUpTable';
import { getAssignBatches } from '../../redux/features/adminModule/ta/taSlice';

import { getCoachAssignBatches } from '../../redux/features/adminModule/coach/coachSlice';

import {
    closeEditBatch,
    openScheduleSession,
} from '../../redux/features/adminModule/ta/taScheduling';

import {
    closeCoachEditBatch,
    openCoachScheduleSession,
} from '../../redux/features/adminModule/coach/coachSchedule';
import {
    closeSelectBatches,
    getCoachMenuAssignedBatches,
    openCreateSessionPopup,
} from '../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeTaMenuSelectBatches,
    getTaMenuAssignedBatches,
    openTaMenuCreateSessionsPopup,
} from '../../redux/features/taModule/tamenuSlice';
import { useParams } from 'react-router-dom';
import CustomButton from '../CustomFields/CustomButton';

const EditBatches = ({ componentname }) => {
    console.log('COMPONENT NAME EDITBATCH: ', componentname);
    const { id, name } = useParams();
    const dispatch = useDispatch();

    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let stateModuleKey,
        nameKey,
        assignBatchOpenKey,
        closeDialogAction,
        getAssignBatchesAction,
        editBatchKey,
        selectedBatchKey;

    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'COACHSCHEDULE':
            stateModuleKey = 'coachModule';
            nameKey = 'coach_name';
            assignBatchOpenKey = 'openCoachEditBatch';
            editBatchKey = 'assignedBatches';
            selectedBatchKey = 'batches';
            closeDialogAction = closeCoachEditBatch;
            getAssignBatchesAction = getCoachAssignBatches;
            schedulingState = useSelector(state => state.coachScheduling);
            nameKeyScheduling = 'coachName';
            idKeyScheduling = 'coachID';
            break;

        case 'TASCHEDULE':
            stateModuleKey = 'taModule';
            nameKey = 'ta_name';
            assignBatchOpenKey = 'openEditBatch';
            editBatchKey = 'assignedBatches';
            selectedBatchKey = 'batches';
            closeDialogAction = closeEditBatch;
            getAssignBatchesAction = getAssignBatches;
            schedulingState = useSelector(state => state.taScheduling);
            nameKeyScheduling = 'taName';
            idKeyScheduling = 'taID';
            break;

        case 'COACHMENU_CALENDER':
            stateModuleKey = 'coachMenu';
            nameKey = '';
            assignBatchOpenKey = 'selectBatches';
            editBatchKey = 'assignedCoachBatches';
            selectedBatchKey = 'selectedCoachBatches';
            closeDialogAction = closeSelectBatches;
            getAssignBatchesAction = getCoachMenuAssignedBatches;
            schedulingState = useSelector(state => state.coachMenu);
            nameKeyScheduling = '';
            idKeyScheduling = '';
            break;

        case 'TAMENU_CALENDER':
            stateModuleKey = 'taMenu';
            nameKey = '';
            assignBatchOpenKey = 'selectTaBatches';
            editBatchKey = 'assignedTaBatches';
            selectedBatchKey = 'selectedTaBatches';
            closeDialogAction = closeTaMenuSelectBatches;
            getAssignBatchesAction = getTaMenuAssignedBatches;
            schedulingState = useSelector(state => state.taMenu);
            nameKeyScheduling = '';
            idKeyScheduling = '';
            break;

        default:
            stateModuleKey = null;
            assignBatchOpenKey = null;
            nameKey = null;
            editBatchKey = null;
            selectedBatchKey = null;
            closeDialogAction = null;
            getAssignBatchesAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector(state =>
        stateModuleKey ? state[stateModuleKey] : {}
    );

    const {
        [nameKeyScheduling]: assignedName,
        [idKeyScheduling]: assignedId,
        [assignBatchOpenKey]: assignBatchOpen,
        [selectedBatchKey]: selectedBatches,
    } = schedulingState || {};

    const {
        [nameKey]: assignedTAName,
        taID,
        coachID,
        [editBatchKey]: assignedBatches,
        loading,
    } = stateSelector || {};

    useEffect(() => {
        const userAdminId = assignedId || id;
        if (stateModuleKey && assignBatchOpen) {
            dispatch(getAssignBatchesAction(userAdminId));
        }
    }, [
        dispatch,
        stateModuleKey,
        assignBatchOpen,
        assignedId,
        getAssignBatchesAction,
    ]);

    useEffect(() => {
        if (assignedBatches) {
            console.log('BRANCH NAME : ', assignedBatches);
            const transformedData = assignedBatches.map((batch, index) => ({
                'S. No.': index + 1,
                'Batch Name': batch.batch.name,
                Branch: batch.batch.branch.name,
                id: batch.id,
            }));

            const filtered = transformedData.filter(batch => {
                const matchesBranch = selectedBranch
                    ? batch.Branch === selectedBranch
                    : true;
                const matchesQuery = searchQuery
                    ? batch['Batch Name']
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    : true;
                return matchesBranch && matchesQuery;
            });

            setFilteredBatches(filtered);
        }
    }, [assignedBatches, selectedBranch, searchQuery]);

    const batchOptions = assignedBatches
        ? [...new Set(assignedBatches.map(batch => batch.batch.branch.name))]
        : [];

    useEffect(() => {
        if (selectedBatches) {
            setSelectedBatch(selectedBatches.map(prev => prev.id));
        }
    }, [selectedBatches]);

    const handleSelectBatch = id => {
        setSelectedBatch(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };
    const handleBranchChange = e => {
        const selectedBranchValue = e.target.value;
        setSelectedBranch(selectedBranchValue);

        if (!selectedBranchValue) {
            // If branch is cleared, reset the filtered batches to all batches
            setFilteredBatches(
                assignedBatches.map((batch, index) => ({
                    'S. No.': index + 1,
                    'Batch Name': batch.batch.name,
                    Branch: batch.batch.branch.name,
                    id: batch.id,
                }))
            );
        }
    };

    const handleSubmit = () => {
        const id =
            componentname === 'COACHSCHEDULE'
                ? coachID || assignedId
                : taID || assignedId;
        const data = {
            [componentname === 'COACHSCHEDULE' ? 'Coach_id' : 'ta_id']: id,
            name: assignedName,
            batches: selectedBatch ? selectedBatch.map(id => ({ id })) : [],
        };
        console.log('DATA: ', data);
        dispatch(openScheduleSession(data));
        dispatch(closeDialogAction());
    };

    const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

    const content = (
        <>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 0 }}>
                <Grid item sm={6}>
                    <CustomTextField
                        select
                        label="Branch"
                        value={selectedBranch}
                        onChange={handleBranchChange}
                        onClear={() =>
                            handleBranchChange({ target: { value: '' } })
                        } // Clear functionality
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {batchOptions.map((branch, index) => (
                            <MenuItem key={index} value={branch}>
                                {branch}
                            </MenuItem>
                        ))}
                    </CustomTextField>
                </Grid>
                <Grid item xs={12}>
                    <Divider sx={{ border: '1px solid #C2C2E7' }} />
                </Grid>
                <Grid item xs={12} mb={2}>
                    <CustomTextField
                        label="Search By Batch Name"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </Grid>
            </Grid>
            <PopUpTable
                headers={headers}
                initialData={filteredBatches}
                onRowClick={handleSelectBatch}
                selectedBox={selectedBatch}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectedBatch.length} batch(es) Selected
            </Typography>
        </>
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            style={{
                backgroundColor: '#F56D3B',
                borderColor: '#F56D3B',
                color: '#FFFFFF',
            }}
        >
            Submit
        </CustomButton>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    const assignedTA = assignedTAName || assignedName || name;

    return (
        <ReusableDialog
            open={assignBatchOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Batches to ${assignedTA}`}
            content={content}
            actions={actions}
        />
    );
};

export default EditBatches;
