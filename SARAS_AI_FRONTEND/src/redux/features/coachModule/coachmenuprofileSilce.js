import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axiosInstance from '../../services/httpService';
import { toast } from 'react-toastify';

// Get Coach profile
export const getCoachMenuProfile = createAsyncThunk(
    'coach/getProfile',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/coach-profile`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Update coach profile
export const updateCoachmenuprofile = createAsyncThunk(
    'coachMenu/updateprofile',
    async data => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/coach-profile`,
            data
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Coach Slots
export const getCoachMenuSlots = createAsyncThunk(
    'coachMenu/getSlots',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/slots`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Coach Slots by Date
export const getCoachMenuSlotsByData = createAsyncThunk(
    'coachMenu/getSlotsByDate',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/slots-by-date`,
            data
        );
        return response.data;
    }
);

// Create Coach Slots (
export const createCoachMenuSlot = createAsyncThunk(
    'coachMenu/createSlots',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/create-slots`,
            data
        );
        return response.data;
    }
);

// Get Coach Sessions
export const getCoachMenuSessions = createAsyncThunk(
    'coachMenu/getSessions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/sessions`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Create Coach Sessions
export const createCoachMenuSession = createAsyncThunk(
    'coachMenu/createSession',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/schedule-call/schedule-calls`,
            data
        );
        return response.data;
    }
);

// Get Assigned Students
export const getCoachMenuAssignedStudents = createAsyncThunk(
    'coachMenu/getAssignedStudents',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/get-students`
        );
        return response.data;
    }
);

// Get Assigned Batches
export const getCoachMenuAssignedBatches = createAsyncThunk(
    'coachMenu/getAssignedBatches',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/get-batches`
        );
        return response.data;
    }
);

// Create Coach Leave
export const createCoachMenuLeave = createAsyncThunk(
    'coachMenu/createLeave',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/create-leave`,
            data
        );
        return response.data;
    }
);

// Get Coach Slots for Leave
export const getCoachMenuSlotsForLeave = createAsyncThunk(
    'coachMenu/getCoachMenuSlotsForLeave',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/slot-between-dates`,
            data
        );
        return response.data;
    }
);

// Get Coach Session for Leave by slots
export const getCoachMenuSessionForLeave = createAsyncThunk(
    'coachMenu/getCoachMenuSessionForLeave',
    async data => {
        console.log('DATE TO BE SEND IN API', data);
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/schedule-by-slots`,
            data
        );
        return response.data;
    }
);

export const cancelScheduledSessionForLeave = createAsyncThunk(
    'coachMenu/cancelScheduledSession',
    async id => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/calendar/cancel-schedule/${id}`
        );
        return response.data;
    }
);

// Reason for Coach Leave
export const reasonForCoachMenuLeave = createAsyncThunk(
    'coachMenu/reasonForLeave',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/create-leave`,
            data
        );
        return response.data;
    }
);

// Reschedule Session for Coach Leave
export const rescheduleSessionForCoachLeave = createAsyncThunk(
    'coachMenu/rescheduleSession',
    async ({ id, data }) => {
        console.log('id & data', id, data);
        const response = await axiosInstance.post(
            `${baseUrl}/coach/calendar/reschedule/${id}`,
            data
        );
        return response.data;
    }
);

// get Coach call requests
export const getCoachCallRequests = createAsyncThunk(
    'coachMenu/getCallRequests',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/call-request/get-call-request`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// approve call request
export const approveCallRequest = createAsyncThunk(
    'coachMenu/approveCallRequest',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/call-request/approve-call-request/${id}`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//deny call request
export const denyCallRequest = createAsyncThunk(
    'coachMenu/denyCallRequest',
    async (id, message) => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/call-request/denie-call-request/${id}`,
            {
                // 'reject_reason': message,
                reject_reason: message,
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//get Coach scheduled Calls
export const getCoachScheduledCalls = createAsyncThunk(
    'coachMenu/getScheduledCalls',
    async date => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/schedule-call/get-schedule-call`,
            {
                date: date,
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//coach call records
export const getCoachCallRecords = createAsyncThunk(
    'coachMenu/getCoachCallRecords',
    async date => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/call-recording/get-call-recording`,
            {
                date: date,
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//upload video

export const uploadSessionRecording = createAsyncThunk(
    'coachMenu/uploadSessionRecording',
    async ({ id, session_recording_url }) => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/call-recording/upload-session-recording/${id}`,
            { session_recording_url }
        );

        return response.data;
    }
);

export const assignSessionNotes = createAsyncThunk(
    'calls/assignSessionNotes',
    async ({ id, data }) => {
        const response = await axiosInstance.put(
            `${baseUrl}/coach/call-recording/assign-session-notes/${id}`,
            data
        );
        return response.data;
    }
);

// All Chat apis are from here

// to get all chats for a coach 

export const getTaCoachAllChats = createAsyncThunk(
    'coachMenu/getAllChats',
    async (role) => {
        const response = await axiosInstance.get(
            `${baseUrl}/${role}/chat/get-my-chat`
        );
        return response.data;
    }
);

// Chat Record by chat id
export const getChatRecordsByChatId = createAsyncThunk(
    'coachMenu/getChatRecordsByChatId',
    async ({role,chatId}) => {
        const response = await axiosInstance.get(
            `${baseUrl}/${role}/chat/get-single-chat/${chatId}`
        );
        return response.data;
    }
);

// create a chat
export const createChatForTaCoach = createAsyncThunk(
    'coachMenu/createChat',
    async ({role,data}) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/create-chat`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }
);

// add user to the chat 
export const addUserToChat = createAsyncThunk(
    'coachMenu/addUserToChat',

    async ({role,data}) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/add/users`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }
);

