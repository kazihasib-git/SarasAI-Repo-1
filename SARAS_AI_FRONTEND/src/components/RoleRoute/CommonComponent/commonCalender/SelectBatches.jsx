import { Button, Divider, Grid, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTaMenuAssignedBatches } from '../../../../redux/features/teachingAssistant/tamenuSlice';
import { getCoachMenuAssignedBatches } from '../../../../redux/features/coach/coachmenuprofileSilce';
import {
    closeSelectBatches,
    openScheduleNewSession,
} from '../../../../redux/features/commonCalender/commonCalender';
import CustomTextField from '../../../CustomFields/CustomTextField';
import PopUpTable from '../../../CommonComponent/PopUpTable';
import ReusableDialog from '../../../CustomFields/ReusableDialog';

const CustomButton = ({
    onClick,
    children,
    color = '#FFFFFF',
    backgroundColor = '#4E18A5',
    borderColor = '#FFFFFF',
    sx,
    ...props
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            sx={{
                backgroundColor: backgroundColor,
                color: color,
                fontWeight: '700',
                fontSize: '16px',
                borderRadius: '50px',
                padding: '10px 20px',
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

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
    const { batches, selectBatchPopup } = useSelector(
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
                id: batch.id,
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
        if (batches) {
            setSelectedBatch(batches.map(prev => prev.id));
        }
    }, [batches]);

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
                    id: batch.id,
                }))
            );
        }
    };

    const handleSubmit = () => {
        const data = {
            batches: selectedBatch ? selectedBatch.map(id => ({ id })) : [],
        };

        dispatch(openScheduleNewSession(data));
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

    return (
        <ReusableDialog
            open={selectBatchPopup}
            handleClose={() => dispatch(closeSelectBatches())}
            title={`Assign Batches`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectBatches;
