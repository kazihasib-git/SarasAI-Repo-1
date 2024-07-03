import React, { useState, useEffect } from "react";
import { useGetBatchesQuery } from "../../redux/services/batches/batchesApi"; // Import your API hook
import { Box } from "@mui/material";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import { batchDummyData } from "../../fakeData/batchesData";

import DynamicTable from "../CommonComponent/DynamicTable";

const Batches = () => {
  const [input, setInput] = useState("");
  const [batches, setBatches] = useState([]);

  const handleChange = (value) => {
    setInput(value);
  };

  // Flag to use dummy data or API data
  const useDummyData = true;

  const { data, error, isLoading } = useGetBatchesQuery();

  useEffect(() => {
    console.log("DATA : ", data);
    const dataToUse = useDummyData ? batchDummyData : data;
    // const dataToUse = batchDummyData
    if (dataToUse) {
      console.log("BATCH DATA : ", dataToUse);
      const transformedData = dataToUse.map((item) => ({
        id: item.srNo,
        "Batch Name": item.name,
        Branch: item.branch,
   
      }));
      setBatches(transformedData);
    }
  }, [useDummyData, data]);

  // if (isLoading) {
  //     return <div>Loading....</div>;
  // }

  const headers = ["Sr No.", "Batch Name", "Branch"];

  return (
    <>
      <Header />
      <Sidebar />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        marginTop={3}
        alignItems={"center"}
      >
        <p style={{ fontSize: "44px", justifyContent: "center" }}>Batches</p>
        <div className="inputBtnContainer">
          <div className="inputContainer">
            <input
              className="inputField"
              placeholder="Search Here ..."
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
          </div>
        </div>
      </Box>
      <DynamicTable
        headers={headers}
        initialData={batches}
        // actionButtons={[]}
        componentName={"BATCHES"}
      />
    </>
  );
};

export default Batches;
