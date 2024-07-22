import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
const accessToken = localStorage.getItem('accessToken');

// Get Coach profile
export const getCoachProfile = createAsyncThunk(
    'coach/getProfile',
    async () => {
        const response = await axios.get(
            `${baseUrl}/coach/coach-profile`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        )
        console.log(response.data,'response.data');
        return response.data
    }
)

// Update coach profile
export const updateCoachmenuprofile = createAsyncThunk(
    'coachMenu/updateprofile',
    async (data) => {
        const response = await axios.put(
            `${baseUrl}/coach/coach-profile`,data ,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(response.data,'response.data');
        return response.data;
    }
);

// Get Coach Slots
export const getCoachSlots = createAsyncThunk(
    'coachMenu/getSlots',
    async () => {
        const response = await axios.get(
            `${baseUrl}/coach/calendar/slots`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(response.data,'response.data');
        return response.data;
    }
)

// Get Coach Sessions
export const getCoachSessions = createAsyncThunk(
    'coachMenu/getSessions',
    async () => {
        const response = await axios.get(
            `${baseUrl}/coach/calendar/sessions`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log(response.data,'response.data');
        return response.data;
    }
)


//get slots for ta from date to end date

const initialState = {
    coachProfileData: [], // Coach Profile Data
    coachSlots : [], // Coach Slots
    coachSessions : [], // Coach Sessions
    loading : false,
    error : null
};

export const coachMenuSlice = createSlice({
    name: 'coachMenu',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        
        // Get Coach Profile Data
        builder.addCase(getCoachProfile.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getCoachProfile.fulfilled, (state, action) =>{
            state.loading = false;
            state.coachProfileData = action.payload.data;
        })
        builder.addCase(getCoachProfile.rejected, (state, action) => {
            state.loading= false;
            state.error = action.error.message
            state.coachProfileData = [];
        })
       

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
        builder.addCase(getCoachSlots.pending, (state) => {
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
        builder.addCase(getCoachSessions.pending, (state) => {
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

      
    },
});



export default coachMenuSlice.reducer;
