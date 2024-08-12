import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
    getTaCoachAllChats,
    getChatRecordsByChatId,
    createChatForTaCoach,
    addUserToChat,
    sentMessage,
} from '../../redux/features/coachModule/coachmenuprofileSilce';

import {
    TextField,
    InputAdornment,
    Typography,
    Box,
    IconButton,
    Divider,
} from '@mui/material';


const initialChatData = [
    { sender: 'me', text: 'Hi, This is sample chat' },
    { sender: 'other', text: 'There is some problem in getting the data' },
];

const Messages = ({role}) => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setselectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [assignedUsersData, setassignedUsersData] = useState([]);
    const [chatUserMapping, setchatUserMappingData] = useState([]);
    const [currentChatId, setcurrentChatId] = useState(0);


    const {
        coachProfileData,
        assignedCoachStudents,
        taCoachAllChatData,
        chatRecordsbychatId,
        createdChatId,
    } = useSelector(state => state.coachMenu);

    const {
        assignedTaStudents
    } = useSelector(state => state.taMenu);

    // Handle search input change
    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    // Filter students based on search query
    const filteredUsers = assignedUsersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle student selection
    const handleUserClick = async (user) => {
        setselectedUser(user);
        if(role === 'coach' || role === 'ta') {
            console.log("chat-mapping===>", chatUserMapping);
            if (chatUserMapping.every(mappedUser => mappedUser.id !== user.id)) {
                let data = {
                    "chat_name" : coachProfileData.name + "-" + user.name
                }
                console.log(data);
                await dispatch(createChatForTaCoach({role:role,data:data}));
                console.log("new chat id===>>",currentChatId);
            }else{
                console.log("currect chat id==>", user.chat_id );
                setcurrentChatId(user.chat_id);
            }
        } 
    };

    // Handle message input change
    const handleMessageChange = event => {
        setNewMessage(event.target.value);
    };

    // Handle sending message
    const handleSendMessage = () => {
        if (newMessage.trim()) {
            setMessages([...messages, { sender: 'me', text: newMessage }]);
            let data = null;
            if(role === 'coach' || role === 'ta') {
                data = {
                    "chat_id" : currentChatId,
                    "message_text" : newMessage,
                    "sender_type" : "AdminUsers"
                }
            }
            dispatch(sentMessage({role:role,data:data}));
            setNewMessage('');
        }
    };

    useEffect(() => {
        const setUserToChat = async () => {
            if (role === 'coach' || role === 'ta') {
                if(selectedUser !== null){
                    setcurrentChatId(createdChatId);
                    const data = {
                        "chat_id" : createdChatId,
                        "users" : [{
                            "user_id" : selectedUser['id'],
                            "user_type" : "Student"
                        }]
                    }
                    console.log(selectedUser['id']);
                    console.log("data to add user to chat", data);
                    await dispatch(addUserToChat({role:role,data:data}));
                    console.log('new chat id created and updated',createdChatId);
                }
            }
        };
        setUserToChat();
        dispatch(getTaCoachAllChats(role));
    }, [createdChatId]);

    useEffect(() => {
        const fetchChatData = async () => {
            if (currentChatId) {
                console.log("Current Chat ID updated:", currentChatId);
                if (role === 'coach' || role === 'ta') {
                    await dispatch(getChatRecordsByChatId({role:role,chatId:currentChatId}));
                }
            }
        };
        fetchChatData();
    }, [currentChatId]);

    useEffect(() => {
        let reformedChatData = [];
        if (role === 'coach' || role === 'ta') {
            console.log("chat records===>", chatRecordsbychatId);
            let chatmessagesData = chatRecordsbychatId["chat_messages"];
            console.log(chatmessagesData);

            if (chatmessagesData !== undefined) {
                for (let i = 0; i < chatmessagesData.length; i++) {
                    let chatData = {
                        sender: chatmessagesData[i].sender_type === "Modules\\Admin\\Models\\AdminUsers" ? 'me' : 'other',
                        text: chatmessagesData[i].message_text,
                    };
                    reformedChatData.push(chatData);
                }
            } else {
                reformedChatData = initialChatData;
            }
        }
        setMessages(reformedChatData);
    }, [chatRecordsbychatId]);

    useEffect(() => {
        if ( role === 'coach' || role === 'ta' ) {
            let reformedStudentData = [];
            let assignedTaCoachStudents = role === 'coach' ? assignedCoachStudents : assignedTaStudents;
            for (let i = 0; i < assignedTaCoachStudents.length; i++) {
                let student = {
                    id: assignedTaCoachStudents[i]['student'].id,
                    name: assignedTaCoachStudents[i]['student'].name,
                    profilePic: profilePic,
                    status: 'Online',
                    lastSeen: '2m',
                    lastMessage : '',
                };
                reformedStudentData.push(student);
            }
            setassignedUsersData(reformedStudentData);
            // console.log('taCoachAllChatData', taCoachAllChatData);
            let reformedMappingData = [];
            for (let i = 0; i < taCoachAllChatData.length; i++) {
                const lastMessage = taCoachAllChatData[i]['chat_messages'].length > 0 
                    ? taCoachAllChatData[i]['chat_messages'][taCoachAllChatData[i]['chat_messages'].length - 1].message_text 
                    : 'No Message';
                let Data  = {
                    id : taCoachAllChatData[i]['students'][0].id,
                    name : taCoachAllChatData[i]['students'][0].name,
                    profilePic : profilePic,
                    status : 'Online',
                    lastSeen : '2m',
                    chat_id : taCoachAllChatData[i].id,
                    lastMessage : lastMessage.length > 15 
                    ? lastMessage.slice(0, 14) + '...' 
                    : lastMessage,
                }
                reformedMappingData.push(Data);
            }
            setchatUserMappingData(reformedMappingData);
        }

    },[assignedTaStudents,assignedCoachStudents, taCoachAllChatData]);

    // console.log('chatUserMapping', chatUserMapping);

    const usersToDisplay = searchQuery === '' ? chatUserMapping : filteredUsers;

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
                    {usersToDisplay.length > 0 ? (
                        usersToDisplay.map(user => (
                            <div
                                key={user.id}
                                className= {user.id === selectedUser?.id ? "chat-item-active" : "chat-item"}
                                onClick={() => handleUserClick(user)}
                            >
                                <img
                                    src={user.profilePic}
                                    alt={user.name}
                                    className="profile-pic"
                                />
                                <div className="chat-info">
                                    <div className="student-name">
                                        {user.name}
                                    </div>
                                    <div className="last-message">
                                        {user.lastMessage}
                                    </div>
                                </div>
                                <div className="last-seen">
                                    {user.lastSeen}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="chat-item">
                            <div className="profile-pic"></div>
                            <div className="chat-info">
                                <div className="student-name">
                                    No Chat Found
                                </div>
                                <div className="last-message">
                                    Start a new chat
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="box box2">
                {selectedUser && (
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
                                    src={selectedUser.profilePic}
                                    alt={selectedUser.name}
                                    className="profile-pic"
                                    style={{ width: '40px', height: '40px' }}
                                />
                                <Box ml={2}>
                                    <Typography variant="h6">
                                        {selectedUser.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {selectedUser.status}
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
                                            src={selectedUser.profilePic} // Use selected student's profile pic
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
                                            src={selectedUser.profilePic} // Use selected student's profile pic
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
