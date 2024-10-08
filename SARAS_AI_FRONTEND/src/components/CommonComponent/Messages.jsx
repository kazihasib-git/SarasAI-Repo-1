import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../pages/MODULE/coachModule/CoachMenuMessages.css';

import filterIcon from '../../assets/filtericon1.svg';
import PaperclipIcon from '../../assets/paperclip.svg';
import VoiceIcon from '../../assets/voice1.svg';
import MicNoneIcon from '@mui/icons-material/MicNone';
import SendButtonIcon from '../../assets/sendbutton.svg';
import NotificationIcon from '../../assets/NotificationIcon.svg';
import SearchIcon from '../../assets/messagesearchicon.svg';
import FilterBackground from '../../assets/duedatebackground.svg';
import userimg from '../../assets/userimg.png';
import CancelIcon from '@mui/icons-material/Cancel';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'; // Import an appropriate icon
import RefreshIcon from '@mui/icons-material/Refresh';
import moment from 'moment';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DoneIcon from '@mui/icons-material/Done';

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
    Checkbox,
} from '@mui/material';

const initialChatData = [
    { sender: 'me', text: 'Loading...', timestamp: new Date() },
];

const getTimeAgo = timestamp => {
    const now = new Date();
    const diff = Math.floor((now - new Date(timestamp)) / 1000);

    if (diff < 60) return `${diff} s`;
    if (diff < 3600) return `${Math.floor(diff / 60)} m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} d`;
    return `${Math.floor(diff / 604800)} w`;
};

const formatTimestamp = timestamp => {
    const date = new Date(timestamp);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    // Format time
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
};

