import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axiosInstance from '../../services/httpService';
import { toast } from 'react-toastify';
import coachSchedule from '../adminModule/coach/coachSchedule';

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
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/coach/coach-profile`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Geting TA Sessions for Leave by Slots'
                );
            }
        }
    }
);

// Get Coach Slots
export const getCoachMenuSlots = createAsyncThunk(
    'coachMenu/getSlots',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/slots`
        );
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
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/create-slots`,
                data
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating coach slots'
                );
            }
        }
    }
);

// Get Coach Sessions
export const getCoachMenuSessions = createAsyncThunk(
    'coachMenu/getSessions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/sessions`
        );
        return response.data;
    }
);

// Create Coach Sessions
export const createCoachMenuSession = createAsyncThunk(
    'coachMenu/createSession',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/coach/schedule-call/schedule-calls`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While scheduling session'
                );
            }
        }
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

//Get Selected Assigend Students
export const getSelectedCoachMenuAssignedStudents = createAsyncThunk(
    'coachMenu/getSelectedAssignedStudents',
    async (id) => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/get-schedule-students/${id}`
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

//get selected Assigned Btches 
export const getSelectedCoachMenuAssignedBatches = createAsyncThunk(
    'coachMenu/getSelectedAssignedBatches',
    async (id) => {
        const response = await axiosInstance.get(
            `${baseUrl}/coach/calendar/get-schedule-batches/${id}`
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
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/slot-between-dates`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.error);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Geting Coach Sessions for Leave by Slots'
                );
            }
        }
    }
);
// Get Coach Session for Leave by slots
export const getCoachMenuSessionForLeave = createAsyncThunk(
    'coachMenu/getCoachMenuSessionForLeave',
    async (data, { rejectWithValue }) => {
        try {
            console.log('DATE TO BE SEND IN API', data);
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/schedule-by-slots`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating TA slots'
                );
            }
        }
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
    async ({ id, data }, { rejectWithValue }) => {
        try {
            console.log('id & data', id, data);
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/reschedule/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating TA slots'
                );
            }
        }
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
    async ({ id, data}) => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/call-request/approve-call-request/${id}` , data
        );
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
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/coach/schedule-call/get-schedule-call`,
            data
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

export const coachUploadSessionRecording = createAsyncThunk(
    'coachMenu/coachUploadSessionRecording',
    async ({ id, session_recording_url }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/coach/call-recording/upload-session-recording/${id}`,
                { session_recording_url }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Upload  video');
            }
        }
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
    async role => {
        const response = await axiosInstance.get(
            `${baseUrl}/${role}/chat/get-my-chat`
        );
        return response.data;
    }
);

// Chat Record by chat id
export const getChatRecordsByChatId = createAsyncThunk(
    'coachMenu/getChatRecordsByChatId',
    async ({ role, chatId }) => {
        const response = await axiosInstance.get(
            `${baseUrl}/${role}/chat/get-single-chat/${chatId}`
        );
        return response.data;
    }
);

// create a chat
export const createChatForTaCoach = createAsyncThunk(
    'coachMenu/createChat',
    async ({ role, data }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/create-chat`,
            data
        );
        return response.data;
    }
);

// add user to the chat
export const addUserToChat = createAsyncThunk(
    'coachMenu/addUserToChat',

    async ({ role, data }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/add/users`,
            data
        );
        return response.data;
    }
);

export const sentMessage = createAsyncThunk(
    'coachMenu/sentMessage',
    async ({ role, data }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/${role}/chat/sent-messages`,
            data
        );
        return response.data;
    }
);

export const getCoachMyStudents = createAsyncThunk(
    'coachMenu/getCoachMyStudents',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/coach/my-student`);
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Update Students In Coach Session
export const updateStudentsInCoachSession = createAsyncThunk(
    'coachMenu/updateStudentsInCoachSession',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/update-schedule-students/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Update Students in Session'
                );
            }
        }
    }
);

// Update Batches In Coach Session
export const updateBatchesInCoachSession = createAsyncThunk(
    'coachMenu/updateBatchesInCoachSession',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/coach/calendar/update-schedule-batches/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Updating Batches In Session'
                );
            };   
        }
    }
)


export const updateCoachScheduledCall = createAsyncThunk(
    'coachMenu/updateCoachScheduledCall',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/coach/schedule-call/update-schedule-calls/${id}`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An error occurred while updating the scheduled call'
                );
            }
        }
    }
);



