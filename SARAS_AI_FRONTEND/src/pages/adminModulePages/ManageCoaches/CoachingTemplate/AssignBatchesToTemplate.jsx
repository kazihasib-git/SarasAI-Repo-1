import React, { useState, useEffect } from 'react';
import { Button, MenuItem, Typography, Grid, Divider } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    closeAssignBatchesToTemplate,
    assignStudentsToTemplate,
    getBatchMapping,
    getAllCoachTemplates,
    getStudentsWithBatch,
} from '../../../../redux/features/adminModule/coach/coachTemplateSlice';

import CustomTextField from '../../../../components/CustomFields/CustomTextField';
import ReusableDialog from '../../../../components/CustomFields/ReusableDialog';
import CustomButton from '../../../../components/CustomFields/CustomButton';
import PopUpTable from '../../../../components/CommonComponent/PopUpTable';

const AssignBatchesToTemplate = ({ componentname, assignedStudents }) => {
    const dispatch = useDispatch();
    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    let stateModuleKey,
        nameKey,
        assignBatchOpenKey,
        batchMappingKey,
        closeDialogAction,
        openSuccessAction,
        getBatchMappingAction,
        postAssignAction;
    let schedulingState, nameKeyScheduling, idKeyScheduling;

    switch (componentname) {
        case 'CoachTemplate':
            stateModuleKey = 'coachTemplate';
            assignBatchOpenKey = 'assignBatchesToTemplate';
            batchMappingKey = 'batchMapping';
            closeDialogAction = closeAssignBatchesToTemplate;
            //openSuccessAction = openSuccessPopup;
            getBatchMappingAction = getBatchMapping;
            postAssignAction = assignStudentsToTemplate;
            schedulingState = useSelector(state => state.coachTemplate);
            idKeyScheduling = 'templateIdToAssignBatches';
            break;
        default:
            stateModuleKey = null;
            assignBatchOpenKey = null;
            nameKey = null;
            batchMappingKey = null;
            closeDialogAction = null;
            openSuccessAction = null;
            getBatchMappingAction = null;
            postAssignAction = null;
            schedulingState = null;
            nameKeyScheduling = null;
            idKeyScheduling = null;
            break;
    }

    const stateSelector = useSelector(state =>
        stateModuleKey ? state[stateModuleKey] : {}
    );
    const { [idKeyScheduling]: assignedId } = schedulingState || {};

    const {
        [assignBatchOpenKey]: assignBatchOpen,
        [batchMappingKey]: batchMapping,
        loading,
    } = stateSelector || {};

    useEffect(() => {
        if (stateModuleKey && assignBatchOpen) {
            dispatch(getBatchMappingAction());
        }
    }, [assignBatchOpen, dispatch, getBatchMappingAction]);

    useEffect(() => {
        if (assignBatchOpen) {
            const previouslyAssignedStudents = assignedStudents.map(
                student => student.id
            );

            //setSelectedBatch(previouslyAssignedStudents);
        }
    }, [assignedStudents]);

    useEffect(() => {
        if (batchMapping && batchMapping.length > 0) {
            const transformedData = batchMapping.map((batch, index) => ({
                'S. No.': index + 1,
                'Batch Name': batch.name,
                Branch: batch.branch.name,
                Select: batch.is_active ? 0 : 1,
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
        }else {
            setFilteredBatches()
        }
    }, [batchMapping, selectedBranch, searchQuery]);

    const batchOptions = Array.isArray(batchMapping)
        ? [...new Set(batchMapping.map(batch => batch.branch.name))]
        : [];

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
                batchMapping.map((batch, index) => ({
                    'S. No.': index + 1,
                    'Batch Name': batch.name,
                    Branch: batch.branch.name,
                    Select: batch.is_active ? 0 : 1,
                    id: batch.id,
                }))
            );
        }
    };

    const handleSubmit = async () => {
        const selectedStudentIds = await Promise.all(
            selectedBatch.map(async batch => {
                const response = await dispatch(getStudentsWithBatch(batch));
                const res = response.payload;
                return res.map(student => student.student_id);
            })
        );

        const allStudentIds = [...new Set(selectedStudentIds.flat())];

        const data = {
            template_id: assignedId,
            users: allStudentIds.map(id => ({
                assignable_id: id.toString(),
                assignable_type: 'Student',
            })),
        };
        dispatch(postAssignAction(data)).then(() => {
            dispatch(getAllCoachTemplates());
            dispatch(closeDialogAction());
        });
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
                textTransform: 'none' 
            }}
        >
            Submit
        </CustomButton>
    );

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ReusableDialog
            open={assignBatchOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Batches to Template`}
            content={content}
            actions={actions}
        />
    );
};

export default AssignBatchesToTemplate;
