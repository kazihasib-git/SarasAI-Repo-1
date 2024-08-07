import React, { useState } from 'react';
//import CoachMenu from './CoachMenu';

import '../../pages/MODULE/coachModule/CoachMenuMessages.css';

import filterIcon from '../../assets/filtericon1.svg';

//import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

//import SearchIcon from '@mui/icons-material/Search';
//import NotificationsIcon from '@mui/icons-material/Notifications';
import PaperclipIcon from '../../assets/paperclip.svg';
import VoiceIcon from '../../assets/voice.svg';
import SendButtonIcon from '../../assets/sendbutton.svg';
import NotificationIcon from '../../assets/NotificationIcon.svg';
import SearchIcon from '../../assets/messagesearchicon.svg';
import FilterBackground from '../../assets/duedatebackground.svg';
import profilePic from '../../assets/profile.png';

import {
    TextField,
    InputAdornment,
    Typography,
    Box,
    IconButton,
    Divider,
} from '@mui/material';

// Sample student chat data
const studentsData = [
    {
        id: 1,
        name: 'John Doe',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '2m',
    },
    {
        id: 2,
        name: 'Jane Smith',
        profilePic: profilePic,
        status: 'Offline',
        lastSeen: '20m',
    },
    {
        id: 3,
        name: 'Alice Johnson',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '4m',
    },
    {
        id: 4,
        name: 'Sandeep',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '5m',
    },
    {
        id: 5,
        name: 'Nikesh',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '5m',
    },
    {
        id: 6,
        name: 'Nikuu',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '15m',
    },
    {
        id: 7,
        name: 'Manish',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '15m',
    },
    {
        id: 8,
        name: 'Ayushman',
        profilePic: profilePic,
        status: 'Online',
        lastSeen: '18m',
    },
    // Add more students as needed
];

const initialChatData = [
    { sender: 'me', text: 'Hi, how are you?' },
    { sender: 'other', text: 'I am good, thanks! How about you?' },
    { sender: 'me', text: 'I am fine too. What’s up?' },
];

const Messages = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Handle search input change
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    // Filter students based on search query
    const filteredStudents = studentsData.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle student selection
    const handleStudentClick = student => {
        setSelectedStudent(student);
        setMessages(initialChatData); // Load initial dummy chat data
    };

    // Handle message input change
    const handleMessageChange = event => {
        setNewMessage(event.target.value);
    };

    // Handle sending message
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'me', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div className="container">
            {/* <CoachMenu /> */}
            <Box mt={0}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        width: '274px',
                        height: '40px',
                        fontFamily: 'ExtraLight',
                    }}
                >
                    Messages
                </Typography>
            </Box>

            <div className="box box1">
                <div className="search-container">
                    <TextField
                        variant="outlined"
                        placeholder="Search Student"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <img src={SearchIcon} alt="search icon" />
                            ),
                        }}
                        className="search-bar"
                    />
                    <div className="filter-background">
                        <img src={FilterBackground} alt="Filter Background" />
                        <button className="filter-button">
                            <img src={filterIcon} alt="Filter Icon" />
                        </button>
                    </div>
                </div>
                <div className="chat-list">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div
                                key={student.id}
                                className="chat-item"
                                onClick={() => handleStudentClick(student)}
                            >
                                <img
                                    src={student.profilePic}
                                    alt={student.name}
                                    className="profile-pic"
                                />
                                <div className="chat-info">
                                    <div className="student-name">
                                        {student.name}
                                    </div>
                                    <div className="last-message">
                                        Sample chat message...
                                    </div>
                                </div>
                                <div className="last-seen">
                                    {student.lastSeen}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>No students found</div>
                    )}
                </div>
            </div>

            <div className="box box2">
                {selectedStudent && (
                    <>
                        <Box
                            display="flex"
                            alignItems="center"
                            height="80px"
                            p={2}
                            sx={{
                                backgroundColor: '#f6f6f8',
                                borderRadius: '0 10px 10px 0',
                            }}
                        >
                            <Box display="flex" alignItems="center" flex="1">
                                <img
                                    src={selectedStudent.profilePic}
                                    alt={selectedStudent.name}
                                    className="profile-pic"
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <Box ml={2}>
                                    <Typography variant="h6">
                                        {selectedStudent.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {selectedStudent.status}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton className="notification-icon">
                                <img
                                    src={NotificationIcon}
                                    alt="notification"
                                />
                            </IconButton>
                        </Box>
                        <Divider
                            sx={{ mt: 0, mb: 0, border: '1px solid #C2C2E7' }}
                        />

                        <Box className="chat-messages">
                            {messages.map((msg, index) => (
                                <Box
                                    key={index}
                                    className={`message ${msg.sender}`}
                                    display="flex"
                                    justifyContent={
                                        msg.sender === 'me'
                                            ? 'flex-end'
                                            : 'flex-start'
                                    }
                                    mb={1}
                                    alignItems="flex-start"
                                >
                                    {msg.sender === 'other' && (
                                        <img
                                            src={selectedStudent.profilePic} // Use selected student's profile pic
                                            alt="Profile Pic"
                                            className="profile-pic"
                                            style={{ marginRight: '8px' }}
                                        />
                                    )}
                                    <Box
                                        p={1}
                                        className={`message-bubble ${msg.sender}`}
                                    >
                                        {msg.text}
                                    </Box>
                                    {msg.sender === 'me' && (
                                        <img
                                            src={selectedStudent.profilePic} // Use selected student's profile pic
                                            alt="Profile Pic"
                                            className="profile-pic"
                                            style={{ marginLeft: '8px' }}
                                        />
                                    )}
                                </Box>
                            ))}
                        </Box>

                        <Box className="chat-input-container">
                            <TextField
                                variant="outlined"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={handleMessageChange}
                                fullWidth
                                sx={{
                                    borderRadius: '20px',
                                    marginRight: '10px',
                                }}
                            />
                            <div className="chat-input-icons">
                                <IconButton className="input-icon">
                                    <img src={PaperclipIcon} alt="Attach" />
                                </IconButton>
                                <IconButton className="input-icon">
                                    <img src={VoiceIcon} alt="Voice" />
                                </IconButton>
                                <IconButton
                                    className="input-icon"
                                    onClick={handleSendMessage}
                                >
                                    <img src={SendButtonIcon} alt="Send" />
                                </IconButton>
                            </div>
                        </Box>
                    </>
                )}
            </div>
        </div>
    );
};
export default Messages;