const initialState = {
    coachProfileData: [], // Coach Profile Data
    updateProfileData: [],
    coachSlots: [], // Coach Slots
    coachSlotsByDate: [], // Coach Slots By Date
    coachSessions: [], // Coach Sessions,
    assignedCoachStudents: [], // Assigned Students to Coach
    coachScheduleStudents:[],
    assignedCoachBatches: [], // Assigned Students to Batch
    coachScheduleBatches:[],
    selectedCoachStudents: [], // Selected Students for creating Schedules
    selectedCoachBatches: [], // Selected Batches for creating Schedules
    myStudentData: [], // Coach My Students
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

    taCoachAllChatData: [], // All Chat Data
    chatRecordsbychatId: [], // All Chat Records by Chat Id
    createdChatId: {}, // new chat id

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
    updatedCoachScheduledCall: null,
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
            toast.success(
                action.payload.message ||
                    'Session have been successfully created'
            );
        });
        builder.addCase(updateCoachmenuprofile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.updateProfileData = [];
            toast.error(action.payload || 'Failed to Create TA Sessions');
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
            toast.success(
                action.payload.message || 'Coach Slots Created Successfully'
            );
        });
        builder.addCase(createCoachMenuSlot.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Slot time is clashing');
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
        // Create coach Sessions
        builder.addCase(createCoachMenuSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachMenuSession.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
            toast.success(
                action.payload.message ||
                    'Session have been successfully created'
            );
        });
        builder.addCase(createCoachMenuSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed to Create Coach Sessions');
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
        //get selected Assigend students
        builder.addCase(getSelectedCoachMenuAssignedStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getSelectedCoachMenuAssignedStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                console.log("PAYLOAD", action.payload.data)
                state.coachScheduleStudents = action.payload.data;
            }
        );
        builder.addCase(
            getSelectedCoachMenuAssignedStudents.rejected,
            (state, action) => {
                state.loading = false;
                state.coachScheduleStudents = [];
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
         // Get Selected Coach Assigned Batches
         builder.addCase(getSelectedCoachMenuAssignedBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getSelectedCoachMenuAssignedBatches.fulfilled,
            (state, action) => {
                state.loading = false;
                state.coachScheduleBatches = action.payload.data;
            }
        );
        builder.addCase(
            getSelectedCoachMenuAssignedBatches.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.coachScheduleBatches = [];
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
                //toast.success(action.payload.message);
            }
        );
        builder.addCase(getCoachMenuSlotsForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSlotsForLeave = [];
            toast.error(action.payload || 'No slots found ');
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
                toast.success(
                    action.payload.message ||
                        'Leave request has been successfully created.'
                );
            }
        );
        builder.addCase(
            getCoachMenuSessionForLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.coachSessionsForLeave = [];
                toast.error(action.payload || 'Failed To Mark Leave');
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
        // reason for leave
        builder.addCase(reasonForCoachMenuLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForCoachMenuLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.coachLeave = action.payload;
            toast.success(action.payload.message || 'Successfully created');
        });
        builder.addCase(reasonForCoachMenuLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Mark Leave');
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
        builder.addCase(coachUploadSessionRecording.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            coachUploadSessionRecording.fulfilled,
            (state, action) => {
                // Assuming the response contains session_recording_url
                state.sessionRecordingUrl =
                    action.payload.session_recording_url;
                toast.success(
                    action.payload.message || 'Video upload successfully !'
                );
            }
        );
        builder.addCase(
            coachUploadSessionRecording.rejected,
            (state, action) => {
                state.error = action.payload;
                toast.error(action.payload || 'Failed to Upload video');
            }
        );

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
                toast.success(action.payload.message || 'Successfully created');
            }
        );
        builder.addCase(
            rescheduleSessionForCoachLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Reschedule');
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
            console.log(
                'Chat Records by Chat Id in slice',
                action.payload.data
            );
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
            state.createdChatId = action.payload.data.id;
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

        // get Coach my students
        builder.addCase(getCoachMyStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachMyStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.myStudentData = action.payload.data;
        });
        builder.addCase(getCoachMyStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.myStudentData = [];
        });

        // Update Student In Session
        builder.addCase(updateStudentsInCoachSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            updateStudentsInCoachSession.fulfilled,
            (state, action) => {
                state.loading = false;
                // toast.success(
                //     action.payload.message ||
                //         'Students Updated Successfully in Session'
                // );
                // TODO :----->
            }
        );
        builder.addCase(
            updateStudentsInCoachSession.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                // toast.error(
                //     action.payload || 'Failed to Update Students in Session'
                // );
            }
        );

        // Update Batcches In Session
        builder.addCase(updateBatchesInCoachSession.pending, state => {
            state.loading = true;
        })
        builder.addCase(updateBatchesInCoachSession.fulfilled, (state, action) => {
            state.loading = false;
            // toast.success(action.payload.message || 'Batches Updated Successfully in Session')
            // TODO :----->
        })
        builder.addCase(updateBatchesInCoachSession.rejected, (state, action) => {
            state.loading = false;
            // toast.error(action.payload || 'Failed To Update Batches in Session')
            state.error = action.error.message;
        })
// update scheduled calls
        builder.addCase(updateCoachScheduledCall.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateCoachScheduledCall.fulfilled, (state, action) => {
            state.loading = false;
            //state.updatedScheduledCall = action.payload.data;
            toast.success(action.payload.message || 'Scheduled call updated successfully');
        });
        builder.addCase(updateCoachScheduledCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || 'Failed to update scheduled call');
        })
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
