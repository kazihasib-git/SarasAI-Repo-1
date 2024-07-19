import React, { useState } from "react";
import ReusableDialog from "../../../../components/CustomFields/ReusableDialog";
import { Button, Grid } from "@mui/material";
import CustomTextField from "../../../../components/CustomFields/CustomTextField";
import { closeTemplateModulePopup, createCoachTemplateModule } from "../../../../redux/features/CoachModule/CoachTemplateSlice";
import { useDispatch, useSelector } from "react-redux";

const CustomButton = ({
  onClick,
  children,
  color = "#FFFFFF",
  backgroundColor = "#4E18A5",
  borderColor = "#FFFFFF",
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
        fontWeight: "700",
        fontSize: "16px",
        borderRadius: "50px",
        padding: "10px 20px",
        border: `2px solid ${borderColor}`,
        "&:hover": {
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

const AddModule = ({ selectedTemplateId }) => {
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");
  const { openModulePopUp } = useSelector((state) => state.coachTemplate);

  const content = (
    <Grid
      container
      sx={{
        pt: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Grid item xs={12} sm={6}>
        <CustomTextField
          label="Module Name"
          variant="outlined"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
          placeholder="Enter Module Name"
          name="moduleName"
        />
      </Grid>
    </Grid>
  );

  const handleSubmit = () => {
    if (moduleName) {
      const data = {
        template_id: selectedTemplateId,
        module_name: moduleName,
        is_active: true,
        updated_by: 1,
      };
      dispatch(createCoachTemplateModule(data));
      dispatch(closeTemplateModulePopup());
      setModuleName(""); // Reset the input field
    }
  };

  const actions = (
    <CustomButton
      onClick={handleSubmit}
      backgroundColor="#F56D3B"
      borderColor="#F56D3B"
      color="#FFFFFF"
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
