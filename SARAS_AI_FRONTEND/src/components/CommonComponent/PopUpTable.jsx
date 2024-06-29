import React, { useEffect, useState } from "react";
import { IconButton, Checkbox } from "@mui/material";
import "./popUpTable.css";
import { useNavigate } from "react-router-dom";
import editIcon from "../../assets/editIcon.png";
import bin from "../../assets/bin.png";

const PopUpTable = ({
  headers,
  initialData,
  actionButtons,
  onRowClick,
  selectedStudents,
}) => {
  const [data, setData] = useState(initialData ?? []);

  useEffect(() => {
    setData(initialData ?? []);
  }, [initialData]);

  const handleCheckboxChange = (id) => {
    onRowClick(id);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="table-container popUpModel">
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="popUpBody">
          {currentData.map((item, index) => (
            <tr key={item["S. No."] ?? index} id="popUpRow">
              {headers.map((header, idx) => (
                <td key={idx}>
                  {header === "Select" ? (
                    <Checkbox
                      checked={selectedStudents.includes(item["S. No."])}
                      onChange={() => handleCheckboxChange(item["S. No."])}
                      sx={{
                        "& .MuiSvgIcon-root": {
                          color: "#C2C2E7", // Color for the tick
                        },
                      }}
                      inputProps={{ "aria-label": "select all" }}
                    />
                  ) : (
                    item[header]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default PopUpTable;
