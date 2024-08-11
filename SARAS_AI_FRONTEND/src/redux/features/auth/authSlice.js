import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/httpService';

// login api
export const login = createAsyncThunk('login', async data => {
    const response = await axiosInstance.post(`${baseUrl}/login`, data);
    return response.data;
});

export const logout = createAsyncThunk('logout', async () => {
    const response = await axiosInstance.post(`${baseUrl}/logout`);
    return response.data;
});

const initialState = {
    userData: {},
    login: false,
    role: null,
    accessToken: null,
    loading: false,
    error: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            console.log('action.payload :', action.payload);
            state.login = action.payload.login;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
        },
    },
    extraReducers: builder => {
        //user login
        builder.addCase(login.pending, state => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.login = true;
            state.role = action.payload.role;
            state.accessToken = action.payload.access_token;
            localStorage.setItem('login', true);
            localStorage.setItem('accessToken', action.payload.access_token);
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem('timezone_id', action.payload.admin_user.timezone_id)
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.userData = [];
            state.login = false;
        });

        // user logout
        builder.addCase(logout.pending, state => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.login = false;
            state.userData = [];
            localStorage.setItem('login', false);
            localStorage.setItem('accessToken', '');
            localStorage.setItem('role', '');
            localStorage.setItem('timezone_id', '')
        });
    },
});

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;
