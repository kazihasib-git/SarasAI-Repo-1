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
import { getTA, createTA, updateTA, openCreateTa, openEditTa, closeCreateTa } from "../../redux/features/taModule/taSlice";
import { useDispatch, useSelector } from "react-redux";
import ReactTable, { Table } from "../../components/table/ReactTable";

const headers = ["S. No.", "TA Name", "Username", "Location", "Time Zone", "Action"];

const ManageTA = () => {
  const dispatch = useDispatch();
  const { tas, loading, error, createTAOpen, editTAOpen } = useSelector((state) => state.taModule);
  const [tasData, setTasData] = useState([]);
  const [searchQuery, setSearchQuery] = useState();

  useEffect(() => {
    dispatch(closeCreateTa());
    dispatch(getTA());
  }, [dispatch]);

  useEffect(() => {
    if (tas.length > 0) {
      console.log("ta data inside useEffect ---- >", tas);
      const transformData = tas.map(item => ({
        id : item.id,
        'TA Name': item.name,
        Username: item.username,
        Location: item.location,
        'TimeZone': item.time_zone,
      }));

      setTasData(transformData);
    }
  }, [tas]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;


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
        handleEditTa(id);
      },
    },
  ];

  const handleAddTa = () => {
    dispatch(openCreateTa());
  };

  const handleEditTa = (id) => {
    dispatch(openEditTa());
  }

  const handleActivateTa = () => {
    dispatch(updateTA({ id: data.id, is_Active: true }))
  }

  const handleDeactivateTa = () => {
    dispatch(updateTA({ id: data.id, is_Active: false }))
  }

  const handleChange = (value) => {
    setSearchQuery(value);
  };

  const handleSearch = () => {

  }

  return (
    <>
      <Header />
      <Sidebar />
      {!createTAOpen && !editTAOpen && (
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
                  value={searchQuery}
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

      {createTAOpen && <AddEditTA />}
      {editTAOpen && <AddEditTA data={editData} edit={isEdit} />}
      

    </>
  );
};

export default ManageTA;
