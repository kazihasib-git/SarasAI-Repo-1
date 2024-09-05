import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReusableDialog from '../CustomFields/ReusableDialog';
import CustomButton from '../CustomFields/CustomButton';
import { Divider, Grid, MenuItem } from '@mui/material';
import CustomTextField from '../CustomFields/CustomTextField';
import PopUpTable from '../CommonComponent/PopUpTable';
import { getStudentsInBatches } from '../../redux/features/commonCalender/batchesAndStudents';

const headers = ['S. No.', 'Batch Name', 'Branch', 'Select'];

const SelectBatches = ({ componentName }) => {
    const dispatch = useDispatch();
    const [selectedBatch, setSelectedBatch] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [filteredBatches, setFilteredBatches] = useState([]);

    const { name, id, batches, selectedBatches, students, selectedStudents } =
        useSelector(state => state.batchesAndStudentsReducer);

    switch (componentName) {
        case '':
            break;

        case '':
            break;

        default:
            break;
    }

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
            setSelectedBatch(selectedBatches.map(batch => batch.id));
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
                    id: batch.batch.id,
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

        const batchIds = selectedBatch;
        dispatch(getStudentsInBatches(batchIds));

        dispatch(
            openSchedulingPopup({
                id,
                name: name,
                batches: selectedBatch.map(id => ({ id })),
                timezone: timezoneId,
            })
        );
        dispatch(closeDialogAction());
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
            open={assignBatchOpen}
            handleClose={() => dispatch(closeDialogAction())}
            title={`Assign Batches to Session`}
            content={content}
            actions={actions}
        />
    );
};

export default SelectBatches;
