import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getCourses = createAsyncThunk(
    "courses/getCourses",
    async () => {
        const response = await axios.get("http://localhost:5000/courses");
        return response.data;
    }
);

export const coursesSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        loading: false,
        error: null,
    },
    reducers : {
        //TODO : Add the reducer here
        
    },
    extraReducers : (builder) =>{
        builder.addCase(getCourses.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getCourses.fulfilled, (state, action) => {
            state.loading = false;
            state.courses = action.payload;
        });
        builder.addCase(getCourses.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
})