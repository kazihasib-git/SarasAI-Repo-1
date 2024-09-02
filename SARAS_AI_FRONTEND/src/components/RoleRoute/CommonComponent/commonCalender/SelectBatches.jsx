import { Button, Divider, Grid, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuAssignedBatches } from '../../../../redux/features/taModule/tamenuSlice';
import { getCoachMenuAssignedBatches } from '../../../../redux/features/coachModule/coachmenuprofileSilce';
import {
    closeSelectBatches,
    openEditSession,
    openScheduleNewSession,
} from '../../../../redux/features/commonCalender/commonCalender';
import CustomTextField from '../../../CustomFields/CustomTextField';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import ReusableDialog from '../../../CustomFields/ReusableDialog';
import CustomButton from '../../../CustomFields/CustomButton';

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

const name = String(localStorage.getItem('name') || 'Name');

const SelectBatches = ({ componentName }) => {
    const dispatch = useDispatch();
    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let sliceName, getBatchesApi, batchDataState;

    switch (componentName) {
        case 'TAMENU':
            sliceName = 'taMenu';
            getBatchesApi = getTaMenuAssignedBatches;
            batchDataState = 'assignedTaBatches';
            break;

        case 'COACHMENU':
            sliceName = 'coachMenu';
            getBatchesApi = getCoachMenuAssignedBatches;
            batchDataState = 'assignedCoachBatches';
            break;

        default:
            sliceName = null;
            getBatchesApi = null;
            batchDataState = null;
            break;
    }

    const stateSelector = useSelector(state => state[sliceName]);
    const { batches, editBatches, selectBatchPopup, sessionData } = useSelector(
        state => state.commonCalender
    );

    const { [batchDataState]: batchesData } = stateSelector || {};

    useEffect(() => {
        dispatch(getBatchesApi());
    }, [dispatch]);

    useEffect(() => {
        if (batchesData && batchesData.length > 0) {
            const transformedData = batchesData.map((batch, index) => ({
                'S. No.': index + 1,
                'Batch Name': batch.batch.name,
                Branch: batch.batch.branch.name,
                id: batch.batch.id,
            }));

            const filtered = transformedData.filter(batch => {
                const matchBranch = selectedBranch
                    ? batch.Branch === selectedBranch
                    : true;
                const matchesQuery = searchQuery
                    ? batch['Batch Name']
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    : true;
                return matchBranch && matchesQuery;
            });
            setFilteredBatches(filtered);
        }
    }, [batchesData, selectedBranch, searchQuery]);

    const batchOptions = batchesData
        ? [...new Set(batchesData.map(batch => batch.batch.branch.name))]
        : [];

    useEffect(() => {
        if (batches && batches.length > 0) {
            setSelectedBatch(batches.map(prev => prev.id));
        }
    }, [batches, editBatches]);

    useEffect(() => {
        if(sessionData && sessionData.batch && sessionData.batch.length > 0){
            setSelectedBatch(sessionData.batch.map(prev => prev.id))
        }
    },[sessionData])

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
                    'S. No': index + 1,
                    'Batch Name': batch.batch.name,
                    Branch: batch.batch.branch.name,
                    id: batch.batch.id,
                }))
            );
        }
    };

    const handleSubmit = () => {
        const data = {
            batchId: selectedBatch ? selectedBatch.map(id => ({ id })) : [],
        };
        if(editBatches){
            const updatedSessionData = {
                ...sessionData,
                batch: selectedBatch ? selectedBatch.map(id => ({ id })) : [],
              };
              
              dispatch(openEditSession({ sessionData: updatedSessionData }));
              
        }else {
            dispatch(openScheduleNewSession(data));
        }
        dispatch(closeSelectBatches());
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
                        }
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
                fontFamily: 'Bold',
            }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={selectBatchPopup}
            handleClose={() => dispatch(closeSelectBatches())}
            title={`Assign Batches to '${name}'`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectBatches;