const Messages = ({ role }) => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setselectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [checkboxes, setCheckboxes] = useState({
        email: false,
        whatsapp: false,
        text: false,
    });
    const fileInputRef = useRef(null);
    const [assignedUsersData, setassignedUsersData] = useState([]);
    const [chatUserMapping, setchatUserMappingData] = useState([]);
    const [currentChatId, setcurrentChatId] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordedUrl, setRecordedUrl] = useState(null);
    const mediaStream = useRef(null);
    const mediaRecorder = useRef(null);
    const chunks = useRef([]);
    const [isPaused, setIsPaused] = useState(false);
    //const [recordingText, setRecordingText] = useState('');
    const [recordingName, setRecordingName] = useState('');
    const [isApiLoading, setIsApiLoading] = useState(false);

    const {
        coachProfileData,
        assignedCoachStudents,
        taCoachAllChatData,
        chatRecordsbychatId,
        createdChatId,
        loading,
    } = useSelector(state => state.coachMenu);

    const { taProfileData, assignedTaStudents } = useSelector(
        state => state.taMenu
    );

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const filteredUsers = assignedUsersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to refresh
    const handleRefresh = () => {
        if (role === 'coach' || role === 'ta') {
            dispatch(getTaCoachAllChats(role));
        }
    };

    const handleUserClick = async user => {
        setselectedUser(user);
        if (role === 'coach' || role === 'ta') {
            if (
                chatUserMapping.every(mappedUser => mappedUser.id !== user.id)
            ) {
                let data = {
                    chat_name:
                        (role === 'ta'
                            ? taProfileData.name
                            : coachProfileData.name) +
                        '-' +
                        user.name,
                };
                await dispatch(
                    createChatForTaCoach({ role: role, data: data })
                );
            } else {
                setcurrentChatId(user.chat_id);
            }
        }
    };

    const handleMessageChange = event => {
        setNewMessage(event.target.value);
    };

    const HandleSentFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            mediaStream.current = stream;
            mediaRecorder.current = new MediaRecorder(stream);

            mediaRecorder.current.ondataavailable = e => {
                if (e.data.size > 0) {
                    chunks.current.push(e.data);
                }
            };

            mediaRecorder.current.onstop = () => {
                const recordedBlob = new Blob(chunks.current, {
                    type: 'audio/mp3',
                });
                const url = URL.createObjectURL(recordedBlob);
                setRecordedUrl(url);
                setRecordingName('voice-recording.mp3');
                chunks.current = [];
            };

            mediaRecorder.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (
            mediaRecorder.current &&
            mediaRecorder.current.state !== 'inactive'
        ) {
            mediaRecorder.current.stop();
        }
        setIsRecording(false);
        setIsPaused(false);

        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
        }
    };

    const pauseRecording = () => {
        if (
            mediaRecorder.current &&
            mediaRecorder.current.state === 'recording'
        ) {
            mediaRecorder.current.pause();
            setIsPaused(true);
        } else if (
            mediaRecorder.current &&
            mediaRecorder.current.state === 'paused'
        ) {
            mediaRecorder.current.resume();
            setIsPaused(false);
        }
    };
    const discardRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.onstop = () => {};
            mediaRecorder.current.stop();
        }
        chunks.current = [];
        setRecordedUrl(null);
        setRecordingName('');
        // setRecordingText('');
        setIsRecording(false);
        setIsPaused(false);

        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
        }
    };

    const handleSendMessageAndFile = async () => {
        if (!newMessage.trim() && !selectedFile && !recordedUrl) {
            return;
        }

        const formData = new FormData();
        formData.append('chat_id', currentChatId);
        formData.append('sender_type', 'AdminUsers');

        if (newMessage.trim()) {
            formData.append('message_text', newMessage);
        }

        if (selectedFile) {
            formData.append('files', selectedFile);
        }

        if (recordedUrl && recordingName) {
            const recordedBlob = await fetch(recordedUrl).then(r => r.blob());
            const recordedFile = new File([recordedBlob], recordingName, {
                type: 'audio/mp3',
            });
            formData.append('files', recordedFile);
        }

        try {
            const response = await dispatch(
                sentMessage({ role: role, data: formData })
            );

            // Update local state with both message, file info, and audio info
            setMessages(prevMessages => [
                ...prevMessages,
                {
                    sender: 'me',
                    text: newMessage,
                    file: selectedFile
                        ? {
                              name: selectedFile.name,
                              type: selectedFile.type,
                              url: URL.createObjectURL(selectedFile), // Temporary URL for local preview
                          }
                        : null,
                    audio: recordedUrl
                        ? {
                              url: recordedUrl,
                              name: recordingName,
                          }
                        : null,
                },
            ]);

            // Re-fetch messages
            await dispatch(
                getChatRecordsByChatId({
                    role: role,
                    chatId: currentChatId,
                })
            );

            // Reset state after sending
            setNewMessage('');
            setSelectedFile(null);
            setRecordedUrl(null);
            setRecordingName('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error sending message/file:', error);
        }
    };

    const handleFileChange = event => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };
    const handleCancelFile = () => {
        setSelectedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancelAudio = () => {
        setRecordingName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleAudioStop = audioBlob => {
        // Set a default name for the audio file
        const audioFileWithName = new File([audioBlob], 'voice-recording.wav', {
            type: audioBlob.type,
        });
        setAudioFile(audioFileWithName);
    };

    useEffect(() => {
        const setUserToChat = async () => {
            if (role === 'coach' || role === 'ta') {
                if (selectedUser !== null) {
                    setcurrentChatId(createdChatId);
                    const data = {
                        chat_id: createdChatId,
                        users: [
                            {
                                user_id: selectedUser['id'],
                                user_type: 'Student',
                            },
                        ],
                    };
                    await dispatch(addUserToChat({ role: role, data: data }));
                }
            }
        };
        setUserToChat();
        dispatch(getTaCoachAllChats(role));
    }, [createdChatId]);

    useEffect(() => {
        const fetchChatData = async () => {
            if (currentChatId) {
                if (role === 'coach' || role === 'ta') {
                    await dispatch(
                        getChatRecordsByChatId({
                            role: role,
                            chatId: currentChatId,
                        })
                    );
                }
            }
        };
        fetchChatData();
    }, [currentChatId]);

    useEffect(() => {
        let reformedChatData = [];
        if (role === 'coach' || role === 'ta') {
            let chatmessagesData = chatRecordsbychatId['chat_messages'];

            if (chatmessagesData !== undefined) {
                for (let i = 0; i < chatmessagesData.length; i++) {
                    let chatData = {
                        sender:
                            chatmessagesData[i].sender_type ===
                            'Modules\\Admin\\Models\\AdminUsers'
                                ? 'me'
                                : 'other',
                        text: chatmessagesData[i].message_text,
                        timestamp: chatmessagesData[i].created_at,
                        file:
                            chatmessagesData[i].chat_message_files &&
                            chatmessagesData[i].chat_message_files.length > 0
                                ? {
                                      name: chatmessagesData[i]
                                          .chat_message_files[0].original_name,
                                      url: chatmessagesData[i]
                                          .chat_message_files[0].file_name,
                                  }
                                : null,
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
        if (role === 'coach' || role === 'ta') {
            let reformedStudentData = [];
            let assignedTaCoachStudents =
                role === 'coach' ? assignedCoachStudents : assignedTaStudents;
            for (let i = 0; i < assignedTaCoachStudents.length; i++) {
                let student = {
                    id: assignedTaCoachStudents[i]['student'].id,
                    name: assignedTaCoachStudents[i]['student'].name,
                    profilePic: userimg,
                    status: 'Online',
                    lastSeen: '2m',
                    lastMessage: '',
                };
                reformedStudentData.push(student);
            }
            setassignedUsersData(reformedStudentData);
            let reformedMappingData = [];
            for (let i = 0; i < taCoachAllChatData.length; i++) {
                const lastMessage =
                    taCoachAllChatData[i]['chat_messages'].length > 0
                        ? taCoachAllChatData[i]['chat_messages'][
                              taCoachAllChatData[i]['chat_messages'].length - 1
                          ].message_text
                        : 'No Message';

                const lastMessageTimestamp =
                    taCoachAllChatData[i]['chat_messages'].length > 0
                        ? taCoachAllChatData[i]['chat_messages'][
                              taCoachAllChatData[i]['chat_messages'].length - 1
                          ].created_at
                        : new Date();
                let Data = {
                    id: taCoachAllChatData[i]['students'][0].id,
                    name: taCoachAllChatData[i]['students'][0].name,
                    profilePic: userimg,
                    status: 'Online',
                    lastSeen: getTimeAgo(lastMessageTimestamp),
                    chat_id: taCoachAllChatData[i].id,
                    lastMessage: lastMessage
                        ? lastMessage.length > 15
                            ? lastMessage.slice(0, 14) + '...'
                            : lastMessage
                        : '',
                    lastMessageTimestamp: new Date(lastMessageTimestamp), // Store timestamp for sorting
                };
                reformedMappingData.push(Data);
            }

            // Sort the data by lastMessageTimestamp in descending order
            reformedMappingData.sort(
                (a, b) => b.lastMessageTimestamp - a.lastMessageTimestamp
            );

            setchatUserMappingData(reformedMappingData);
        }
    }, [assignedTaStudents, assignedCoachStudents, taCoachAllChatData]);

    const usersToDisplay = searchQuery === '' ? chatUserMapping : filteredUsers;

    useEffect(() => {
        if (selectedUser) {
            setCheckboxes({
                email: false,
                whatsapp: false,
                text: false,
            });
        }
    }, [currentChatId]);

    const handleCheckboxChange = event => {
        setCheckboxes({
            ...checkboxes,
            [event.target.name]: event.target.checked,
        });
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            event.preventDefault();

            if (loading || (!newMessage.trim() && !selectedFile && !recordedUrl)) {
                return;
            }
            
            handleSendMessageAndFile();
        }
    };
    return (
        <div className="container">
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
                    <IconButton onClick={handleRefresh}>
                        <RefreshIcon />
                    </IconButton>
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
                    {usersToDisplay !== undefined &&
                    usersToDisplay.length > 0 ? (
                        usersToDisplay.map(user => (
                            <div
                                key={user.id}
                                className={
                                    user.id === selectedUser?.id
                                        ? 'chat-item-active'
                                        : 'chat-item'
                                }
                                onClick={() => handleUserClick(user)}
                            >
                                <img
                                    src={user.profilePic}
                                    alt={userimg}
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
                                <div className="last-seen">{user.lastSeen}</div>
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
                                backgroundColor: '#ffffff',
                                borderRadius: '0 10px 10px 0',
                            }}
                        >
                            <Box display="flex" alignItems="center" flex="1">
                                <img
                                    src={selectedUser.profilePic}
                                    alt={selectedUser.name}
                                    className="profile-pic"
                                />
                                <Box ml={2} className="status-container">
                                    <Typography variant="h6">
                                        {selectedUser.name}
                                    </Typography>
                                    <Box display="flex" alignItems="center">
                                        <div
                                            className={`status-indicator ${
                                                selectedUser.status === 'Online'
                                                    ? 'online'
                                                    : ''
                                            }`}
                                        />
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            sx={{ ml: 1 }}
                                        >
                                            {selectedUser.status}
                                        </Typography>
                                    </Box>
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
                            sx={{
                                mt: 0,
                                mb: 0,
                                border: '1px solid #C2C2E7',
                            }}
                        />

                        <Box className="chat-messages">
                            {messages.map((msg, index) => {
                                const isFirstMessageFromSameSender =
                                    index === 0 ||
                                    messages[index - 1].sender !== msg.sender;
                                return (
                                    <Box
                                        key={index}
                                        display="flex"
                                        flexDirection="column"
                                        alignItems={
                                            msg.sender === 'me'
                                                ? 'flex-end'
                                                : 'flex-start'
                                        }
                                        mb={1}
                                    >
                                        <Box display="flex" alignItems="center">
                                            {msg.sender === 'other' && (
                                                <img
                                                    src={
                                                        selectedUser.profilePic
                                                    }
                                                    alt="Profile Pic"
                                                    className="profile-pic"
                                                    style={{
                                                        marginRight: '8px',
                                                        visibility:
                                                            isFirstMessageFromSameSender
                                                                ? 'visible'
                                                                : 'hidden',
                                                    }}
                                                />
                                            )}
                                            <Box
                                                p={1}
                                                className={`message-bubble ${msg.sender}`}
                                                style={{
                                                    maxWidth: '60%', // Set a reasonable max-width for messages
                                                    borderRadius: '15px',
                                                    marginRight:
                                                        msg.sender === 'me'
                                                            ? '0'
                                                            : 'auto',

                                                    marginLeft:
                                                        msg.sender === 'me'
                                                            ? 'auto'
                                                            : '0',
                                                }}
                                            >
                                                {msg.text}

                                                {msg.file && (
                                                    <Box mt={1}>
                                                        <Typography variant="caption">
                                                            <a
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    alignItems:
                                                                        'center',
                                                                    border: '1px solid white',
                                                                    borderRadius:
                                                                        '8px',
                                                                    color: 'white',
                                                                    padding:
                                                                        '5px 10px',
                                                                    textDecoration:
                                                                        'none',
                                                                    backgroundColor:
                                                                        '#333',
                                                                }}
                                                                href={
                                                                    msg.file.url
                                                                }
                                                                target="_blank" // Opens in a new tab
                                                                rel="noopener noreferrer" // Security measure
                                                            >
                                                                <InsertDriveFileIcon
                                                                    style={{
                                                                        marginRight:
                                                                            '5px',
                                                                        color: 'white',
                                                                    }}
                                                                />
                                                                {msg.file.name}
                                                            </a>
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>

                                            {msg.sender === 'me' && (
                                                <img
                                                    src={
                                                        role === 'coach'
                                                            ? coachProfileData.profile_picture
                                                            : taProfileData.profile_picture
                                                    }
                                                    alt="Profile Pic"
                                                    className="profile-pic"
                                                    style={{
                                                        marginLeft: '8px',
                                                        visibility:
                                                            isFirstMessageFromSameSender
                                                                ? 'visible'
                                                                : 'hidden',
                                                    }}
                                                />
                                            )}
                                        </Box>

                                        {/* Timestamp moved below the message bubble */}
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            display="block"
                                            style={{
                                                textAlign:
                                                    msg.sender === 'me'
                                                        ? 'right'
                                                        : 'left',
                                                marginTop: '4px',
                                                marginLeft: '55px', // Adjust the margin as needed
                                                marginRight: '55px',
                                            }}
                                        >
                                            {formatTimestamp(msg.timestamp)}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>

                        <Box
                            className="chat-input-container"
                            sx={{
                                borderRadius: '42px',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '10px',
                            }}
                        >
                            <TextField
                                variant="outlined"
                                placeholder="Type a message..."
                                value={newMessage}
                                //value={newMessage}
                                onChange={handleMessageChange}
                                onKeyPress={handleKeyPress}
                                fullWidth
                                multiline
                                maxRows={5} // Allows the textbox to expand up to 5 rows if needed
                                sx={{
                                    width: '50%',
                                    borderRadius: '42px',
                                    marginRight: '10px',
                                    flexGrow: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '42px',
                                        backgroundColor: '#ffffff',
                                        '& fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'rgba(0, 0, 0, 0.23)',
                                        },
                                    },
                                    '& .MuiInputBase-input': {
                                        padding: '12px 14px',
                                        // Adjust the padding to control the height
                                        paddingRight: '120px',
                                        height: 'auto', // Ensures height adjusts with content
                                    },
                                }}
                            />

                            <div
                                className="chat-input-icons"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                            >
                                {selectedFile && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: '10px',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                maxWidth: '100px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {selectedFile.name}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={handleCancelFile}
                                            sx={{ marginLeft: '5px' }}
                                        >
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                )}

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <IconButton
                                    className="input-icon"
                                    onClick={HandleSentFile}
                                >
                                    <img src={PaperclipIcon} alt="Attach" />
                                </IconButton>
                                {recordedUrl && recordingName && (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: '10px',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                border: '1px solid white',
                                                borderRadius: '5px',
                                                color: 'white',
                                                padding: '4px 4px',
                                                textDecoration: 'none',
                                                backgroundColor: '#333',
                                                marginRight: '10px',
                                            }}
                                        >
                                            <a
                                                style={{
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                }}
                                                href={recordedUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <InsertDriveFileIcon
                                                    sx={{
                                                        maxWidth: '100px',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                    }}
                                                />
                                                {recordingName}
                                            </a>
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={handleCancelAudio}
                                            sx={{ marginLeft: '5px' }}
                                        >
                                            <CancelIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                )}
                                {isRecording ? (
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginRight: '10px',
                                        }}
                                    >
                                        <IconButton onClick={pauseRecording}>
                                            {isPaused ? (
                                                <PlayArrowIcon />
                                            ) : (
                                                <PauseIcon />
                                            )}
                                        </IconButton>
                                        <IconButton onClick={discardRecording}>
                                            <CancelIcon />
                                        </IconButton>
                                        <IconButton onClick={stopRecording}>
                                            <DoneIcon />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <>
                                        <IconButton
                                            className="input-icon"
                                            onClick={startRecording}
                                            disabled={loading}
                                        >
                                            <MicNoneIcon />
                                        </IconButton>
                                        <IconButton
                                            className="input-icon"
                                            onClick={handleSendMessageAndFile}
                                            disabled={loading || (!newMessage.trim() && !selectedFile && !recordedUrl)}
                                        >
                                            <img
                                                src={SendButtonIcon}
                                                alt="Send"
                                            />
                                        </IconButton>
                                    </>
                                )}
                            </div>

                            <Box className="checkbox-container">
                                <label>
                                    <Checkbox
                                        name="email"
                                        checked={checkboxes.email}
                                        onChange={handleCheckboxChange}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 18,
                                            },
                                        }}
                                    />
                                    Email
                                </label>
                                <label>
                                    <Checkbox
                                        name="whatsapp"
                                        checked={checkboxes.whatsapp}
                                        onChange={handleCheckboxChange}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 18,
                                            },
                                        }}
                                    />
                                    WhatsApp
                                </label>
                                <label>
                                    <Checkbox
                                        name="text"
                                        checked={checkboxes.text}
                                        onChange={handleCheckboxChange}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 18,
                                            },
                                        }}
                                    />
                                    Text
                                </label>
                            </Box>
                        </Box>
                    </>
                )}
            </div>
        </div>
    );
};
export default Messages;
