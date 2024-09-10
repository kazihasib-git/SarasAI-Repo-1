import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import axios from 'axios';
import axiosInstance from '../../services/httpService';
import { toast } from 'react-toastify';
const accessToken = localStorage.getItem('accessToken');

// Get Ta Profile
export const getTaMenuProfile = createAsyncThunk(
    'taMenu/getProfile',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/ta-profile`);
        return response.data;
    }
);

// Update Ta Profile
export const updateTaMenuProfile = createAsyncThunk(
    'taMenu/updateProfile',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/ta/ta-profile`,
                data
            );
            console.log(response.data, 'response.data');
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Geting coach Sessions for update profile'
                );
            }
        }
    }
);

// get ta's my students api
export const getMyStudents = createAsyncThunk(
    'taMenu/getMyStudents',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/my-student/get-all-student`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Ta Slots
export const getTaMenuSlots = createAsyncThunk('taMenu/getSlots', async () => {
    const response = await axiosInstance.get(`${baseUrl}/ta/calendar/slots`);
    console.log(response.data, 'response.data');
    return response.data;
});

// Create TA Slots
export const createTaMenuSlots = createAsyncThunk(
    'taMenu/createTaSlot',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/create-slots`,
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

// Get TA Slots by Date
export const getTaMenuSlotsByDate = createAsyncThunk(
    'taMenu/createTaSlotByDate',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/calendar/slots-by-date`,
            data
        );
        return response.data;
    }
);

// Get Ta Sessions
export const getTaMenuSessions = createAsyncThunk(
    'taMenu/getSessions',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/calendar/sessions`
        );
        return response.data;
    }
);

// TA SLots Between Dates
export const getTaMenuSlotsForLeave = createAsyncThunk(
    'taMenu/slotsForLeave',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/slot-between-dates`,
                data
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Creating Mark leave'
                );
            }
        }
    }
);

// Get TA Sessions for Leave by Slots
export const getTaMenuSessionForLeave = createAsyncThunk(
    'taMenu/getSessionForLeave',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/schedule-by-slots`,
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

// Cancel TA Session For Leave
export const cancelTaScheduledSessionForLeave = createAsyncThunk(
    'taMenu/cancelScheduledSession',
    async id => {
        const response = await axiosInstance.put(
            `${baseUrl}/ta/calendar/cancel-schedule/${id}`
        );
        return response.data;
    }
);

// TA Reason For Leave
export const reasonForTaMenuLeave = createAsyncThunk(
    'taMenu/reasonForLeave',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/create-leave`,
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

// Reschedule Session for TA Leave
export const rescheduleSessionForTaLeave = createAsyncThunk(
    'taMenu/rescheduleSession',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/reschedule/${id}`,
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

// ta menu call request
export const getTaCallRequests = createAsyncThunk(
    'taMenu/getCallRequests',
    async () => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/call-request/get-call-request`
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// ta approve call request
export const approveCallRequest = createAsyncThunk(
    'taMenu/approveCallRequest',
    async ({id, hostEmail }) => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/call-request/approve-call-request/${id}` , hostEmail
        );
        return response.data;
    }
);

//ta deny call
export const denyCallRequest = createAsyncThunk(
    'taMenu/denyCallRequest',
    async (id, reason) => {
        const response = await axiosInstance.put(
            `${baseUrl}/ta/call-request/denie-call-request/${id}`,
            {
                'reject-reason': reason,
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//ta scheduled Calls
export const getTaScheduledCalls = createAsyncThunk(
    'taMenu/getTaScheduledCalls',
    async data => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/schedule-call/get-schedule-call`,
            data
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//ta call records
export const getTaCallRecords = createAsyncThunk(
    'taMenu/getTaCallRecords',
    async date => {
        const response = await axiosInstance.post(
            `${baseUrl}/ta/call-recording/get-call-recording`,
            {
                date: date,
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Create TA Sessions
export const createTaMenuSessions = createAsyncThunk(
    'taMenu/createTaMenuSessions',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/schedule-call/schedule-calls`,
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

//Get assigned students
export const getTaMenuAssignedStudents = createAsyncThunk(
    'coachMenu/getAssignedStudents',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/get-students`);
        return response.data;
    }
);
//get Selected assigned students
export const getSelectedTaMenuAssignedStudents = createAsyncThunk(
    'coachMenu/getSelectedAssignedStudents',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/calendar/get-schedule-students/${id}`
        );
        return response.data;
    }
);

// Get Assigned Batches
export const getTaMenuAssignedBatches = createAsyncThunk(
    'coachMenu/getAssignedBatches',
    async () => {
        const response = await axiosInstance.get(`${baseUrl}/ta/get-batches`);
        return response.data;
    }
);

//get Selected Assigned Batches
export const getSelectedTaMenuAssignedBatches = createAsyncThunk(
    'coachMenu/getSelectedAssignedBatches',
    async id => {
        const response = await axiosInstance.get(
            `${baseUrl}/ta/calendar/get-schedule-batches/${id}`
        );
        return response.data;
    }
);

// Update Students In Ta Session
export const updateStudentsInTaSession = createAsyncThunk(
    'taMenu/updateStudentsInTaSession',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/update-schedule-students/${id}`,
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

// Update Batches in Ta Session
export const updateBatchesInTaSession = createAsyncThunk(
    'taMenu/updateBatchesInTaSession',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/ta/calendar/update-schedule-batches/${id}`,
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
            }
        }
    }
);

