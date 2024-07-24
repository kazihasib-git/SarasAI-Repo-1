import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import axiosInstance from '../../services/httpService';
const accessToken = localStorage.getItem('accessToken');

// Get Coach profile
export const getCoachProfile = createAsyncThunk(
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
export const getCoachSlots = createAsyncThunk(
    'coachMenu/getSlots',
    async () => {
        const response = await axios.get(`${baseUrl}/coach/calendar/slots`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// Get Coach Sessions
export const getCoachSessions = createAsyncThunk(
    'coachMenu/getSessions',
    async () => {
        const response = await axios.get(`${baseUrl}/coach/calendar/sessions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// get Coach call requests
export const getCoachCallRequests = createAsyncThunk(
    'coachMenu/getCallRequests',
    async () => {
        const response = await axios.get(
            `${baseUrl}/coach/call-request/get-call-request`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

// approve call request
export const approveCallRequest = createAsyncThunk(
    'coachMenu/approveCallRequest',
    async id => {
        const response = await axios.get(
            `${baseUrl}/coach/call-request/approve-call-request/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//deny call request
export const denyCallRequest = createAsyncThunk(
    'coachMenu/denyCallRequest',
    async (id, reason) => {
        const response = await axios.put(
            `${baseUrl}/coach/call-request/denie-call-request/${id}`,
            {
                'reject-reason': reason,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);

//get Coach scheduled Calls
export const getCoachScheduledCalls = createAsyncThunk(
    'coachMenu/getScheduledCalls',
    async (date) => {
        const response = await axios.post(
            `${baseUrl}/coach/schedule-call/get-schedule-call`,
            {
                'date':date,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log(response.data, 'response.data');
        return response.data;
    }
);


//get slots for ta from date to end date

const initialState = {
    coachProfileData: [], // Coach Profile Data
    coachSlots: [], // Coach Slots
    coachSessions: [], // Coach Sessions
    loading: false,
    error: null,
    coachCallRequests: [],
    coachScheduledCalls: [],
};

export const coachMenuSlice = createSlice({
    name: 'coachMenu',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // Get Coach Profile Data
        builder.addCase(getCoachProfile.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.coachProfileData = action.payload.data;
        });
        builder.addCase(getCoachProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachProfileData = [];
        });

        // Get Today Available Ta
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
        builder.addCase(getCoachSlots.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachSlots.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSlots = action.payload.data;
        });
        builder.addCase(getCoachSlots.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSlots = [];
        });

        // Get Coach Sessions
        builder.addCase(getCoachSessions.pending, state => {
            state.loading = true;
        });
        builder.addCase(getCoachSessions.fulfilled, (state, action) => {
            state.loading = false;
            state.coachSessions = action.payload.data;
        });
        builder.addCase(getCoachSessions.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.coachSessions = [];
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
    },
});

export default coachMenuSlice.reducer;
