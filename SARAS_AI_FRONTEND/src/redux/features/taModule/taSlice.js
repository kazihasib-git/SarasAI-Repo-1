import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTA = createAsyncThunk(
    "taModule/createTA",
    async (data) => {
        const response = await axios.post("http://localhost:5000/ta/create", data);
        return response.data;
    }
);

export const getTA = createAsyncThunk(
    "taModule/getTA",
    async () => {
        const response = await axios.get("http://localhost:5000/ta");
        return response.data;
    }
);

export const activateTA = createAsyncThunk(
    "taModule/activateTA",
    async (data) => {
        const response = await axios.put("http://localhost:5000/ta/update", data);
        return response.data;
    }
);

export const deactivateTA = createAsyncThunk(
    "taModule/updateTA",
    async (data) => {
        const response = await axios.put("http://localhost:5000/ta/update", data);
        return response.data;
    }
);


export const taSlice = createSlice({
    name: "taModule",
    initialState: {
        tas: [],
        loading: false,
        error: null,
    },
    reducers : {
        //TODO : Add the reducer here
        
    },
    extraReducers : (builder) =>{
        builder.addCase(createTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(createTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(getTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(getTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(activateTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(activateTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(activateTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });

        builder.addCase(deactivateTA.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(deactivateTA.fulfilled, (state, action) => {
            state.loading = false;
            state.tas = action.payload;
        });
        builder.addCase(deactivateTA.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
});


export const {  } = taSlice.actions;

export default taSlice.reducer;