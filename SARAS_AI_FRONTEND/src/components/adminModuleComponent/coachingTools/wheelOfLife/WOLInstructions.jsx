import {
    Box,
    Button,
    Container,
    Typography,
    Paper,
    styled,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Header from '../../../Header/Header';
import Sidebar from '../../../Sidebar/Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import editIcon_White from '../../../../assets/editIcon_White.png';
import {
    getLifeInstruction,
    editLifeInstruction,
} from '../../../../redux/features/adminModule/coachingTools/wol/wolSlice';

const CustomButton = styled(Button)(({ theme, active }) => ({
    borderRadius: '50px',
    border: '1px solid #F56D3B',
    color: active ? '#fff' : '#F56D3B',
    backgroundColor: active ? '#F56D3B' : '#FFF',
    padding: '8px 16px',
    margin: '0 8px',
    '&:hover': {
        backgroundColor: '#F56D3B',
        color: '#fff',
        borderColor: '#F56D3B',
    },
}));

const WOLInstructions = () => {
    const [value, setValue] = useState('');
    const [editData, setEditData] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { instructionData } = useSelector(state => state.wol);
    const [instruction, setInstruction] = useState([]);

    const handleEditWOLInstructions = () => {
        setValue(instructionData[0].message); // Join the points into a single string
        setEditData(true);
    };

    const handleUpdateWOLInstructions = () => {
        try {
            dispatch(editLifeInstruction({ message: value }))
                .unwrap()
                .then(() => {
                    dispatch(getLifeInstruction());
                });
            setEditData(false);
        } catch (error) {
            console.error(error.message); // TODO: Show toast message
        }
    };

    useEffect(() => {
        dispatch(getLifeInstruction());
    }, [dispatch]);

    useEffect(() => {
        if (instructionData && instructionData.length > 0) {
            // Extract points from HTML message
            const points = extractPoints(instructionData[0].message);
            setInstruction(instructionData[0].message); // Update state with the array of points
        } else {
            setInstruction();
        }
    }, [instructionData]);

    function extractPoints(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        return textContent
            .split(/(?=\d+\.\s)/)
            .filter(point => point.trim() !== '');
    }

    const modules = {
        toolbar: [
            [{ header: '1' }, { header: '2' }, { font: [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
                { list: 'ordered' },
                { list: 'bullet' },
                { indent: '-1' },
                { indent: '+1' },
            ],
            ['link'],
            ['clean'],
            [{ undo: 'undo' }, { redo: 'redo' }],
        ],
        history: {
            delay: 2000,
            maxStack: 500,
            userOnly: true,
        },
    };

    const formats = [
        'header',
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'list',
        'bullet',
        'indent',
        'link',
        'image',
        'video',
    ];

    return (
        <>
            <Header />
            <Sidebar />
            <Box
                display="flex"
                justifyContent="space-between"
                marginTop={3}
                alignItems="center"
            >
                <Box display="flex" alignItems="center" padding="16px">
                    <ArrowBackIosIcon
                        style={{
                            fontSize: '25px',
                            marginBottom: '16px',
                            marginRight: '10px',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(-1)}
                    />
                    <p
                        style={{
                            fontSize: '40px',
                            fontWeight: 200,
                            justifyContent: 'center',
                            fontFamily: 'ExtraLight',
                        }}
                    >
                        {editData
                            ? 'Edit Instructions'
                            : 'Wheel of Life Instructions'}
                    </p>
                </Box>
                {!editData && (
                    <div
                        className="inputBtnContainer"
                        style={{ marginRight: '20px', paddingBottom: '16px' }}
                    >
                        <button
                            className="buttonContainer"
                            onClick={handleEditWOLInstructions}
                            style={{ fontFamily: 'Bold' }}
                        >
                            <img src={editIcon_White} alt="edit image" />
                            <small
                                style={{
                                    fontSize: '16px',
                                    fontWeight: 700,
                                    marginLeft: '5px',
                                    fontFamily: 'Bold',
                                }}
                            >
                                Edit
                            </small>
                        </button>
                    </div>
                )}
            </Box>
            <Box
                sx={{
                    mt: 2,
                    mb: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    minHeight: 550,
                    padding: 2,
                }}
            >
                <Typography
                    variant="h7"
                    sx={{
                        color: '#1A1E3D',
                        fontSize: '16px',
                        fontWeight: 500,
                        marginBottom: '20px',
                        fontFamily: 'Medium',
                    }}
                    component="h4"
                    gutterBottom
                >
                    Instructions
                </Typography>
                {editData ? (
                    <>
                        <Paper
                            elevation={3}
                            sx={{ padding: 2, borderRadius: 2 }}
                        >
                            <ReactQuill
                                value={value}
                                onChange={setValue}
                                modules={modules}
                                formats={formats}
                            />
                        </Paper>
                        <Box
                            className="inputBtnContainer"
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-start',
                                marginTop: 2,
                            }}
                        >
                            <button
                                className="buttonContainer"
                                onClick={handleUpdateWOLInstructions}
                            >
                                <small
                                    style={{
                                        fontSize: '14px',
                                        fontFamily: 'Bold',
                                        textTransform: 'none',
                                    }}
                                >
                                    Update
                                </small>
                            </button>
                        </Box>
                    </>
                ) : (
                    <Typography
                        sx={{ color: '#5F6383' }}
                        variant="body1"
                        gutterBottom
                    >
                        {/* {instruction.length > 0 && (
                            <ul>
                                {instruction.map((point, index) => (
                                    <li key={index}>{point}</li>
                                ))}
                            </ul>
                        )} */}
                        <div
                            dangerouslySetInnerHTML={{ __html: instruction }}
                        />
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default WOLInstructions;
