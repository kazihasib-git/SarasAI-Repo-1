import React, { useState } from 'react';
import { Button } from '@mui/material';
import ReusableDialog from '../CustomFields/ReusableDialog';
import DynamicTable from '../CommonComponent/DynamicTable';
import { useDispatch, useSelector } from 'react-redux';
import { closeScheduledSlots, openScheduledSession } from '../../redux/features/taModule/taScheduling';
import PopUpTable from '../CommonComponent/PopUpTable';

const CustomButton = ({ onClick, children, color = '#FFFFFF', backgroundColor = '#4E18A5', borderColor = '#FFFFFF', sx, ...props }) => {
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
                padding: "10px 20px",
                border: `2px solid ${borderColor}`,
                '&:hover': {
                    backgroundColor: color,
                    color: backgroundColor,
                    borderColor: color,
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </Button>
    );
};

const headers = ['S.No', 'Date', 'Slot Time', 'Select All'];

const Slots = () => {
    const dispatch  = useDispatch()
    const { scheduledSlotsOpen } = useSelector((state) => state.taScheduling);
    const [open, setOpen] = useState(false);
    const [selectAll, setSelectAll] = useState();
    const [data, setData] = useState([
        { id: 1, date: '2023-06-25', slotTime: '10:00 AM - 11:00 AM', isSelected: false },
        { id: 2, date: '2023-06-26', slotTime: '11:00 AM - 12:00 PM', isSelected: false },
        // Add more data as needed
    ]);

    const handleSelectAll = () => {
        const newSelectAll = !selectAll;
        setSelectAll(newSelectAll);
        setData(prevData =>
            prevData.map(item => ({
                ...item,
                isSelected: newSelectAll,
            }))
        );
    };

    const handleSelect = (id) => {
        setData(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, isSelected: !item.isSelected } : item
            )
        );
    };

    const handleSubmit = () => {
        // Handle submit logic here
        console.log("Submitting selected slots:", data.filter(item => item.isSelected));
        dispatch(closeScheduledSlots());
        dispatch(openScheduledSession());
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const actionButtons = [
        {
          type: "checkbox",
        //   onClick: (id) => {
        //     handleEditTaClick(id);
        //   },
        },
      ];

    const table = (
        <PopUpTable
            headers={headers}
            initialData={data}
            actionButtons={actionButtons}
        />
    );

    const actions = (
        <CustomButton
            onClick={handleSubmit}
            backgroundColor='#F56D3B'
            borderColor='#F56D3B'
            color='#FFFFFF'
        >
            Submit
        </CustomButton>
    );

    return (
        <>
            <ReusableDialog
                open={scheduledSlotsOpen}
                handleClose={() => dispatch(closeScheduledSlots())}
                title="Slots"
                content={table}
                actions={actions}
            />
        </>
    );
};

export default Slots;