//upload video
export const uploadSessionRecording = createAsyncThunk(
    'taMenu/uploadSessionRecording',
    async ({ id, session_recording_url }, { rejectWithValue }) => {
        try {
            console.log('Assigning session notes with ID:', id);

            const response = await axiosInstance.put(
                `${baseUrl}/ta/call-recording/upload-session-recording/${id}`,

                { session_recording_url }
            );

            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An Error Occurred While Uploading video'
                );
            }
        }
    }
);

//session notes
export const assignSessionNotes = createAsyncThunk(
    'calls/assignSessionNotes',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            console.log('Assigning session notes with ID:', id);
            if (!id) {
                throw new Error('ID is required');
            }

            const response = await axios.put(
                `${baseUrl}/ta/call-recording/assign-session-notes/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error assigning session notes:', error);
            return rejectWithValue(
                error.response ? error.response.data : error.message
            );
        }
    }
);

export const updateTaScheduledCall = createAsyncThunk(
    'coachMenu/updateTaScheduledCall',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `${baseUrl}/ta/schedule-call/update-schedule-calls/${id}`,
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
    taProfileData: [], // TA Profile Data
    myStudentData: [], // TA My Students
    taSlots: [], // TA Slots
    taSlotsByDate: [], // TA Slots by Date
    taSessions: [], // TA Sessions
    taCallRequests: [], //Ta call request
    taScheduledCalls: [], // scheduled call
    selectedTaStudents: [],
    selectedTaBatches: [],
    assignedTaStudents: [],
    taScheduleStudents: [],
    assignedTaBatches: [],
    taScheduleBatches: [],
    taLeave: [],
    taRescheduleSessions: [],
    taCallRecords: [], //call recording

    sessionRecordingUrl: null,

    //For Leave
    slotsBetweenDates: [],
    sessionBySlots: [],

    selectTaStudent: false,
    selectTaBatches: false,

    createTaSlotsPopup: false,
    createTaSessionPopup: false,
    createTaLeavePop: false,

    loading: false,
    error: null,
    sessionNotesData: [],
    updatedTaScheduledCall: null,
};

export const taMenuSlice = createSlice({
    name: 'taMenu',
    initialState,
    reducers: {
        openTaMenuCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = true;
            state.createTaSessionPopup = false;
        },
        closeTaMenuCreateSlotsPopup: (state, action) => {
            state.createTaSlotsPopup = false;
        },
        openTaMenuCreateSessionsPopup: (state, action) => {
            state.createTaSessionPopup = true;
            if (action.payload.student) {
                state.selectedTaStudents = action.payload.student;
            }
            if (action.payload.batches) {
                state.selectedTaBatches = action.payload.batches;
            }
            state.createTaSlotsPopup = false;
        },
        closeTaMenuCreateSessionsPopup: (state, action) => {
            state.createTaSessionPopup = false;
            state.selectedTaBatches = [];
            state.selectedTaStudents = [];
        },
        openTaMenuSelectStudents: (state, action) => {
            state.selectTaStudent = true;
        },
        closeTaMenuSelectStudents: (state, action) => {
            state.selectTaStudent = false;
        },
        openTaMenuSelectBatches: (state, action) => {
            state.selectTaBatches = true;
        },
        closeTaMenuSelectBatches: (state, action) => {
            state.selectTaBatches = false;
        },
        // callRecordings: callRecordingsReducer,
    },
    extraReducers: builder => {
        // Get Ta Profile Data
        builder.addCase(getTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
        });
        builder.addCase(getTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taProfileData = [];
        });

        // update Ta Profile Data
        builder.addCase(updateTaMenuProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTaMenuProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.taProfileData = action.payload.data;
            toast.success(
                action.payload.message || 'profile update successfully'
            );
        });
        builder.addCase(updateTaMenuProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed to Update profile');
        });

        // get ta's my students
        builder.addCase(getMyStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(getMyStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.myStudentData = action.payload.data;
        });
        builder.addCase(getMyStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.myStudentData = [];
        });

        // Get Ta Slots
        builder.addCase(getTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
        });
        builder.addCase(getTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Get Ta Slots By Date
        builder.addCase(getTaMenuSlotsByDate.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlotsByDate.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlotsByDate = action.payload.data;
        });
        builder.addCase(getTaMenuSlotsByDate.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taSlotsByDate = [];
        });

        // Create Ta Slots
        builder.addCase(createTaMenuSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.taSlots = action.payload.data;
            toast.success(
                action.payload.message || 'TA Slots Created Successfully'
            );
        });
        builder.addCase(createTaMenuSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
            toast.error(
                action.payload || 'Failed To Update TA. Please Try Again'
            );
        });

        // Get Ta Sessions
        builder.addCase(getTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
        });
        builder.addCase(getTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        // Create TA Sessions
        builder.addCase(createTaMenuSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(createTaMenuSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.taSessions = action.payload.data;
            toast.success(
                action.payload.message ||
                    'Session have been successfully created'
            );
        });
        builder.addCase(createTaMenuSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed to Create TA Sessions');
        });

        // Get Slots Between Dates
        builder.addCase(getTaMenuSlotsForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSlotsForLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.slotsBetweenDates = action.payload.data;
            // toast.success(action.payload.message || 'Successfully created');
        });
        builder.addCase(getTaMenuSlotsForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Mark Leave');
        });

        // Get Session By Slots for Leave
        builder.addCase(getTaMenuSessionForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuSessionForLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.sessionBySlots = action.payload.data;
            toast.success(action.payload.message || 'Successfully created');
        });
        builder.addCase(getTaMenuSessionForLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.sessionBySlots = [];
            toast.error(action.payload || 'Failed To Mark Leave');
        });

        // Cancel TA Scheduled Sessions
        builder.addCase(cancelTaScheduledSessionForLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            cancelTaScheduledSessionForLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                // state.  = action.payload;
            }
        );
        builder.addCase(
            cancelTaScheduledSessionForLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            }
        );

        // TA Reason For Leave
        builder.addCase(reasonForTaMenuLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(reasonForTaMenuLeave.fulfilled, (state, action) => {
            state.loading = false;
            state.taLeave = action.payload;
            toast.success(
                action.payload.message ||
                    'Leave request has been successfully created.'
            );
        });
        builder.addCase(reasonForTaMenuLeave.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            toast.error(action.payload || 'Failed To Mark Leave');
        });

        // TA Reschedule For Leave
        builder.addCase(rescheduleSessionForTaLeave.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            rescheduleSessionForTaLeave.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taRescheduleSessions = action.payload.data;
                toast.success(action.payload.message || 'Successfully created');
            }
        );
        builder.addCase(
            rescheduleSessionForTaLeave.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                toast.error(action.payload || 'Failed To Reschedule');
            }
        );

        //get tamenu call requests
        builder.addCase(getTaCallRequests.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaCallRequests.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRequests = action.payload.data;
        });
        builder.addCase(getTaCallRequests.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taCallRequests = [];
        });

        //approve call request
        builder.addCase(approveCallRequest.pending, state => {
            state.loading = true;
        });
        builder.addCase(approveCallRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRequests = state.taCallRequests.map(request =>
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
            state.taCallRequests = state.taCallRequests.filter(
                request => request.id !== action.payload.data.id
            );
        });
        builder.addCase(denyCallRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        //get ta scheduled calls
        builder.addCase(getTaScheduledCalls.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaScheduledCalls.fulfilled, (state, action) => {
            state.loading = false;
            state.taScheduledCalls = action.payload.data;
        });
        builder.addCase(getTaScheduledCalls.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taScheduledCalls = [];
        });

        //get ta call records
        builder.addCase(getTaCallRecords.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaCallRecords.fulfilled, (state, action) => {
            state.loading = false;
            state.taCallRecords = action.payload.data;
        });
        builder.addCase(getTaCallRecords.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.taCallRecords = [];
        });

        // get ta assigned students
        builder.addCase(getTaMenuAssignedStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getTaMenuAssignedStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                state.assignedTaStudents = action.payload; //.data;
            }
        );
        builder.addCase(getTaMenuAssignedStudents.rejected, (state, action) => {
            state.loading = false;
            state.assignedTaStudents = [];
            state.error = action.error.message;
        });
        //get ta selected assigend students
        builder.addCase(getSelectedTaMenuAssignedStudents.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getSelectedTaMenuAssignedStudents.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taScheduleStudents = action.payload.data;
            }
        );
        builder.addCase(
            getSelectedTaMenuAssignedStudents.rejected,
            (state, action) => {
                state.loading = false;
                state.taScheduleStudents = [];
                state.error = action.error.message;
            }
        );

        // Get ta Assigned Batches
        builder.addCase(getTaMenuAssignedBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(getTaMenuAssignedBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.assignedTaBatches = action.payload; //.data;
        });
        builder.addCase(getTaMenuAssignedBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.assignedTaBatches = [];
        });

        // Get ta Selected Assigned Batches
        builder.addCase(getSelectedTaMenuAssignedBatches.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            getSelectedTaMenuAssignedBatches.fulfilled,
            (state, action) => {
                state.loading = false;
                state.taScheduleBatches = action.payload.data;
            }
        );
        builder.addCase(
            getSelectedTaMenuAssignedBatches.rejected,
            (state, action) => {
                state.loading = false;
                state.error = action.error.message;
                state.taScheduleBatches = [];
            }
        );

        // Update Students In Session
        builder.addCase(updateStudentsInTaSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(
            updateStudentsInTaSession.fulfilled,
            (state, action) => {
                state.loading = false;
                //toast.success(action.payload.message || 'Students Updated Successfully in Session')
                // TODO : ----->
            }
        );
        builder.addCase(updateStudentsInTaSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            //toast.error(action.payload || 'Failed to Update Students in Session')
        });

        //Update Batches In Session
        builder.addCase(updateBatchesInTaSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateBatchesInTaSession.fulfilled, (state, action) => {
            state.loading = false;
            //toast.success(action.payload.message || 'Batches Updated Successfully')
            // TODO : ----->
        });
        builder.addCase(updateBatchesInTaSession.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            //toast.error(action.payload || 'Failed to Update Batches in Session')
        });

        //upload video
        builder.addCase(uploadSessionRecording.pending, state => {
            state.loading = true;
        });
        builder.addCase(uploadSessionRecording.fulfilled, (state, action) => {
            state.sessionRecordingUrl = action.payload.session_recording_url;
            toast.success(
                action.payload.message || 'Video upload successfully !'
            );
        });
        builder.addCase(uploadSessionRecording.rejected, (state, action) => {
            state.error = action.payload;
            toast.error(action.payload || 'Failed to Upload video');
        });

        //session notes

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

        builder.addCase(updateTaScheduledCall.pending, state => {
            state.loading = true;
        });
        builder.addCase(updateTaScheduledCall.fulfilled, (state, action) => {
            state.loading = false;
            //state.updatedScheduledCall = action.payload.data;
            toast.success(
                action.payload.message || 'Scheduled call updated successfully'
            );
        });
        builder.addCase(updateTaScheduledCall.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            toast.error(action.payload || 'Failed to update scheduled call');
        });
    },
});

export const {
    openTaMenuCreateSlotsPopup,
    closeTaMenuCreateSlotsPopup,
    openTaMenuCreateSessionsPopup,
    closeTaMenuCreateSessionsPopup,
    openTaMenuSelectStudents,
    closeTaMenuSelectStudents,
    openTaMenuSelectBatches,
    closeTaMenuSelectBatches,
} = taMenuSlice.actions;
export default taMenuSlice.reducer;
