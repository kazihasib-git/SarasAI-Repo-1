import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getTaMenuAssignedBatches,
    getSelectedTaMenuAssignedBatches,
    getTaMenuAssignedStudents,
    getTaMenuSessions,
    updateBatchesInTaSession,
} from '../../../../redux/features/taModule/tamenuSlice';
import {
    getCoachMenuAssignedBatches,
    getSelectedCoachMenuAssignedBatches,
    getCoachMenuAssignedStudents,
    getCoachMenuSessions,
    updateBatchesInCoachSession,
} from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeEditBatches,
    closeEditStudents,
} from '../../../../redux/features/commonCalender/commonCalender';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import CustomTextField from '../../../CustomFields/CustomTextField';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import { toast } from 'react-toastify';
import CustomButton from '../../../CustomFields/CustomButton';

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

const editBatchesConfig = {
    TAMENU: {
        sliceName: 'taMenu',
        getBatchesApi: getTaMenuAssignedBatches,
        batchesDataState: 'assignedTaBatches',
        getSelectedBatchesApi: getSelectedTaMenuAssignedBatches,
        assignedBatchesState: 'taScheduleBatches',
        updateBatchesApi: updateBatchesInTaSession,
        getSessionApi: getTaMenuSessions,
    },
    COACHMENU: {
        sliceName: 'coachMenu',
        getBatchesApi: getCoachMenuAssignedBatches,
        batchesDataState: 'assignedCoachBatches',
        getSelectedBatchesApi: getSelectedCoachMenuAssignedBatches,
        assignedBatchesState: 'coachScheduleBatches',
        updateBatchesApi: updateBatchesInCoachSession,
        getSessionApi: getCoachMenuSessions,
    },
};

const EditBatchesSessionLink = ({ componentName, timezone }) => {
    const dispatch = useDispatch();

    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    const {
        sliceName,
        getBatchesApi,
        batchesDataState,
        getSelectedBatchesApi,
        assignedBatchesState,
        updateBatchesApi,
        getSessionApi,
    } = editBatchesConfig[componentName];

    const stateSelector = useSelector(state => state[sliceName]);

    const {
        [batchesDataState]: batchesData,
        [assignedBatchesState]: sessionBatches,
    } = stateSelector;

    const { meetingId, sessionEventData, openEditBatchesPopup } = useSelector(
        state => state.commonCalender
    );

    useEffect(() => {
        dispatch(getBatchesApi()).then(() => {
            console.log(componentName, 'sssssdwcwcwc');
            dispatch(getSelectedBatchesApi(sessionEventData.id));
        });
    }, [dispatch]);

    useEffect(() => {
        if (batchesData && batchesData.length) {
            const transformedData = batchesData.map((batch, index) => ({
                'S. No': index + 1,
                'Batch Name': batch.batch.name,
                Branch: batch.batch.branch.name,
                id: batch.batch.id,
            }));

            const filtered = transformedData.filter(batch => {
                const matchesBranch = selectedBranch
                    ? (batch.Branch = selectedBranch)
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
    }, [batchesData, selectedBatch, searchQuery]);

    const batchOptions =
        batchesData && batchesData.length > 0
            ? [...new Set(batchesData.map(batch => batch.batch.branch.name))]
            : [];

    useEffect(() => {
        if (sessionBatches) {
            setSelectedBatch(sessionBatches.map(batch => batch.batch_id));
        }
    }, [sessionBatches]);

    const handleSelectBatch = id => {
        setSelectedBatch(prev =>
            prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
        );
    };

    const handleBranchChange = e => {
        const selectedBranchValue = e.target.value;
        setSelectedBranch(selectedBranchValue);

        if (!selectedBranchValue) {
            setFilteredBatches(
                batchesData.map((batch, index) => ({
                    'S. No.': index + 1,
                    'Batch Name': batch.batch.name,
                    Branch: batch.batch.branch.name,
                    id: batch.id,
                }))
            );
        }
    };

    const validate = () => {
        if (selectedBatch.length === 0) {
            toast.error('Please Select at Least One Batch');
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const id = sessionEventData.id;
        const data = {
            batchId: selectedBatch.map(id => id),
        };
        dispatch(updateBatchesApi({ id, data }))
            .unwrap()
            .then(() => {
                dispatch(closeEditBatches());
                toast.success('Batches Updated Successfully');
                // dispatch(getSessionApi())
            })
            .catch(error => {
                toast.error(`${error}`);
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
            open={openEditBatchesPopup}
            handleClose={() => dispatch(closeEditBatches())}
            title={`Assign Batches to Session`}
            content={content}
            actions={actions}
        />
    );
};

export default EditBatchesSessionLink;
