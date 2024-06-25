import React, { useState, useEffect } from 'react';
import { useGetBatchesQuery } from '../../redux/services/batches/batchesApi'; // Import your API hook
import { Box } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { batchDummyData } from '../../fakeData/batchesData';
import { baseUrl } from '../../utils/baseURL';

const Batches = () => {
    const [input, setInput] = useState('');
    const [batches, setBatches] = useState([]);

    const handleChange = (value) => {
        setInput(value);
    };

    // Flag to use dummy data or API data
    const useDummyData = true;

    
    const { data , error, isLoading } = useGetBatchesQuery();
    
// Just to check api is working or not
    // --- Start --- 

    const fetchData = async () => {
       
        try {
          const response = await fetch(`${baseUrl}/admin/batches`, {
            method: "GET",
            headers: {
              'Content-Type': 'application/json'
            }
          });
  
       
          const result = await response.json();
          console.log("RESULT : ", result)
          
        } catch (error) {
          console.error('Error fetching data:', error);
        
        } finally {
        }
      };

    //  --- END ----
    
    useEffect( () => {
        console.log("DATA : ",data)
        // console.log("Error : ",error)
        // console.log("Is Loading : ",isLoading)
        fetchData()
        const dataToUse = useDummyData ? batchDummyData : data;
        // const dataToUse = batchDummyData
        if (dataToUse) {
            console.log("BATCH DATA : ", dataToUse)
            const transformedData = dataToUse.map(item => ({
                "Sr No.": item.srNo,
                "Batch Name": item.batchName,
                "Branch": item.branch
            }));
            setBatches(transformedData);
        }
    }, [useDummyData, data]);

    // if (isLoading) {
    //     return <div>Loading....</div>;
    // }

    const headers = ["Sr No.", "Batch Name", "Branch"];

    const DynamicTable = ({ headers, initialData }) => {
        console.log("INITIAL DATA : ", initialData)
        const [data, setData] = useState(initialData.map(item => ({ ...item })));
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 10;
        const totalPages = Math.ceil(data.length / itemsPerPage);
        const currentData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

        const handlePageChange = (event, pageNumber) => {
            setCurrentPage(pageNumber);
        };

        return (
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {headers.map((header, index) => (
                                <th key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((item, index) => (
                            <tr key={index}>
                                {headers.map((header, idx) => (
                                    <td key={idx}>{item[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        color="primary"
                        sx={{
                            width: '65vw',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px',
                            '.MuiPaginationItem-root': {
                                backgroundColor: '#fff',
                                border: '1px solid #ddd',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'background-color 0.3s, transform 0.3s',
                                '&:hover': {
                                    backgroundColor: '#DFDFF4',
                                    transform: 'scale(1.1)',
                                },
                                '&.Mui-selected': {
                                    backgroundColor: '#F56D3B',
                                    color: '#fff',
                                },
                                '&.Mui-disabled': {
                                    backgroundColor: '#DFDFF4',
                                    cursor: 'not-allowed',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <Sidebar />
            <Box display={"flex"} justifyContent={"space-between"} marginTop={3} alignItems={"center"}>
                <p style={{ fontSize: "44px", justifyContent: "center" }}>Batches</p>
                <div className='inputBtnContainer'>
                    <div className="inputContainer">
                        <input className="inputField" placeholder="Search Here ..." value={input} onChange={(e) => handleChange(e.target.value)} />
                    </div>
                </div>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={batches}
            />
        </>
    );
};

export default Batches;
