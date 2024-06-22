import { Box, InputBase, Button } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { mockManageAvailable } from "../../fakeData/manageTAs";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useState } from "react";
import { OnOffSwitch } from '../../components/Switch';
import editIcon from '../../assets/editIcon.png';
import AddEditTA from '../../components/adminModule/tas/manageTAs/AddEditTA';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '../../components/CommonComponent/DynamicTable';
import './ManageTa.css';



const headers = ["S. No.", "TA Name", "Username", "Location", "Time Zone", "Action"];






const ManageTA = () => {
    const [input, setInput] = useState("")
    const navigate = useNavigate()
    const [isEdit, setIsEdit] = useState(false);
    const [taData, setTaData] = useState(null);

    const handleEditTaClick = (taId) => {
        setIsEdit(true);
      
        // const data = getTaDataById(taId); 
        // let data = taId
        console.log("TA ID : ", taId)
        // setTaData(data);
        // Open the handleAddTa component (e.g., open a modal)
    };
    const actionButtons = [
        {
            type: 'switch',
        },
        {
            type: 'edit',
            onClick: (id) => { handleEditTaClick(id) }
        }
    ];

    // const handleAddTaClick = () => {
    //     setIsEdit(false);
    //     setTaData(null);
    //     // Open the handleAddTa component (e.g., open a modal)
    //   };

    const handleAddTa = () => {
        navigate('/createta')
    }
    const fetchData = (value) => {
        fetch('https://jsonplaceholder.typicode.com/users').then((response) => response.json()).then(json => {
            // console.log("JSON DATA : ",json)
            const results = json.filter((user) => {
                return value && user && user.name && user.name.toLowerCase().includes(value)
            });
            console.log(results)
        })
    }

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }
    return (
        <>
            <Header />
            <Sidebar />
            <Box display={"flex"} justifyContent={"space-between"} marginTop={3} alignItems={"center"}>
                <p style={{ fontSize: "44px", justifyContent: "center" }}>Manage TA</p>
                <div className='inputBtnContainer'>
                    <div className="inputContainer">
                        <input className="inputField" placeholder="Search Here ..." value={input} onChange={(e) => handleChange(e.target.value)} />
                    </div>
                    <button className="buttonContainer" onClick={handleAddTa}>
                        <i className="bi bi-plus-circle"></i>
                        <span>Create TA</span>
                    </button>
                </div>

            </Box>
            <DynamicTable
                headers={headers}
                initialData={mockManageAvailable}
                actionButtons={actionButtons}
            />
        </>
    );
};

export default ManageTA;