export const sentMessage = createAsyncThunk(
    'coachMenu/sentMessage',
    async ({role,data}) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/sent-messages`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    }
);


const initialState = {
    coachProfileData: [], // Coach Profile Data
    updateProfileData: [],
    coachSlots: [], // Coach Slots
    coachSlotsByDate: [], // Coach Slots By Date
    coachSessions: [], // Coach Sessions,
    assignedCoachStudents: [], // Assigned Students to Coach
    assignedCoachBatches: [], // Assigned Students to Batch
    selectedCoachStudents: [], // Selected Students for creating Schedules
    selectedCoachBatches: [], // Selected Batches for creating Schedules

    coachSlotsForLeave: [], // Slots For Leave
    coachSessionsForLeave: [], // Sessions for Leave
    coachLeave: [],
    rescheduledSessions: [],
    markForLeaveData: [],
    scheduledSessionForLeaveData: [],
    sessionsEventDataForLeave: [],
    slotsEventDataForLeave: [],

    coachCallRequests: [],
    coachScheduledCalls: [],

    coachCallRecords: [],
    sessionNotesData: [],

    taCoachAllChatData: [],  // All Chat Data
    chatRecordsbychatId: [], // All Chat Records by Chat Id
    createdChatId  : {}, // new chat id

    createCoachSlotsPopup: false,
    createCoachSessionPopup: false,
    selectStudent: false, // Select to Schedule Sessions
    selectBatches: false, // Select to Schedule Sessions

    createCoachLeavePopup: false,
    LeaveSlotsPopup: false,
    leaveScheduledSessionPopup: false,
    leaveRescheduleSessionPopup: false,
    reasonForLeavePopup: false,
    cancelSessionOnLeave: false,
    viewStudentsOnReschedule: false,

    sessionRecordingUrl: null,

    loading: false,
    error: null,
    coachCallRequests: [],
    coachScheduledCalls: [],
};

export const coachMenuSlice = createSlice({
    name: 'coachMenu',
    initialState,
    reducers: {
        // For Creating New Slots
        openCreteSlotsPopup: (state, action) => {
            console.log('actions :', action.payload);
            state.createCoachSlotsPopup = action.payload;
            state.createCoachSessionPopup = false;
        },
        closeCreateSlotsPopup: (state, action) => {
            state.createCoachSlotsPopup = false;
        },

        // For Creating New Session
        openCreateSessionPopup: (state, action) => {
            console.log('action :', action.payload);
            state.createCoachSessionPopup = true;
            if (action.payload.student) {
                state.selectedCoachStudents = action.payload.student;
            }
            if (action.payload.batches) {
                state.selectedCoachBatches = action.payload.batches;
            }
            state.createSlotsPop = false;
        },
        closeCreateSessionPopup: (state, action) => {
            state.createCoachSessionPopup = false;
            state.selectedCoachBatches = [];
            state.selectedCoachStudents = [];
        },
        openSelectStudents: (state, action) => {
            state.selectStudent = true;
        },
        closeSelectStudents: (state, action) => {
            state.selectStudent = false;
        },
        openSelectBatches: (state, action) => {
            state.selectBatches = true;
        },
        closeSelectBatches: (state, action) => {
            state.selectBatches = false;
        },

        // For Mark Leave
        openMarkLeavePopup: (state, action) => {
            state.createCoachLeavePopup = true;
        },
        closeMarkLeavePopup: (state, action) => {
            state.createCoachLeavePopup = false;
        },
        openSlotsForLeave: (state, action) => {
            console.log('Action payload :', action.payload);
            state.LeaveSlotsPopup = true;
            state.markForLeaveData = action.payload;
        },
        closeSlotsForLeave: (state, action) => {
            state.LeaveSlotsPopup = false;
            state.markForLeaveData = [];
        },
        openScheduledSessionForLeave: (state, action) => {
            console.log('Payload Data : ', action.payload);
            state.leaveScheduledSessionPopup = true;
            state.scheduledSessionForLeaveData = action.payload;
        },
        closeScheduledSessionForLeave: (state, action) => {
            state.leaveScheduledSessionPopup = false;
        },
        openCancelSessionForLeave: (state, action) => {
            console.log(
                'opening cancel session for leave ....',
                action.payload
            );

            state.cancelSessionOnLeave = true;
            state.sessionsEventDataForLeave = action.payload;
        },
        closeCancelSessionForLeave: (state, action) => {
            state.cancelSessionOnLeave = false;
        },
        openReasonForLeavePopup: (state, action) => {
            state.reasonForLeavePopup = true;
            state.markForLeaveData = action.payload;
        },
        closeReasonForLeavePopup: (state, action) => {
            state.reasonForLeavePopup = false;
        },
        openRescheduleSessionForLeave: (state, action) => {
            console.log('opening cancel session for leave ....');
            state.leaveRescheduleSessionPopup = true;
            state.sessionsEventDataForLeave = action.payload;
        },
        closeRescheduleSessionForLeave: (state, action) => {
            state.leaveRescheduleSessionPopup = false;
        },
        openStudentsOfRescheduleSessionForLeave: (state, action) => {
            state.viewStudentsOnReschedule = true;
        },
        closeStudentsOfRescheduleSessionForLeave: (state, action) => {
            state.viewStudentsOnReschedule = false;
        },
    },
    extraReducers: builder => {
        // Get Coach Profile Data
        builder.addCase(getCoachMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.coachProfileData = action.payload.data;
        });
        builder.addCase(getCoachMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachProfileData = [];
        });

        // Update Coach Profile
        builder.addCase(updateCoachmenuprofile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateCoachmenuprofile.fulfilled, (state, action) => {
            state.loading = false;
            state.updateProfileData = action.payload.data;
        });
        builder.addCase(updateCoachmenuprofile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.updateProfileData = [];
        });

        // Get Coach Slots
        builder.addCase(getCoachMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSlots = action.payload.data;
        });
        builder.addCase(getCoachMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSlots = [];
        });

        // Get Coach Slots By Date
        builder.addCase(getCoachMenuSlotsByData.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachMenuSlotsByData.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSlotsByDate = action.payload.data;
        });
        builder.addCase(getCoachMenuSlotsByData.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSlotsByDate = [];
        });

        // Create Coach Slots
        builder.addCase(createCoachMenuSlot.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachMenuSlot.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSlots = action.payload.data;
        });
        builder.addCase(createCoachMenuSlot.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.error.message);
        });

        // Get Coach Sessions
        builder.addCase(getCoachMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSessions = action.payload.data;
        });
        builder.addCase(getCoachMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSessions = [];
        });

        // Get Coach Assigned Students
        builder.addCase(getCoachMenuAssignedStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachMenuAssignedStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                state.assignedCoachStudents = action.payload.data;
            }
        );
        builder.addCase(
            getCoachMenuAssignedStudents.rejected,
            (state, action) => {
                state.loading = false;
                state.assignedCoachStudents = [];
                state.error = action.error.message;
            }
        );

        // Get Coach Assigned Batches
        builder.addCase(getCoachMenuAssignedBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachMenuAssignedBatches.fulfilled,
            (state, action) => {
                state.loading = false;
                state.assignedCoachBatches = action.payload.data;
            }
        );
        builder.addCase(
            getCoachMenuAssignedBatches.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.assignedCoachBatches = [];
            }
        );

        // Get Slots for Leave
        builder.addCase(getCoachMenuSlotsForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachMenuSlotsForLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachSlotsForLeave = action.payload.data;
            }
        );
        builder.addCase(getCoachMenuSlotsForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSlotsForLeave = [];
        });

        // Get Sessions For Leave
        builder.addCase(getCoachMenuSessionForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getCoachMenuSessionForLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachSessionsForLeave = action.payload.data;
            }
        );
        builder.addCase(
            getCoachMenuSessionForLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.coachSessionsForLeave = [];
            }
        );

        // Cancel Scheduled Sessions for Leave
        builder.addCase(cancelScheduledSessionForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            cancelScheduledSessionForLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                // TODO : Handle case of cancel Scheduled Session
            }
        );
        builder.addCase(
            cancelScheduledSessionForLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
        );

        // Create Coach Leave
        builder.addCase(createCoachMenuLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachMenuLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.coachLeave = action.payload;
        });
        builder.addCase(createCoachMenuLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //get coach call requests
        builder.addCase(getCoachCallRequests.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachCallRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.coachCallRequests = action.payload.data;
        });
        builder.addCase(getCoachCallRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachCallRequests = [];
        });

        //approve call request
        builder.addCase(approveCallRequest.pending, state => {
            state.loading = true;
        });
        builder.addCase(approveCallRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.coachCallRequests = state.coachCallRequests.map(request =>
                request.id === action.payload.data.id
                    ? { ...request, status: 'Approved' }
                    : request
            );
        });
        builder.addCase(approveCallRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //deny Call Request
        builder.addCase(denyCallRequest.pending, state => {
            state.loading = true;
        });
        builder.addCase(denyCallRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.coachCallRequests = state.coachCallRequests.filter(
                request => request.id !== action.payload.data.id
            );
        });
        builder.addCase(denyCallRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //get coach scheduled calls
        builder.addCase(getCoachScheduledCalls.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachScheduledCalls.fulfilled, (state, action) => {
            state.loading = false;
            state.coachScheduledCalls = action.payload.data;
        });
        builder.addCase(getCoachScheduledCalls.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachScheduledCalls = [];
        });

        //get coach call records
        builder.addCase(getCoachCallRecords.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachCallRecords.fulfilled, (state, action) => {
            state.loading = false;
            state.coachCallRecords = action.payload.data;
        });
        builder.addCase(getCoachCallRecords.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachCallRecords = [];
        });

        //video upload call record
        builder.addCase(uploadSessionRecording.pending, state => {
            state.loading = true;
        });
        builder.addCase(uploadSessionRecording.fulfilled, (state, action) => {
            // Assuming the response contains session_recording_url
            state.sessionRecordingUrl = action.payload.session_recording_url;
        });
        builder.addCase(uploadSessionRecording.rejected, (state, action) => {
            state.error = action.payload;
        });

        // session notes
        builder.addCase(assignSessionNotes.pending, state => {
            state.loading = true;
        });
        builder.addCase(assignSessionNotes.fulfilled, (state, action) => {
            state.loading = false;
            state.sessionNotesData = action.payload.data; // Adjust based on response
        });
        builder.addCase(assignSessionNotes.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Reschedule CoachMenu Sessions For Leave
        builder.addCase(rescheduleSessionForCoachLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            rescheduleSessionForCoachLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                state.rescheduledSessions = action.payload.data;
            }
        );
        builder.addCase(
            rescheduleSessionForCoachLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
        );

        // Get Coach All Chats
        builder.addCase(getTaCoachAllChats.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaCoachAllChats.fulfilled, (state, action) => {
            state.loading = false;
            state.taCoachAllChatData = action.payload.data;
        });
        builder.addCase(getTaCoachAllChats.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taCoachAllChatData = [];
        });

        // Get Chat Records by Chat Id

        builder.addCase(getChatRecordsByChatId.pending, state => {
            state.loading = true;
        });
        builder.addCase(getChatRecordsByChatId.fulfilled, (state, action) => {
            state.loading = false;
            console.log('Chat Records by Chat Id in slice', action.payload.data);
            state.chatRecordsbychatId = action.payload.data;
        });
        builder.addCase(getChatRecordsByChatId.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.chatRecordsbychatId = [];
        });

        // Create Chat for TA/Coach
        builder.addCase(createChatForTaCoach.pending, state => {
            state.loading = true;
        });
        builder.addCase(createChatForTaCoach.fulfilled, (state, action) => {
            state.loading = false;
            state.createdChatId  = action.payload.data.id;
            console.log('Chat Created Successfully', action.payload.data.id);
        });
        builder.addCase(createChatForTaCoach.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Add User to Chat
        builder.addCase(addUserToChat.pending, state => {
            state.loading = true;
            console.log('Adding User to Chat');
        });
        builder.addCase(addUserToChat.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(addUserToChat.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export const {
    openCreteSlotsPopup,
    closeCreateSlotsPopup,
    openCreateSessionPopup,
    closeCreateSessionPopup,
    openMarkLeavePopup,
    closeMarkLeavePopup,
    openSelectStudents,
    closeSelectStudents,
    openSelectBatches,
    closeSelectBatches,
    openSlotsForLeave,
    closeSlotsForLeave,
    openScheduledSessionForLeave,
    closeScheduledSessionForLeave,
    openCancelSessionForLeave,
    closeCancelSessionForLeave,
    openReasonForLeavePopup,
    closeReasonForLeavePopup,
    openRescheduleSessionForLeave,
    closeRescheduleSessionForLeave,
    openStudentsOfRescheduleSessionForLeave,
    closeStudentsOfRescheduleSessionForLeave,
    openBatchesOfRescheduleSessionForLeave,
    closeBatchesOfRescheduleSessionForLeave,
} = coachMenuSlice.actions;

export default coachMenuSlice.reducer;
