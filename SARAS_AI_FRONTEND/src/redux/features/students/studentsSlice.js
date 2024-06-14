import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getStudents = createAsyncThunk(
    "students/getStudents",
    async () => {
        const response = await axios.get("http://localhost:5000/students");
        if(response.status !== 200){
            throw new Error("Failed to fetch students");
        }
        return response.data;
    }
);

export const studentsSlice = createSlice({
    name: "students",
    initialState: {
        students: [],
        loading: false,
        error: null,
    },
    reducers : {
        //TODO : Add the reducer here
        
    },
    extraReducers : (builder) =>{
        builder.addCase(getStudents.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getStudents.fulfilled, (state, action) => {
            state.loading = false;
            state.students = action.payload;
        });
        builder.addCase(getStudents.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    }
})


export const {} = studentsSlice.actions;

export default studentsSlice.reducer;