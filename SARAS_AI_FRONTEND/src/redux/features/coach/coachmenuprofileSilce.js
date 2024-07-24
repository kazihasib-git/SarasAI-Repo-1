import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import axiosInstance from '../../services/httpService';
import { toast } from 'react-toastify';
import { act } from 'react';
const accessToken = localStorage.getItem('accessToken');

// Get Coach profile
export const getCoachMenuProfile = createAsyncThunk(
    'coach/getProfile',
    async () => {
        console.log(accessToken, 'accessToken in function');
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
            `${baseUrl}/coach/calendar/create-sessions`,
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

const initialState = {
    coachProfileData: [], // Coach Profile Data
    coachSlots: [], // Coach Slots
    coachSlotsByDate: [], // Coach Slots By Date
    coachSessions: [], // Coach Sessions,
    assignedCoachStudents: [], // Assigned Students to Coach
    assignedCoachBatches: [], // Assigned Students to Batch
    selectedCoachStudents: [], // Selected Students for creating Schedules
    selectedCoachBatches: [], // Selected Batches for creating Schedules
    coachLeave: [],

    createCoachSlotsPopup: false,
    createCoachSessionPopup: false,
    createCoachLeavePopup: false,
    selectStudent: false, // Select to Schedule Sessions
    selectBatches: false, // Select to Schedule Sessions

    editStudent: false,
    editBatches: false,

    loading: false,
    error: null,
};

export const coachMenuSlice = createSlice({
    name: 'coachMenu',
    initialState,
    reducers: {
        openCreteSlotsPopup: (state, action) => {
            console.log('actions :', action.payload);
            state.createCoachSlotsPopup = action.payload;
            state.createCoachSessionPopup = false;
        },
        closeCreateSlotsPopup: (state, action) => {
            state.createCoachSlotsPopup = false;
        },
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
        openMarkLeavePopup: (state, action) => {
            state.createCoachLeavePopup = action.payload;
            state.createCoachSessionPopup = false;
            state.createCoachSlotsPopup = false;
        },
        closeMarkLeavePopup: (state, action) => {
            state.createCoachLeavePopup = action.payload;
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
            state.coachProfileData = action.payload.data;
        });
        builder.addCase(updateCoachmenuprofile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
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
        builder.addCase(createCoachMenuSession.pending, state => {
            state.loading = true;
        });
        builder.addCase(createCoachMenuSession.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSessions = action.payload.data;
        });
        builder.addCase(createCoachMenuSession.rejected, (state, action) => {
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
} = coachMenuSlice.actions;

export default coachMenuSlice.reducer;
