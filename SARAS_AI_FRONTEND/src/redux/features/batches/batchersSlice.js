import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getBatches = createAsyncThunk(
    "batches/getBatches",
    async () => {
        const response = await axios.get("http://localhost:5000/batches");
        return response.data;
    }
);


export const batchesSlice = createSlice({
    name: "batches",
    initialState: {
        batches: [],
        loading: false,
        error: null,
    },
    reducers : {
        //TODO : Add the reducer here
        
    },
    extraReducers : (builder) =>{
        builder.addCase(getBatches.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getBatches.fulfilled, (state, action) => {
            state.loading = false;
            state.batches = action.payload;
        });
        builder.addCase(getBatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
})


export const {} = batchesSlice.actions;

export default batchesSlice.reducer;