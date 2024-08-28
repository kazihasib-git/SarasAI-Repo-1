import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getAssignBatches } from '../../redux/features/adminModule/ta/taSlice';
import {
    closeTaEditScheduledBatches,
    editTASchdeuledBatches,
    getTAScheduledBatches,
} from '../../redux/features/adminModule/ta/taAvialability';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomButton from '../CustomFields/CustomButton';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import PopUpTable from '../CommonComponent/PopUpTable';
import CustomTextField from '../CustomFields/CustomTextField';
import {
    closeCoachEditScheduledBatches,
    editCoachScheduledBatches,
    getCoachScheduledBatches,
} from '../../redux/features/adminModule/coach/CoachAvailabilitySlice';
import { getCoachAssignBatches } from '../../redux/features/adminModule/coach/coachSlice';
import { toast } from 'react-toastify';

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

const EditBatchesFromSession = ({ componentName }) => {
    const dispatch = useDispatch();
    const { id, name } = useParams();

    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let sliceName,
        availabilitySliceName,
        openPopState,
        closePopupActions,
        scheduledBatchesApi,
        scheduledBatchesState,
        editScheduledBatchesApi,
        assignedBatchesApi,
        assignedBatchesState,
        meetingIdState;

    switch (componentName) {
        case 'TACALENDER':
            sliceName = 'taModule';
            availabilitySliceName = 'taAvialability';
            openPopState = 'taEditScheduledBatches';
            closePopupActions = closeTaEditScheduledBatches;
            scheduledBatchesApi = getTAScheduledBatches;
            scheduledBatchesState = 'taScheduledBatches';
            editScheduledBatchesApi = editTASchdeuledBatches;

            assignedBatchesApi = getAssignBatches;
            assignedBatchesState = 'assignedBatches';
            meetingIdState = 'meetingId';
            break;

        case 'COACHCALENDER':
            sliceName = 'coachModule';
            availabilitySliceName = 'coachAvailability';
            openPopState = 'coachEditScheduledBatches';
            closePopupActions = closeCoachEditScheduledBatches;
            scheduledBatchesApi = getCoachScheduledBatches;
            scheduledBatchesState = 'coachScheduledBatches';
            editScheduledBatchesApi = editCoachScheduledBatches;
            assignedBatchesApi = getCoachAssignBatches;
            assignedBatchesState = 'assignedBatches';
            meetingIdState = 'meetingId';
            break;

        default:
            sliceName = null;
            assignedBatchesApi = null;
            closePopupActions = null;
            sliceName = null;
            availabilitySliceName = null;
            scheduledBatchesApi = null;
            scheduledBatchesState = null;
            editScheduledBatchesApi = null;
            assignedBatchesApi = null;
            assignedBatchesState = null;
            meetingIdState = null;
            break;
    }

    const stateSelector = useSelector(state => state[sliceName]);
    const availabilityStateSelector = useSelector(
        state => state[availabilitySliceName]
    );

    const { [assignedBatchesState]: assignedBatches } = stateSelector;

    const {
        [scheduledBatchesState]: schdeuledBatches,
        [openPopState]: open,
        [meetingIdState]: meetingId,
    } = availabilityStateSelector;

    useEffect(() => {
        dispatch(assignedBatchesApi(id)).then(() => {
            dispatch(scheduledBatchesApi(meetingId));
        });
    }, [dispatch]);

    useEffect(() => {
        if (assignedBatches && assignedBatches.length > 0) {
            const transformedData = assignedBatches.map((batch, index) => ({
                'S. No.': index + 1,
                'Batch Name': batch.batch.name,
                Branch: batch.batch.branch.name,
                id: batch.batch.id,
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
        } else {
            setFilteredBatches();
        }
    }, [assignedBatches, selectedBranch, searchQuery]);

    const batchOptions = assignedBatches
        ? [...new Set(assignedBatches.map(batch => batch.batch.branch.name))]
        : [];

    useEffect(() => {
        if (schdeuledBatches) {
            setSelectedBatch(schdeuledBatches.map(batch => batch.batch_id));
        }
    }, [schdeuledBatches]);

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

    const validate = () => {
        if(selectedBatch.length === 0){
            toast.error('Please Select at Least One Batch')
            return false;
        }
        return true;
    }

    const handleSubmit = () => {

        if (!validate()) return;

        const Id = meetingId;
        const data = {
            admin_user_id: Number(id),
            batchId: selectedBatch.map(id => id),
        };
        dispatch(editScheduledBatchesApi({ Id, data })).then(() => {
            dispatch(closePopupActions());
        });
    };

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
                textTransform: 'none',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={open}
            handleClose={() => dispatch(closePopupActions())}
            title={`Assign Batches to the Session`}
            content={content}
            actions={actions}
        />
    );
};

export default EditBatchesFromSession;
