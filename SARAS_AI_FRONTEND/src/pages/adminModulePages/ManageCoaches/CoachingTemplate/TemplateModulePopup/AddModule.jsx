import React, { useState } from 'react';
import ReusableDialog from '../../../../../components/CustomFields/ReusableDialog';
import { Button, Grid } from '@mui/material';
import CustomTextField from '../../../../../components/CustomFields/CustomTextField';
import {
    closeTemplateModulePopup,
    createCoachTemplateModule,
    getAllCoachTemplateModules,
    getCoachTemplateModuleId,
} from '../../../../../redux/features/adminModule/coach/coachTemplateSlice';
import { useDispatch, useSelector } from 'react-redux';

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
const AddModule = () => {
    const dispatch = useDispatch();
    const [moduleName, setModuleName] = useState('');

    const [moduleNameError, setModuleNameError] = useState(false);

    const handleModuleNameChange = e => {
        setModuleName(e.target.value);
        if (e.target.value.trim() === '') {
            setModuleNameError(true);
        } else {
            setModuleNameError(false);
        }
    };
    const { openModulePopUp, selectedCoachTemplate } = useSelector(
        state => state.coachTemplate
    );

    const content = (
        <Grid
            container
            sx={{
                pt: 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            <Grid item xs={12} sm={6}>
                <CustomTextField
                    label="Module Name"
                    variant="outlined"
                    value={moduleName}
                    onChange={handleModuleNameChange}
                    placeholder="Enter Module Name"
                    name="moduleName"
                    error={moduleNameError}
                    helperText={
                        moduleNameError ? 'Module Name is required' : ''
                    }
                />
            </Grid>
        </Grid>
    );

    const handleSubmit = () => {
        if (!moduleName.trim()) {
            setModuleNameError(true);
            return;
        }

        const data = {
            template_id: selectedCoachTemplate,
            module_name: moduleName,
            is_active: true,
            created_by: 1,
            updated_by: 1,
        };

        dispatch(createCoachTemplateModule(data))
            .unwrap()
            .then(() => {
                dispatch(getCoachTemplateModuleId(selectedCoachTemplate));
            });

        dispatch(closeTemplateModulePopup());
        setModuleName(''); // Reset the input field
        setModuleNameError(false); // Reset error state after successful submission
    };

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor="#F56D3B"
            borderColor="#F56D3B"
            color="#FFFFFF"
            style={{ textTransform: 'none' }}
        >
            Submit
        </CustomButton>
    );

    return (
        <ReusableDialog
            open={openModulePopUp}
            handleClose={() => dispatch(closeTemplateModulePopup())}
            title="Add Module"
            content={content}
            actions={actions}
        />
    );
};

export default AddModule;
