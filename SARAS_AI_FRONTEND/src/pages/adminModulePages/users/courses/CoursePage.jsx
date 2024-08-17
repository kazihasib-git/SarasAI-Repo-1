import React, {useEffect, useState} from 'react';
import { Box } from '@mui/material';
import Header from '../../../../components/Header/Header';
import Sidebar from '../../../../components/Sidebar/Sidebar';
import { useGetCoursesQuery } from '../../../../redux/services/courses/coursesApi';
import { DynamicTable } from '../../../managesTAs/TaAvaialablity';

const CoursePage = () => {
    const [input, setInput] = useState('');
    const [courses, setCourses] = useState([]);

    const handleChange = value => {
        setInput(value);
    };

    const { data, error, isLoading } = useGetCoursesQuery();

    useEffect(() => {
        if (data && data.length > 0) {
            console.log('DATA course: ', data);
            const transformedData = data?.map(item => ({
                id: item.id,
                "Course Name": item.name,
                is_active: item.is_active,
                "Description": item.description,
                "start_date": item.start_date,
                "end_date": item.end_date,
            }));
            setCourses(transformedData);
        }
    }, [data]);

    const headers = ['S No.', 'Batch Name', "Description", "Start Date", "End Date"];

    // Filter batches based on the search input
    const filteredCourses = courses.filter(course =>
        course['Course Name'].toLowerCase().includes(input.toLowerCase())
    );


    return(
        <>
        <Header/>
        <Sidebar/>
        <Box
                display={'flex'}
                justifyContent={'space-between'}
                marginTop={3}
                alignItems={'center'}
            >
                <p style={{ fontSize: '44px', justifyContent: 'center' }}>
                    Courses
                </p>
                <div className="inputBtnContainer">
                    <div className="inputContainer">
                        <input
                            className="inputField"
                            placeholder="Search Here ..."
                            value={input}
                            onChange={e => handleChange(e.target.value)}
                        />
                    </div>
                </div>
            </Box>
            <DynamicTable
                headers={headers}
                initialData={filteredCourses}
                componentName={'BATCHES'}
            />
        </>
    )
};

export default CoursePage;
