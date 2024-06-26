import { Box, InputBase, Button, Switch, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import { useEffect, useState } from "react";
import { OnOffSwitch } from "../../components/Switch";
import editIcon from "../../assets/editIcon.png";
import AddEditTA from "../../components/adminModule/tas/manageTAs/AddEditTA";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../../components/CommonComponent/DynamicTable";
import "./ManageTa.css";
import { getTA, createTA, updateTA } from "../../redux/features/taModule/taSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactTable, { Table } from "../../components/table/ReactTable";

const headers = ["S. No.", "TA Name", "Username", "Location", "Time Zone", "Action"];

const ManageTA = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tasData, setTaData] = useState();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [addData, setAddData] = useState(false);
  const [editData, setEditData] = useState();

  const { tas, loading, error } = useSelector((state) => state.taModule);

  useEffect(() => {
    dispatch(getTA());
  }, [dispatch]);

  console.log("tasss", tas)

  useEffect(() => {

    if (tas) {
      const transformData = tas.map(item => ({
        id : item.id,
        'TA Name': item.name,
        Username: item.username,
        Location: item.location,
        'TimeZone': item.time_zone,
      }))

      setTaData(transformData);
    }
  }, [tas])

  const handleEditTaClick = (row, taId) => {
    setIsEdit(true);
    //navigate('/createta')
    console.log("row", row)
    console.log("taId", taId)
    const dataToEdit = tas.filter((ta) => ta.id === taId);
    console.log("data to Edit in manage Ta", dataToEdit);
    setEditData(dataToEdit[0]);
    console.log("TA ID : ", taId);
  };

 

  const actionButtons = [
    {
      type: 'switch',
    },
    {
      type: "edit",
      onClick: (id) => {
        handleEditTaClick(id);
      },
    },
  ];

  const handleAddTa = () => {
    //navigate('/createta');
    setAddData(true);
    setEditData()
  };

  const handleActivateTa = () => {
    dispatch(updateTA({ id: data.id, is_Active: true }))
  }

  const handleDeactivateTa = () => {
    dispatch(updateTA({ id: data.id, is_Active: false }))
  }

  const handleChange = (value) => {
    setInput(value);
  };

  const handleSearch = () => {

  }

  console.log("tas dataaaa", tasData);

  return (
    <>
      <Header />
      <Sidebar />
      {!addData && !isEdit && (
        <>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            marginTop={3}
            alignItems={"center"}
          >
            <p style={{ fontSize: "44px", justifyContent: "center" }}>
              Manage TAs
            </p>
            <div className="inputBtnContainer">
              <div className="inputContainer">
                <input
                  className="inputField"
                  placeholder="Search Here ..."
                  value={input}
                  onChange={(e) => handleChange(e.target.value)}
                />
              </div>
              <button className="buttonContainer" onClick={handleAddTa}>
                <i className="bi bi-plus-circle"></i>
                <span>Create TA</span>
              </button>
            </div>
          </Box>
          {!tasData || tasData.length === 0 ? (
            <div>
              <p>No Data Available</p>
            </div>
          ) : (
            <DynamicTable
            headers={headers}
            initialData={tasData}
            actionButtons={actionButtons}
        
          />
          )
          }
           {/*
          <DynamicTable
            headers={headers}
            initialData={tasData}
            actionButtons={actionButtons}
          />
          */}
        </>
      )}

      {addData && <AddEditTA />}
      {isEdit && <AddEditTA data={editData} edit={isEdit} />}

    </>
  );
};

export default ManageTA;
