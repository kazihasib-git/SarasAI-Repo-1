import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomButton from '../CustomFields/CustomButton';
import { Divider, Grid, MenuItem, Typography } from '@mui/material';
import CustomTextField from '../CustomFields/CustomTextField';
import PopUpTable from '../CommonComponent/PopUpTable';
import {
    closeBatchPopup,
    getStudentsInBatches,
} from '../../redux/features/commonCalender/batchesAndStudents';
import { openScheduleSession } from '../../redux/features/adminModule/ta/taScheduling';
import { openCoachScheduleSession } from '../../redux/features/adminModule/coach/coachSchedule';
import { toast } from 'react-toastify';
import { MESSAGE_CONSTANTS } from '../../constants/messageConstants';
import {
    openEditSession,
    openScheduleNewSession,
} from '../../redux/features/commonCalender/commonCalender';

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

const batchesConfig = {
    TASCHEDULE: {
        openSchedulingPopup: openScheduleSession,
    },
    COACHSCHEDULE: {
        openSchedulingPopup: openCoachScheduleSession,
    },
    TAMENU: {
        openSchedulingPopup: openScheduleNewSession,
    },
    COACHMENU: {
        openSchedulingPopup: openScheduleNewSession,
    },
};

const SelectBatches = ({
    id,
    name,
    componentName,
    timezone,
    onClose = () => {},
}) => {
    const dispatch = useDispatch();
    const [selectBatch, setSelectBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    const {
        userId,
        userName,
        openBatches,
        batches,
        selectedBatches,
        timezoneId,
    } = useSelector(state => state.batchesAndStudents);

    const { openSchedulingPopup } = batchesConfig[componentName];

    useEffect(() => {
        if (batches) {
            const transformedData = batches
                .filter(item => item.is_active === 1)
                .map((batch, index) => ({
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
        }
    }, [batches, selectedBranch, searchQuery]);

    const batchOptions = batches
        ? [...new Set(batches.map(batch => batch.batch.branch.name))]
        : [];

    useEffect(() => {
        if (selectedBatches) {
            setSelectBatch(selectedBatches.map(batch => batch)); //.id));
        }
    }, [selectedBatches]);

    const handleSelectBatch = id => {
        setSelectBatch(prev =>
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
                    id: batch.batch.id,
                }))
            );
        }
    };

    const validate = () => {
        if (selectBatch.length === 0) {
            toast.error(MESSAGE_CONSTANTS.SELECT_ATLEAST_ONE_BATCH);
            return false;
        }
        return true;
    };

    const handleSubmit = () => {
        if (!validate()) return;

        const data = {
            batchIds: selectBatch,
        };
        dispatch(getStudentsInBatches(data));

        // dispatch(
        //     openSchedulingPopup({
        //         id: userId,
        //         name: userName,
        //         batches: selectBatch.map(id => ({ id })),
        //         timezoneId: timezone ? timezone.id : timezoneId,
        //     })
        // );

        onClose({
            id: userId,
            name: userName,
            batches: selectBatch.map(id => ({ id })),
            timezoneId: timezone ? timezone.id : timezoneId,
        });

        const res = {
            selectedBatches: selectBatch,
        };
        dispatch(closeBatchPopup(res));
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
                selectedBox={selectBatch}
            />
            <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ mt: 2, textAlign: 'center' }}
            >
                {selectBatch.length} batch(es) Selected
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
            open={openBatches}
            handleClose={() =>
                dispatch(closeBatchPopup({ selectedBatches: selectBatch }))
            }
            title={`Assign Batches to Session`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectBatches;
